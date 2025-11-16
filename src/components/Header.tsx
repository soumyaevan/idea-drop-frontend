import { logoutUser } from "@/api/auth";
import { useAuthStore } from "@/stores/authStore";
import { Link, useNavigate } from "@tanstack/react-router";
import { Lightbulb } from "lucide-react";

const Header = () => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logoutUser();
      clearAuth();
      navigate({ to: "/" });
    } catch (err: any) {
      console.log("Logout failed: ", err);
    }
  };
  return (
    <header className="bg-[#212222] shadow">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2 text-gray-200">
          <Link
            to="/"
            viewTransition
            className="flex items-center space-x-2 text-gray-200"
          >
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            <h1 className="text-2xl font-bold">IdeaDrop</h1>
          </Link>
        </div>

        <nav className="flex items-center space-x-4">
          <Link
            viewTransition
            to="/ideas"
            className="text-gray-200 hover:text-gray-300 font-bold transition px-3 py-2 leading-none hover:underline"
          >
            Ideas
          </Link>
          {user && (
            <Link
              to="/ideas/new"
              viewTransition
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium transition px-4 py-2 rounded-md leading-none"
            >
              + New Idea
            </Link>
          )}
        </nav>
        {/** Authentication buttons */}
        <div className="flex items-center space-x-4">
          {!user ? (
            <>
              <Link
                to="/login"
                viewTransition
                className="font-semibold px-2 py-1 rounded-md hover:bg-gray-300 hover:text-gray-700 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                viewTransition
                className="px-2 py-1 bg-gray-500 rounded-md hover:bg-gray-300 hover:text-gray-700 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="text-gray-300 font-medium">
                Welcome, {user.name}
              </span>
              <button
                className="text-amber-600 font-semibold hover:text-amber-400 transition leading-none"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
