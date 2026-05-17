// Color utilities
export const getQueueStatusColor = (queueLength, averageLength = 20) => {
  const ratio = queueLength / averageLength;
  
  if (ratio < 0.5) return '#10b981'; // Green - Low
  if (ratio < 1) return '#f59e0b'; // Yellow - Medium
  return '#ef4444'; // Red - High
};

export const getQueueStatusLabel = (queueLength, averageLength = 20) => {
  const ratio = queueLength / averageLength;
  
  if (ratio < 0.5) return 'Low';
  if (ratio < 1) return 'Medium';
  return 'High';
};

export const getQueueStatusBgClass = (queueLength, averageLength = 20) => {
  const ratio = queueLength / averageLength;
  
  if (ratio < 0.5) return 'bg-green-100 text-green-800';
  if (ratio < 1) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

export const getQueueMarkerColor = (queueLength, averageLength = 20) => {
  const ratio = queueLength / averageLength;
  
  if (ratio < 0.5) return '#10b981'; // Green
  if (ratio < 1) return '#f59e0b'; // Yellow/Amber
  return '#ef4444'; // Red
};

// Format utilities
export const formatWaitTime = (minutes) => {
  if (minutes < 1) return 'Less than 1 min';
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTime = (timeString) => {
  const date = new Date(timeString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

// Validation utilities
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validatePhoneNumber = (phone) => {
  const regex = /^[0-9\s\-\+\(\)]{7,}$/;
  return regex.test(phone);
};

// Location utilities
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Storage utilities
export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error);
  }
};

export const getLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
};
