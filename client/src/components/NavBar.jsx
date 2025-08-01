import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/useAuth.jsx";

export default function Navbar() {
  const { access, set } = useAuth();
  const nav = useNavigate();

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur shadow-sm">
      <nav className="h-14 max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/app"
          // to={access ? "/app" : "/"}
          className="text-xl font-bold text-blue-600 hover:text-blue-700"
        >
          SmartExpense
        </Link>

        {/* Links / Actions */}
        {access ? (
          <div className="flex items-center gap-4">
  
            {/* Home → marketing page but still inside auth wrapper */}
            <Link to="/home" className="hover:underline text-sm">
              Home
            </Link>

            <Link to="/app" className="hover:underline text-sm">
              Trips / Expenses
            </Link>

            <Button
              size="sm" 
              variant="destructive"           
              onClick={() => {
                set(null);
                nav("/", { replace: true });
              }}
            >
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            {/* Home stays a simple text link */}
            <Link
              to="/"
              className="text-sm hover:underline"
            >
              Home
            </Link>

            {/* Login button - subtler outline style */}
            <Button asChild size="sm" variant="outline">
              <Link to="/login">Login</Link>
            </Button>

            {/* Sign-up button - primary style */}
            <Button asChild size="sm" variant="outline">
              <Link to="/signup" className="text-white">Sign Up</Link>
            </Button>
          </div>
        )}
      </nav>
    </header>
    <Outlet />
    </>
  );
}
