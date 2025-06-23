import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  getRecommendedUsers,
  getOutgoingFriendReqs,
  sendFriendRequest,
  deleteAccount,
} from "../lib/api";
import { LANGUAGES } from "../constants";
import LanguageFlag from "../components/LanguageFlag";
import { UserPlusIcon, CheckCircleIcon, MapPinIcon } from "lucide-react";
import useLogout from "../hooks/useLogout";
import { useNavigate } from "react-router";

// HomePage: Only shows 'Meet New Friends' (recommended users)
const HomePage = () => {
  // For language filter dropdowns
  const EVERYONE = "Everyone";
  const [filterNativeLanguage, setFilterNativeLanguage] = useState(EVERYONE);
  const [filterLearningLanguage, setFilterLearningLanguage] =
    useState(EVERYONE);

  // For tracking outgoing friend requests
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const { logoutMutation } = useLogout();

  // Fetch recommended users (not your friends, not you)
  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: getRecommendedUsers,
  });

  // Fetch outgoing friend requests
  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  // Update outgoing request IDs when data changes
  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
    }
    setOutgoingRequestsIds(outgoingIds);
  }, [outgoingFriendReqs]);

  // Send friend request mutation
  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  const { mutate: deleteAccountMutation, isPending: deletingAccount } =
    useMutation({
      mutationFn: deleteAccount,
      onSuccess: () => {
        logoutMutation();
        navigate("/login");
      },
    });

  // Filter recommended users by selected languages
  const filteredRecommendedUsers = recommendedUsers.filter((user) => {
    const userNative = (user.nativeLanguage || "").toLowerCase();
    const userLearning = (user.learningLanguage || "").toLowerCase();
    const filterNative = (filterNativeLanguage || "").toLowerCase();
    const filterLearning = (filterLearningLanguage || "").toLowerCase();
    if (
      filterNative === EVERYONE.toLowerCase() &&
      filterLearning === EVERYONE.toLowerCase()
    )
      return true;
    if (
      filterNative !== EVERYONE.toLowerCase() &&
      filterLearning !== EVERYONE.toLowerCase()
    )
      return userNative === filterNative && userLearning === filterLearning;
    if (filterNative !== EVERYONE.toLowerCase())
      return userNative === filterNative;
    if (filterLearning !== EVERYONE.toLowerCase())
      return userLearning === filterLearning;
    return true;
  });

  // Handle dropdown changes
  const handleFilterLanguageChange = (type, value) => {
    if (type === "native") setFilterNativeLanguage(value);
    else setFilterLearningLanguage(value);
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This cannot be undone!"
      )
    ) {
      deleteAccountMutation();
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-base-100/70 min-h-screen">
      <div className="container mx-auto max-w-6xl">
        {/* Delete Account Button */}
        <div className="flex justify-end mb-6">
          <button
            className="btn btn-error btn-outline rounded-full"
            onClick={handleDeleteAccount}
            disabled={deletingAccount}
          >
            {deletingAccount ? "Deleting..." : "Delete Account"}
          </button>
        </div>
        {/* Meet New Friends Section */}
        <section>
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Meet New Friends
              </h2>
              <p className="opacity-70">
                Discover language partners to connect with!
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <label className="font-medium">Native:</label>
              <select
                className="select select-bordered"
                value={filterNativeLanguage}
                onChange={(e) =>
                  handleFilterLanguageChange("native", e.target.value)
                }
              >
                <option value={EVERYONE}>{EVERYONE}</option>
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
              <label className="font-medium ml-4">Learning:</label>
              <select
                className="select select-bordered"
                value={filterLearningLanguage}
                onChange={(e) =>
                  handleFilterLanguageChange("learning", e.target.value)
                }
              >
                <option value={EVERYONE}>{EVERYONE}</option>
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Show loading, empty, or user cards */}
          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : filteredRecommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">
                No recommendations available
              </h3>
              <p className="text-base-content opacity-70">
                Check back later for new language partners!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRecommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
                return (
                  <div
                    key={user._id}
                    className="card bg-base-100/80 backdrop-blur rounded-2xl shadow-lg border border-base-200"
                  >
                    <div className="card-body p-5 space-y-4">
                      {/* User Info */}
                      <div className="flex items-center gap-4">
                        <div className="avatar w-14 h-14 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100 shadow-md overflow-hidden">
                          <img
                            src={user.profilePic}
                            alt={user.fullName}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {user.fullName}
                          </h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1">
                              <MapPinIcon className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Languages */}
                      <div className="flex flex-wrap gap-2">
                        <span className="badge badge-secondary badge-lg text-xs px-3 py-1 rounded-full flex items-center gap-1">
                          <LanguageFlag language={user.nativeLanguage} />
                          Native: {user.nativeLanguage}
                        </span>
                        <span className="badge badge-outline badge-lg text-xs px-3 py-1 rounded-full flex items-center gap-1">
                          <LanguageFlag language={user.learningLanguage} />
                          Learning: {user.learningLanguage}
                        </span>
                      </div>
                      {/* Bio */}
                      {user.bio && (
                        <p className="text-sm opacity-70">{user.bio}</p>
                      )}
                      {/* Add Friend Button */}
                      <button
                        className={`btn w-full mt-2 rounded-full shadow-md transition hover:scale-105 text-base ${
                          hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                        }`}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Add Friend
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
