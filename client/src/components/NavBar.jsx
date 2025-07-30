import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../hooks/useAuth.jsx';

export default function Navbar(){
  const { set } = useAuth();  const nav = useNavigate();
  return (
    <>
      <header className="flex items-center justify-between px-4 py-2 border-b">
        <Link to="/" className="font-bold text-lg">SmartExpense</Link>
        <Button variant="outline" onClick={()=>{ set(null); nav('/login'); }}>
          Logout
        </Button>
      </header>
      <Outlet/>
    </>
  );
}
