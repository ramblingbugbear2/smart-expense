import axios from 'axios';
import {getAccess, setAccess,refreshToken} from '../hooks/useAuth.jsx';

const api = axios.create({
  // ✅ FIXED: Using relative URL in development, absolute in production
  baseURL: import.meta.env.PROD 
    ? (import.meta.env.VITE_API_URL || '/api')  // Production: use env var or relative
    : '/api',  // Development: relative URL (Vite proxy handles it)
  withCredentials: true,
});

api.interceptors.request.use(cfg => {
    const token = getAccess();
    if(token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
});

api.interceptors.response.use(
    r => r,
    async err => {
        if(err.response?.status === 401){
            const ok = await refreshToken();
            if(ok){
                err.config.headers.Authorization = `Bearer ${getAccess()}`;
                return api(err.config);
            }
            setAccess(null);
            window.location.href = '/login';
        }
        return Promise.reject(err);        
    }
);

export default api;