const API_URL = 'http://localhost:5000/api/files';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const getFS = async (parentId = null) => {
  try {
    const parent = parentId === 'null' || !parentId ? '' : `/${parentId}`;
    const response = await fetch(`${API_URL}${parent}`, {
      headers: getHeaders()
    });
    return await response.json();
  } catch (err) {
    console.error('Error fetching files:', err);
    return [];
  }
};

export const createFile = async (name, type, parentId) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ name, type, parentId })
    });
    return await response.json();
  } catch (err) {
    console.error('Error creating item:', err);
    throw err;
  }
};

export const deleteFile = async (id) => {
  try {
    await fetch(`${API_URL}/${id}`, { 
      method: 'DELETE',
      headers: getHeaders()
    });
  } catch (err) {
    console.error('Error deleting item:', err);
    throw err;
  }
};

export const getOnlyOfficeUrl = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}/open`, {
      headers: getHeaders()
    });
    return await response.json();
  } catch (err) {
    console.error('Error getting OnlyOffice config:', err);
    throw err;
  }
};

export const renameFile = async (id, name) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ name })
    });
    return await response.json();
  } catch (err) {
    console.error('Error renaming item:', err);
    throw err;
  }
};

export const moveFile = async (id, parentId) => {
  try {
    const response = await fetch(`${API_URL}/${id}/move`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ parentId })
    });
    return await response.json();
  } catch (err) {
    console.error('Error moving item:', err);
    throw err;
  }
};

export const saveFileContent = async (id, content) => {
  try {
    const response = await fetch(`${API_URL}/${id}/content`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ content })
    });
    return await response.json();
  } catch (err) {
    console.error('Error saving content:', err);
    throw err;
  }
};

export const getFile = async (id) => {
  try {
    const response = await fetch(`${API_URL}/item/${id}`, {
      headers: getHeaders()
    });
    return await response.json();
  } catch (err) {
    console.error('Error fetching file:', err);
    throw err;
  }
};

export const getAudioFiles = async () => {
  try {
    const response = await fetch(`${API_URL}/audio/list`, {
      headers: getHeaders()
    });
    return await response.json();
  } catch (err) {
    console.error('Error fetching audio files:', err);
    return [];
  }
};

export const uploadFileRaw = async (formData) => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    return await response.json();
  } catch (err) {
    console.error('Error uploading file:', err);
    throw err;
  }
};
