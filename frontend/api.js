/**
 * IdeaAPI - Data Access & CRUD Service Layer
 * 
 * This file encapsulates all data fetching and mutation logic.
 * Communicates with the Express backend API running at http://localhost:3000.
 */

const API_BASE_URL = 'http://localhost:3000/ideas';

// The API interface used by the UI layer
const IdeaAPI = {
  /**
   * Fetch all ideas
   * @returns {Promise<Array>} List of ideas
   */
  async getAll() {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch ideas: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching ideas:', error);
      throw error;
    }
  },

  /**
   * Fetch a single idea by ID
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  async getById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(id)}`);
      if (response.status === 404) {
        return null;
      }
      if (!response.ok) {
        throw new Error(`Failed to fetch idea with ID ${id}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching idea ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new idea
   * @param {Object} ideaData - { title, status, description }
   * @returns {Promise<Object>} Created idea object
   */
  async create(ideaData) {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: ideaData.title,
          status: ideaData.status || 'New',
          description: ideaData.description
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to create idea: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating idea:', error);
      throw error;
    }
  },

  /**
   * Update an existing idea
   * @param {string} id - Idea ID
   * @param {Object} updateData - { title, status, description }
   * @returns {Promise<Object|null>} Updated idea object
   */
  async update(id, updateData) {
    try {
      const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`Failed to update idea with ID ${id}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating idea ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete an idea by ID
   * @param {string} id - Idea ID
   * @returns {Promise<boolean>} True if deleted
   */
  async delete(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });

      if (!response.ok && response.status !== 404) {
        throw new Error(`Failed to delete idea with ID ${id}: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error(`Error deleting idea ${id}:`, error);
      throw error;
    }
  }
};
