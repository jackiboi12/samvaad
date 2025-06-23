import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  // const queryClient = useQueryClient();
  // const { mutate: logoutMutation } = useMutation({
  //   mutationFn: logout,
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  // });

  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-base-200/80 backdrop-blur border-b border-base-300 sticky top-0 z-30 h-16 flex items-center shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full gap-4">
          {/* LOGO - ONLY IN THE CHAT PAGE */}
          {isChatPage && (
            <div className="pl-5">
              <Link to="/" className="flex items-center gap-2.5">
                <ShipWheelIcon className="size-9 text-primary drop-shadow" />
                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                  SamVaad
                </span>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            <Link to={"/notifications"}>
              <button className="btn btn-ghost btn-circle transition hover:bg-primary/10">
                <BellIcon className="h-6 w-6 text-base-content opacity-70 transition hover:text-primary" />
              </button>
            </Link>
          </div>

          <ThemeSelector />

          <div className="avatar">
            <div className="w-10 h-10 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100 shadow-md overflow-hidden">
              <img
                src={authUser?.profilePic}
                alt="User Avatar"
                rel="noreferrer"
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Logout button */}
          <button
            className="btn btn-ghost btn-circle transition hover:bg-error/10"
            onClick={logoutMutation}
            title="Logout"
          >
            <LogOutIcon className="h-6 w-6 text-base-content opacity-70 transition hover:text-error" />
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
