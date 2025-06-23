import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, ShipWheelIcon, UsersIcon } from "lucide-react";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="w-64 bg-base-200/80 backdrop-blur border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0 rounded-tr-3xl shadow-xl">
      <div className="p-5 border-b border-base-300">
        <Link to="/" className="flex items-center gap-2.5">
          <ShipWheelIcon className="size-9 text-primary drop-shadow" />
          <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
            Samvaad
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Link
          to="/"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case rounded-xl transition-all duration-200 shadow-none ${
            currentPath === "/"
              ? "bg-primary/10 text-primary font-semibold"
              : "hover:bg-primary/5"
          }`}
        >
          <HomeIcon
            className={`size-5 ${
              currentPath === "/"
                ? "text-primary"
                : "text-base-content opacity-70"
            }`}
          />
          <span>Home</span>
        </Link>

        <Link
          to="/friends"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case rounded-xl transition-all duration-200 shadow-none ${
            currentPath === "/friends"
              ? "bg-primary/10 text-primary font-semibold"
              : "hover:bg-primary/5"
          }`}
        >
          <UsersIcon
            className={`size-5 ${
              currentPath === "/friends"
                ? "text-primary"
                : "text-base-content opacity-70"
            }`}
          />
          <span>Friends</span>
        </Link>

        <Link
          to="/notifications"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case rounded-xl transition-all duration-200 shadow-none ${
            currentPath === "/notifications"
              ? "bg-primary/10 text-primary font-semibold"
              : "hover:bg-primary/5"
          }`}
        >
          <BellIcon
            className={`size-5 ${
              currentPath === "/notifications"
                ? "text-primary"
                : "text-base-content opacity-70"
            }`}
          />
          <span>Notifications</span>
        </Link>
      </nav>

      {/* USER PROFILE SECTION */}
      <div className="p-4 border-t border-base-300 mt-auto">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100 shadow-md overflow-hidden">
              <img
                src={authUser?.profilePic}
                alt="User Avatar"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-base leading-tight truncate">
              {authUser?.fullName}
            </p>
            <p className="text-xs text-success flex items-center gap-1 mt-1">
              <span className="size-2 rounded-full bg-success inline-block" />
              Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
