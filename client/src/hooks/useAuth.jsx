import { createContext, useContext, useState } from 'react';
import api from '../api/axios.js';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [access, setAccessState] = useState(localStorage.getItem('access'));

  const saveToken = token => {
    token
      ? localStorage.setItem('access', token)
      : localStorage.removeItem('access');
    setAccessState(token);
  };

  return (
    <AuthCtx.Provider value={{ access, set: saveToken }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth   = () => useContext(AuthCtx);
export const getAccess = () => localStorage.getItem('access');
export const setAccess = token => {
  token
    ? localStorage.setItem('access', token)
    : localStorage.removeItem('access');
};

export async function refreshToken() {
  try {
    const { data } = await api.get('/auth/refresh');
    setAccess(data.access);
    return true;
  } catch {
    return false;
  }
}