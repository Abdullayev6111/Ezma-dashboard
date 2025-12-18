import { create } from 'zustand';

const getFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key);

    if (!item || item === 'undefined' || item === 'null') {
      localStorage.removeItem(key);
      return null;
    }

    return item;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return null;
  }
};

const parseJSON = (value) => {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch (error) {
    console.error('JSON parse error:', error);
    return null;
  }
};

const saveToStorage = (key, value) => {
  try {
    if (value === null || value === undefined) {
      localStorage.removeItem(key);
      return;
    }

    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, stringValue);
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

const useAuthStore = create((set) => ({
  token: getFromStorage('access'),
  user: parseJSON(getFromStorage('user')),
  isAuth: !!getFromStorage('access'),

  setToken: (token) => {
    saveToStorage('access', token);
    set({ token, isAuth: true });
  },

  setUser: (user) => {
    saveToStorage('user', user);
    set({ user });
  },

  logout: () => {
    localStorage.removeItem('access');
    localStorage.removeItem('user');
    set({ token: null, user: null, isAuth: false });
  },
}));

export default useAuthStore;
