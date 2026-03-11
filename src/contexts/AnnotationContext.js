import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  validateToken,
  findAnnotationGist,
  createAnnotationGist,
  updateGistFiles,
  getGist
} from '../services/githubService';
import {
  encodeToken,
  decodeToken,
  groupAnnotationsByPath,
  convertToGistFiles,
  parseAllGistFiles,
  getTokenStorageKey,
  getGistIdStorageKey,
  getUserInfoStorageKey,
  getAnnotationsStorageKey,
  getLocalBackupStorageKey
} from '../utils/gistHelpers';

const AnnotationContext = createContext(null);

export function useAnnotationContext() {
  const context = useContext(AnnotationContext);
  if (!context) {
    throw new Error('useAnnotationContext must be used within AnnotationProvider');
  }
  return context;
}

export function AnnotationProvider({ children }) {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [githubToken, setGithubToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  // Gist state
  const [gistId, setGistId] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [allAnnotations, setAllAnnotations] = useState({});

  // Sync state
  // eslint-disable-next-line no-unused-vars
  const [isSyncing, setIsSyncing] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [lastSyncTime, setLastSyncTime] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [syncError, setSyncError] = useState(null);

  // Track last load time to avoid frequent reloading
  const lastLoadTimeRef = useRef(null);

  // Restore auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(getTokenStorageKey());
    const storedGistId = localStorage.getItem(getGistIdStorageKey());
    const storedUserInfo = localStorage.getItem(getUserInfoStorageKey());

    if (storedToken && storedUserInfo) {
      try {
        const token = decodeToken(storedToken);
        const userInfo = JSON.parse(storedUserInfo);

        setGithubToken(token);
        setUsername(userInfo.username);
        setAvatarUrl(userInfo.avatarUrl);
        setGistId(storedGistId);
        setIsAuthenticated(true);

        // Load annotations from Gist
        if (storedGistId) {
          loadAnnotationsFromGist(token, storedGistId);
        }
      } catch (error) {
        console.error('Failed to restore auth state:', error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load annotations from Gist
  const loadAnnotationsFromGist = useCallback(async (token, gistIdToLoad) => {
    try {
      setIsSyncing(true);
      const gist = await getGist(token, gistIdToLoad);
      const allAnnots = parseAllGistFiles(gist.files);
      const grouped = groupAnnotationsByPath(allAnnots);

      setAllAnnotations(grouped);

      // Set annotations for current path
      const currentPath = window.location.pathname;
      setAnnotations(grouped[currentPath] || []);

      setLastSyncTime(new Date());
      setSyncError(null);
    } catch (error) {
      console.error('Failed to load from Gist:', error);

      // If Gist doesn't exist (was deleted), clean up and recreate
      if (error.message.includes('Failed to get gist')) {
        console.log('Gist not found, creating new one...');
        localStorage.removeItem(getGistIdStorageKey());
        setGistId(null);

        // Try to recreate Gist
        try {
          // Get backup data from localStorage, if none use empty object
          const localBackup = localStorage.getItem(getAnnotationsStorageKey());
          let dataToUse = {};

          if (localBackup) {
            const annotations = JSON.parse(localBackup);
            dataToUse = groupAnnotationsByPath(annotations);
          } else if (Object.keys(allAnnotations).length > 0) {
            dataToUse = allAnnotations;
          }

          const files = convertToGistFiles(dataToUse);
          const newGist = await createAnnotationGist(token, files);
          localStorage.setItem(getGistIdStorageKey(), newGist.id);
          setGistId(newGist.id);

          // Update allAnnotations
          setAllAnnotations(dataToUse);
          const currentPath = window.location.pathname;
          setAnnotations(dataToUse[currentPath] || []);

          setSyncError(null);
        } catch (createError) {
          console.error('Failed to create new gist:', createError);
          setSyncError('Gist was deleted. Failed to create new one.');
        }
      } else {
        setSyncError(error.message);
      }
    } finally {
      setIsSyncing(false);
    }
  }, [allAnnotations]);

  // Login with GitHub token
  const login = useCallback(async (token) => {
    try {
      // Validate token
      const validation = await validateToken(token);
      if (!validation.valid) {
        throw new Error(validation.error || 'Invalid token');
      }

      const { user } = validation;

      // Check if we need to migrate from localStorage
      const localData = localStorage.getItem(getAnnotationsStorageKey());
      let wasMigrated = false;

      // Find or create annotation gist
      let gist = await findAnnotationGist(token);
      if (!gist) {
        if (localData) {
          const localAnnotations = JSON.parse(localData);
          const grouped = groupAnnotationsByPath(localAnnotations);
          const files = convertToGistFiles(grouped);

          gist = await createAnnotationGist(token, files);

          // Backup local data
          localStorage.setItem(getLocalBackupStorageKey(), localData);
          wasMigrated = true;
        } else {
          gist = await createAnnotationGist(token);
        }
      }

      // Save auth state
      localStorage.setItem(getTokenStorageKey(), encodeToken(token));
      localStorage.setItem(getGistIdStorageKey(), gist.id);
      localStorage.setItem(getUserInfoStorageKey(), JSON.stringify({
        username: user.username,
        avatarUrl: user.avatarUrl
      }));

      setGithubToken(token);
      setUsername(user.username);
      setAvatarUrl(user.avatarUrl);
      setGistId(gist.id);
      setIsAuthenticated(true);

      // Load annotations from Gist
      await loadAnnotationsFromGist(token, gist.id);

      return { success: true, migrated: wasMigrated };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message };
    }
  }, [loadAnnotationsFromGist]);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem(getTokenStorageKey());
    localStorage.removeItem(getGistIdStorageKey());
    localStorage.removeItem(getUserInfoStorageKey());

    setGithubToken(null);
    setUsername(null);
    setAvatarUrl(null);
    setGistId(null);
    setIsAuthenticated(false);
    setAllAnnotations({});
    setAnnotations([]);
  }, []);

  // Sync to Gist
  const syncToGist = useCallback(async (dataToSync = null) => {
    if (!isAuthenticated || !githubToken || !gistId) {
      return;
    }

    try {
      setIsSyncing(true);
      setSyncError(null);

      // Convert all annotations to Gist files format
      // Use provided data or current allAnnotations
      const files = convertToGistFiles(dataToSync || allAnnotations);

      // Update Gist
      await updateGistFiles(githubToken, gistId, files);

      setLastSyncTime(new Date());
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncError(error.message);
    } finally {
      setIsSyncing(false);
    }
  }, [isAuthenticated, githubToken, gistId, allAnnotations]);

  // Add annotation
  const addAnnotation = useCallback((text, note, path, pageTitle = null) => {
    const newAnnotation = {
      id: Date.now(),
      text,
      note,
      path,
      pageTitle: pageTitle || path.split('/').pop() || 'Untitled',
      createdAt: new Date().toISOString()
    };

    // Update state
    const updatedForPath = [...(allAnnotations[path] || []), newAnnotation];
    const updatedAll = {
      ...allAnnotations,
      [path]: updatedForPath
    };

    setAllAnnotations(updatedAll);

    if (path === window.location.pathname) {
      setAnnotations(updatedForPath);
    }

    // Save to Gist immediately
    syncToGist(updatedAll);

    return newAnnotation;
  }, [allAnnotations, syncToGist]);

  // Update annotation
  const updateAnnotation = useCallback((id, note, path) => {
    const updatedForPath = (allAnnotations[path] || []).map(annotation =>
      annotation.id === id
        ? { ...annotation, note, updatedAt: new Date().toISOString() }
        : annotation
    );

    const updatedAll = {
      ...allAnnotations,
      [path]: updatedForPath
    };

    setAllAnnotations(updatedAll);

    if (path === window.location.pathname) {
      setAnnotations(updatedForPath);
    }

    // Save to Gist immediately
    syncToGist(updatedAll);
  }, [allAnnotations, syncToGist]);

  // Delete annotation
  const deleteAnnotation = useCallback((id, path) => {
    const updatedForPath = (allAnnotations[path] || []).filter(a => a.id !== id);
    const updatedAll = {
      ...allAnnotations,
      [path]: updatedForPath
    };

    setAllAnnotations(updatedAll);

    if (path === window.location.pathname) {
      setAnnotations(updatedForPath);
    }

    // Save to Gist immediately
    syncToGist(updatedAll);
  }, [allAnnotations, syncToGist]);

  // Load annotations for a specific page
  const loadAnnotationsForPage = useCallback(async (path) => {
    // If authenticated, reload latest data from Gist first
    if (isAuthenticated && githubToken && gistId) {
      // Avoid reloading within 5 seconds
      const now = Date.now();
      if (!lastLoadTimeRef.current || now - lastLoadTimeRef.current > 5000) {
        lastLoadTimeRef.current = now;
        await loadAnnotationsFromGist(githubToken, gistId);
      } else {
        setAnnotations(allAnnotations[path] || []);
      }
    } else {
      setAnnotations(allAnnotations[path] || []);
    }
  }, [isAuthenticated, githubToken, gistId, allAnnotations, loadAnnotationsFromGist]);

  const value = {
    // Auth state
    isAuthenticated,
    githubToken,
    username,
    avatarUrl,

    // Gist state
    gistId,
    annotations,
    allAnnotations,

    // Methods
    login,
    logout,
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
    loadAnnotationsForPage
  };

  return (
    <AnnotationContext.Provider value={value}>
      {children}
    </AnnotationContext.Provider>
  );
}
