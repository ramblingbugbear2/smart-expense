import axios from 'axios';
import {getAccess, setAccess,refreshToken} from '../hooks/useAuth.jsx';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
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