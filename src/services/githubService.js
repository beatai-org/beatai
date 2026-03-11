/**
 * GitHub API Service
 * Handles all GitHub API interactions for Gist-based annotation storage
 */

const GITHUB_API = 'https://api.github.com';
const GIST_DESCRIPTION = 'BeatAI Documentation Annotations';

/**
 * Validate GitHub Personal Access Token
 * @param {string} token - GitHub PAT
 * @returns {Promise<{valid: boolean, user?: object, error?: string}>}
 */
export async function validateToken(token) {
  try {
    const response = await fetch(`${GITHUB_API}/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (response.ok) {
      const user = await response.json();
      return {
        valid: true,
        user: {
          username: user.login,
          avatarUrl: user.avatar_url,
          name: user.name
        }
      };
    } else {
      return {
        valid: false,
        error: response.status === 401 ? 'Invalid token' : 'Failed to validate token'
      };
    }
  } catch (error) {
    return {
      valid: false,
      error: error.message
    };
  }
}

/**
 * Get user information
 * @param {string} token - GitHub PAT
 * @returns {Promise<object>}
 */
export async function getUserInfo(token) {
  const response = await fetch(`${GITHUB_API}/user`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to get user info');
  }

  const user = await response.json();
  return {
    username: user.login,
    avatarUrl: user.avatar_url,
    name: user.name
  };
}

/**
 * Get all user gists
 * @param {string} token - GitHub PAT
 * @returns {Promise<Array>}
 */
export async function getUserGists(token) {
  const response = await fetch(`${GITHUB_API}/gists`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to get gists');
  }

  return await response.json();
}

/**
 * Find the annotation gist for the current app
 * @param {string} token - GitHub PAT
 * @returns {Promise<object|null>}
 */
export async function findAnnotationGist(token) {
  const gists = await getUserGists(token);
  return gists.find(gist => gist.description === GIST_DESCRIPTION) || null;
}

/**
 * Create a new annotation gist
 * @param {string} token - GitHub PAT
 * @param {object} files - Files to include in the gist (format: { filename: { content: string } })
 * @returns {Promise<object>}
 */
export async function createAnnotationGist(token, files = {}) {
  // Ensure at least one file exists
  if (Object.keys(files).length === 0) {
    files['README.md'] = {
      content: '# BeatAI Documentation Annotations\n\nThis Gist stores annotations for BeatAI documentation.'
    };
  }

  const response = await fetch(`${GITHUB_API}/gists`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      description: GIST_DESCRIPTION,
      public: true,
      files
    })
  });

  if (!response.ok) {
    throw new Error('Failed to create gist');
  }

  return await response.json();
}

/**
 * Update a file in a gist
 * @param {string} token - GitHub PAT
 * @param {string} gistId - Gist ID
 * @param {string} filename - File name to update
 * @param {string} content - New file content
 * @returns {Promise<object>}
 */
export async function updateGistFile(token, gistId, filename, content) {
  const response = await fetch(`${GITHUB_API}/gists/${gistId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      files: {
        [filename]: {
          content
        }
      }
    })
  });

  if (!response.ok) {
    throw new Error('Failed to update gist file');
  }

  return await response.json();
}

/**
 * Update multiple files in a gist at once
 * @param {string} token - GitHub PAT
 * @param {string} gistId - Gist ID
 * @param {object} files - Files to update (format: { filename: { content: string } })
 * @returns {Promise<object>}
 */
export async function updateGistFiles(token, gistId, files) {
  const response = await fetch(`${GITHUB_API}/gists/${gistId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      files
    })
  });

  if (!response.ok) {
    throw new Error('Failed to update gist files');
  }

  return await response.json();
}

/**
 * Delete a file from a gist
 * @param {string} token - GitHub PAT
 * @param {string} gistId - Gist ID
 * @param {string} filename - File name to delete
 * @returns {Promise<object>}
 */
export async function deleteGistFile(token, gistId, filename) {
  const response = await fetch(`${GITHUB_API}/gists/${gistId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      files: {
        [filename]: null
      }
    })
  });

  if (!response.ok) {
    throw new Error('Failed to delete gist file');
  }

  return await response.json();
}

/**
 * Get a public gist (no authentication required)
 * Used for viewing shared annotations
 * @param {string} gistId - Gist ID
 * @returns {Promise<object>}
 */
export async function getPublicGist(gistId) {
  const response = await fetch(`${GITHUB_API}/gists/${gistId}`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to get public gist');
  }

  return await response.json();
}

/**
 * Get a gist with authentication
 * @param {string} token - GitHub PAT
 * @param {string} gistId - Gist ID
 * @returns {Promise<object>}
 */
export async function getGist(token, gistId) {
  const response = await fetch(`${GITHUB_API}/gists/${gistId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to get gist');
  }

  return await response.json();
}
