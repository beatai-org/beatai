export function createHttpError(response) {
  return new Error(`HTTP error! status: ${response.status}`);
}

export function assertOkResponse(response) {
  if (!response.ok) {
    throw createHttpError(response);
  }

  return response;
}

export function fetchJson(url, options) {
  return fetch(url, options).then((response) => assertOkResponse(response).json());
}

export function fetchText(url, options) {
  return fetch(url, options).then((response) => assertOkResponse(response).text());
}
