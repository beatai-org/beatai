/**
 * Gist Helper Utilities
 * Helper functions for working with GitHub Gist data
 */

/**
 * Convert a document path to a valid Gist filename
 * Example: "/docs/getting-started/introduction" -> "docs-getting-started-introduction.json"
 * @param {string} path - Document path
 * @returns {string} - Gist filename
 */
export function pathToFilename(path) {
  // Remove leading slash and replace remaining slashes with hyphens
  const cleanPath = path.replace(/^\//, '').replace(/\//g, '-');
  // Ensure .json extension
  return `${cleanPath}.json`;
}

/**
 * Convert a Gist filename back to a document path
 * Example: "docs-getting-started-introduction.json" -> "/docs/getting-started/introduction"
 * @param {string} filename - Gist filename
 * @returns {string} - Document path
 */
export function filenameToPath(filename) {
  // Remove .json extension and replace hyphens with slashes
  const path = filename.replace(/\.json$/, '').replace(/-/g, '/');
  // Ensure leading slash
  return `/${path}`;
}

/**
 * Encode token for storage (simple base64 encoding)
 * Note: This is NOT encryption, just obfuscation
 * @param {string} token - GitHub PAT
 * @returns {string} - Encoded token
 */
export function encodeToken(token) {
  try {
    return btoa(token);
  } catch (error) {
    console.error('Failed to encode token:', error);
    return token;
  }
}

/**
 * Decode token from storage
 * @param {string} encoded - Encoded token
 * @returns {string} - Decoded token
 */
export function decodeToken(encoded) {
  try {
    return atob(encoded);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return encoded;
  }
}

/**
 * Format annotations for Gist file storage
 * @param {Array} annotations - Array of annotation objects
 * @param {string} path - Document path
 * @returns {string} - JSON string for Gist file content
 */
export function formatAnnotationsForGist(annotations, path) {
  const data = {
    path,
    annotations: annotations.map(annotation => ({
      id: annotation.id,
      text: annotation.text,
      note: annotation.note,
      pageTitle: annotation.pageTitle,
      createdAt: annotation.createdAt,
      updatedAt: annotation.updatedAt || annotation.createdAt
    })),
    metadata: {
      lastModified: new Date().toISOString(),
      version: '1.0'
    }
  };

  return JSON.stringify(data, null, 2);
}

/**
 * Parse Gist file content
 * @param {string} content - JSON string from Gist file
 * @returns {object} - Parsed annotation data
 */
export function parseGistFileContent(content) {
  try {
    const data = JSON.parse(content);
    return {
      path: data.path || '',
      annotations: data.annotations || [],
      metadata: data.metadata || {}
    };
  } catch (error) {
    console.error('Failed to parse Gist file content:', error);
    return {
      path: '',
      annotations: [],
      metadata: {}
    };
  }
}

/**
 * Group annotations by path
 * @param {Array} annotations - Array of annotation objects
 * @returns {Object} - Annotations grouped by path
 */
export function groupAnnotationsByPath(annotations) {
  return annotations.reduce((grouped, annotation) => {
    const path = annotation.path || '/';
    if (!grouped[path]) {
      grouped[path] = [];
    }
    grouped[path].push(annotation);
    return grouped;
  }, {});
}

/**
 * Convert grouped annotations to Gist files format
 * @param {Object} grouped - Annotations grouped by path
 * @returns {Object} - Gist files format
 */
export function convertToGistFiles(grouped) {
  const files = {};

  Object.entries(grouped).forEach(([path, annotations]) => {
    const filename = pathToFilename(path);
    files[filename] = {
      content: formatAnnotationsForGist(annotations, path)
    };
  });

  return files;
}

/**
 * Parse all files from a Gist into a flat array of annotations
 * @param {Object} gistFiles - Files object from GitHub Gist API
 * @returns {Array} - Flat array of all annotations
 */
export function parseAllGistFiles(gistFiles) {
  const allAnnotations = [];

  Object.entries(gistFiles).forEach(([filename, fileData]) => {
    // Skip non-JSON files
    if (!filename.endsWith('.json')) {
      return;
    }

    const parsed = parseGistFileContent(fileData.content);
    // Add path field to each annotation
    const annotationsWithPath = parsed.annotations.map(annotation => ({
      ...annotation,
      path: parsed.path  // Get path from file data
    }));
    allAnnotations.push(...annotationsWithPath);
  });

  return allAnnotations;
}

/**
 * Get storage key for token
 * @returns {string}
 */
export function getTokenStorageKey() {
  return 'beatai-github-token';
}

/**
 * Get storage key for gist ID
 * @returns {string}
 */
export function getGistIdStorageKey() {
  return 'beatai-gist-id';
}

/**
 * Get storage key for user info
 * @returns {string}
 */
export function getUserInfoStorageKey() {
  return 'beatai-user-info';
}

/**
 * Get storage key for local annotations backup
 * @returns {string}
 */
export function getLocalBackupStorageKey() {
  return 'doc-annotations-backup';
}

/**
 * Get storage key for annotations (legacy)
 * @returns {string}
 */
export function getAnnotationsStorageKey() {
  return 'doc-annotations';
}
