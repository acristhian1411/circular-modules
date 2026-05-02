const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api';

function buildUrl(path, query) {
  const url = new URL(`${API_BASE}${path}`);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

async function request(path, options = {}, query) {
  const response = await fetch(buildUrl(path, query), {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.error || `Request failed (${response.status})`);
  }
  return body;
}

export function listComponents(filters = {}) {
  return request('/components', { method: 'GET' }, filters);
}

export function getComponent(id) {
  return request(`/components/${id}`);
}

export function getComponentChildren(id) {
  return request(`/components/${id}/children`);
}

export function createComponent(data) {
  return request('/components', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateComponent(id, data) {
  return request(`/components/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteComponent(id) {
  return request(`/components/${id}`, { method: 'DELETE' });
}

export function listDependencies(id) {
  return request(`/components/${id}/dependencies`);
}

export function listDependents(id) {
  return request(`/components/${id}/dependents`);
}

export function getImpactTree(id) {
  return request(`/components/${id}/impact-tree`);
}

export function createDependency(componentId, payload) {
  return request(`/components/${componentId}/dependencies`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function deleteDependency(componentId, dependsOnId) {
  return request(`/components/${componentId}/dependencies/${dependsOnId}`, {
    method: 'DELETE',
  });
}

// Compatibility aliases for existing components.
export const fetchComponents = listComponents;
export const getDependencies = listDependencies;
export const getDependents = listDependents;
export const getComponentWithDependencies = listDependencies;

export function addDependency(componentId, dependencyId, criticality = 'optional') {
  return createDependency(componentId, {
    depends_on_id: Number(dependencyId),
    criticality,
  });
}