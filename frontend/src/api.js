const API_BASE = 'http://localhost:3001/api';

/**
 * Fetches all components
 * @returns {Promise<Array>} A promise that resolves to an array of components
 * @throws {Error} If the network request fails
 */
export async function fetchComponents() {
  const res = await fetch(`${API_BASE}/components`);
  return res.json();
}

export async function addDependency(componentId, dependencyId) {
    const res = await fetch(`${API_BASE}/components/${componentId}/dependencies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dependencyId }),
    }
    );
    return res.json();
}

export async function getDependencies(componentId) {
    const res = await fetch(`${API_BASE}/components/${componentId}/dependencies`);
    return res.json();
}

export async function getDependents(componentId) {
    const res = await fetch(`${API_BASE}/components/${componentId}/getDependents`);
    return res.json();
}

/**
 * Creates a new component
 * @param {Object} data - The component data to create
 * @returns {Promise<Object>} The create response data
 * @throws {Error} If the network request fails
 */
export async function createComponent(data) {
  const res = await fetch(`${API_BASE}/components`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

/**
 * Updates a component by ID
 * @param {string|number} id - The ID of the component to update
 * @param {Object} data - The component data to update
 * @returns {Promise<Object>} The update response data
 * @throws {Error} If the network request fails
 */
export async function updateComponent(id, data) {
  const res = await fetch(`${API_BASE}/components/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

/**
 * Deletes a component by ID
 * @param {string|number} id - The ID of the component to delete
 * @returns {Promise<Object>} The delete response data
 * @throws {Error} If the network request fails
 */
export async function deleteComponent(id) {
  const res = await fetch(`${API_BASE}/components/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}

/**
 * Fetches a component and its dependencies by ID
 * @param {string|number} id - The ID of the component to fetch
 * @returns {Promise<Object>} The component data with its dependencies
 * @throws {Error} If the network request fails
 */
export async function getComponentWithDependencies(id) {
  const res = await fetch(`${API_BASE}/components/${id}/dependencies`);
  return res.json();
}

/**
 * Fetches a component and its children by ID
 * @param {string|number} id - The ID of the component to fetch
 * @returns {Promise<Object>} The component data with its children
 * @throws {Error} If the network request fails
 */
export async function getComponentChildren(id){
    const res = await fetch(`${API_BASE}/components/${id}/children`);
    return res.json();
}