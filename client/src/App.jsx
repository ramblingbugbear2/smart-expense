import { BrowserRouter,Routes,Route,Navigate,Outlet } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.jsx';
import LoginPage   from './pages/LoginPage.jsx';
import GroupsPage  from './pages/GroupsPage.jsx';
import GroupDetail from './pages/GroupDetail.jsx';
import Navbar      from './components/Navbar.jsx';
import SignupPage from './pages/SignupPage.jsx';

function AuthGate(){
  const {access} = useAuth();
  return access ? <Outlet/> : <Navigate to="/login" replace/>;
}

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthGate/>}>
          <Route element={<Navbar/>}>
            <Route index element={<GroupsPage/>}/>
            <Route path="groups/:id" element={<GroupDetail/>}/>
          </Route>
        </Route>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/signup" element={<SignupPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}
