import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  validateToken,
  findAnnotationGist,
  createAnnotationGist,
  updateGistFiles,
  getPublicGist,
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

  // Shared mode state
  const [isViewingShared, setIsViewingShared] = useState(false);
  const [sharedGistId, setSharedGistId] = useState(null);
  const [sharedUsername, setSharedUsername] = useState(null);

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [syncError, setSyncError] = useState(null);

  // Fallback to localStorage
  const [useLocalStorage, setUseLocalStorage] = useState(false);

  // Debounce timer for auto-sync
  const syncTimerRef = useRef(null);

  // Load auth state from localStorage on mount
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
        setUseLocalStorage(false);

        // Load annotations from Gist
        if (storedGistId) {
          loadAnnotationsFromGist(token, storedGistId);
        }
      } catch (error) {
        console.error('Failed to restore auth state:', error);
        setUseLocalStorage(true);
        loadAnnotationsFromLocalStorage();
      }
    } else {
      // Not authenticated, use localStorage
      setUseLocalStorage(true);
      loadAnnotationsFromLocalStorage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load annotations from localStorage
  const loadAnnotationsFromLocalStorage = useCallback(() => {
    const saved = localStorage.getItem(getAnnotationsStorageKey());
    if (saved) {
      try {
        const loaded = JSON.parse(saved);
        const grouped = groupAnnotationsByPath(loaded);
        setAllAnnotations(grouped);

        // Set annotations for current path
        const currentPath = window.location.pathname;
        setAnnotations(grouped[currentPath] || []);
      } catch (error) {
        console.error('Failed to load from localStorage:', error);
      }
    }
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
      setSyncError(error.message);
      // Fallback to localStorage
      loadAnnotationsFromLocalStorage();
    } finally {
      setIsSyncing(false);
    }
  }, [loadAnnotationsFromLocalStorage]);

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
      setUseLocalStorage(false);

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
    setUseLocalStorage(true);

    // Load annotations from localStorage
    loadAnnotationsFromLocalStorage();
  }, [loadAnnotationsFromLocalStorage]);

  // Sync to Gist with debouncing
  const syncToGist = useCallback(async (immediate = false) => {
    if (!isAuthenticated || !githubToken || !gistId || useLocalStorage) {
      return;
    }

    // Clear existing timer
    if (syncTimerRef.current) {
      clearTimeout(syncTimerRef.current);
    }

    const doSync = async () => {
      try {
        setIsSyncing(true);
        setSyncError(null);

        // Convert all annotations to Gist files format
        const files = convertToGistFiles(allAnnotations);

        // Update Gist
        await updateGistFiles(githubToken, gistId, files);

        setLastSyncTime(new Date());
      } catch (error) {
        console.error('Sync failed:', error);
        setSyncError(error.message);
      } finally {
        setIsSyncing(false);
      }
    };

    if (immediate) {
      await doSync();
    } else {
      // Debounce: sync after 3 seconds of inactivity
      syncTimerRef.current = setTimeout(doSync, 3000);
    }
  }, [isAuthenticated, githubToken, gistId, useLocalStorage, allAnnotations]);

  // Add annotation
  const addAnnotation = useCallback((text, note, path) => {
    const newAnnotation = {
      id: Date.now(),
      text,
      note,
      path,
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

    // Save to storage
    if (useLocalStorage) {
      const flatAnnotations = Object.values(updatedAll).flat();
      localStorage.setItem(getAnnotationsStorageKey(), JSON.stringify(flatAnnotations));
    } else {
      syncToGist();
    }

    return newAnnotation;
  }, [allAnnotations, useLocalStorage, syncToGist]);

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

    // Save to storage
    if (useLocalStorage) {
      const flatAnnotations = Object.values(updatedAll).flat();
      localStorage.setItem(getAnnotationsStorageKey(), JSON.stringify(flatAnnotations));
    } else {
      syncToGist();
    }
  }, [allAnnotations, useLocalStorage, syncToGist]);

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

    // Save to storage
    if (useLocalStorage) {
      const flatAnnotations = Object.values(updatedAll).flat();
      localStorage.setItem(getAnnotationsStorageKey(), JSON.stringify(flatAnnotations));
    } else {
      syncToGist();
    }
  }, [allAnnotations, useLocalStorage, syncToGist]);

  // Load annotations for a specific page
  const loadAnnotationsForPage = useCallback((path) => {
    setAnnotations(allAnnotations[path] || []);
  }, [allAnnotations]);

  // Load shared annotations
  const loadSharedAnnotations = useCallback(async (sharedGistIdToLoad) => {
    try {
      setIsSyncing(true);
      const gist = await getPublicGist(sharedGistIdToLoad);

      const allAnnots = parseAllGistFiles(gist.files);
      const grouped = groupAnnotationsByPath(allAnnots);

      setAllAnnotations(grouped);
      setSharedGistId(sharedGistIdToLoad);
      setSharedUsername(gist.owner?.login || 'Unknown');
      setIsViewingShared(true);

      // Set annotations for current path
      const currentPath = window.location.pathname;
      setAnnotations(grouped[currentPath] || []);

      setSyncError(null);
    } catch (error) {
      console.error('Failed to load shared annotations:', error);
      setSyncError(error.message);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Exit shared mode
  const exitSharedMode = useCallback(() => {
    setIsViewingShared(false);
    setSharedGistId(null);
    setSharedUsername(null);

    // Reload user's own annotations
    if (isAuthenticated && githubToken && gistId) {
      loadAnnotationsFromGist(githubToken, gistId);
    } else {
      loadAnnotationsFromLocalStorage();
    }
  }, [isAuthenticated, githubToken, gistId, loadAnnotationsFromGist, loadAnnotationsFromLocalStorage]);

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

    // Shared mode
    isViewingShared,
    sharedGistId,
    sharedUsername,

    // Sync state
    isSyncing,
    lastSyncTime,
    syncError,

    // Storage mode
    useLocalStorage,

    // Methods
    login,
    logout,
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
    loadAnnotationsForPage,
    loadSharedAnnotations,
    exitSharedMode,
    syncToGist
  };

  return (
    <AnnotationContext.Provider value={value}>
      {children}
    </AnnotationContext.Provider>
  );
}
