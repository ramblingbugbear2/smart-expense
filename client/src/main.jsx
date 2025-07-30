import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './hooks/useAuth.jsx';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import './index.css';

// 1️⃣ create a client once for the whole app
const qc = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2️⃣ wrap everything with QueryClientProvider */}
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <App />
      </AuthProvider>

      {/* optional dev-tools panel (⌘+K toggles) */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
