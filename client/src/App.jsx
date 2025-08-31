// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth }  from './hooks/useAuth.jsx';

import HomePage     from './pages/HomePage.jsx';
import LoginPage    from './pages/LoginPage.jsx';
import SignupPage   from './pages/SignupPage.jsx';

import Navbar       from './components/NavBar.jsx';
import GroupsPage   from './pages/GroupsPage.jsx';
import GroupDetail  from './pages/GroupDetail.jsx';

/* ───────────────── helper ───────────────── */
function RequireAuth() {
  const { access } = useAuth();
  return access ? <Outlet /> : <Navigate to="/login" replace />;
}

/* redirect / → /app when already authenticated */
function AuthRedirect({ children }) {
  const { access } = useAuth();
  return access ? <Navigate to="/app" replace /> : children;
}

/* ───────────────── app ──────────────────── */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── public ───────────────────────── */}
        {/* <Route path="/"        element={<HomePage />} /> */}
        <Route path="/" element={
            <AuthRedirect>
              <HomePage />
            </AuthRedirect>
          }
        />
        <Route path="/login"   element={<LoginPage />} />
        <Route path="/signup"  element={<SignupPage />} />

        {/* ── protected ────────────────────── */}
        <Route element={<RequireAuth />}>
          {/*  wrap protected routes in the navbar  */}
          <Route element={<Navbar />}>
            {/* authenticated users can visit /home */}
            <Route path="/home" element={<HomePage />} />
            
            <Route path="/app"        element={<GroupsPage  />} />
            <Route path="/app/:id"    element={<GroupDetail />} />
          </Route>
        </Route>

        {/* ── catch-all → homepage ─────────── */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
