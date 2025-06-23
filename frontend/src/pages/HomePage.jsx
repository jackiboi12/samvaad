import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import {
  CheckCircleIcon,
  MapPinIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";

import { capitialize } from "../lib/utils";
import { LANGUAGES } from "../constants";

import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import LanguageFlag from "../components/LanguageFlag";
import useAuthUser from "../hooks/useAuthUser";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const EVERYONE = "Everyone";

  // Local filter state for dropdowns
  const [filterNativeLanguage, setFilterNativeLanguage] = useState(EVERYONE);
  const [filterLearningLanguage, setFilterLearningLanguage] =
    useState(EVERYONE);

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  const { authUser } = useAuthUser();

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  // Final filter: show all if both are 'Everyone', strict match if both are selected, else filter by the selected one
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

  // Remove updateProfileMutation from dropdowns, use only local state
  const handleFilterLanguageChange = (type, value) => {
    if (type === "native") {
      setFilterNativeLanguage(value);
    } else {
      setFilterLearningLanguage(value);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-base-100/70 min-h-screen">
      <div className="container mx-auto space-y-10">
        {/* Current User Profile Section */}
        {authUser && (
          <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl bg-base-100/80 shadow border border-base-200 max-w-xl mx-auto">
            <div className="avatar w-16 h-16 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100 shadow-md overflow-hidden">
              <img
                src={authUser.profilePic}
                alt={authUser.fullName}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-lg leading-tight truncate">
                {authUser.fullName}
              </p>
              <p className="text-sm text-success flex items-center gap-2 mt-1">
                <span className="size-3 rounded-full bg-success inline-block" />
                Online
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Friends
          </h2>
          <Link
            to="/notifications"
            className="btn btn-primary btn-sm rounded-full shadow-md transition hover:scale-105 flex items-center gap-2"
          >
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>

        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Meet New Learners
                </h2>
                <p className="opacity-70">
                  Discover perfect language exchange partners based on your
                  profile
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
          </div>

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
                    className="card bg-base-100/80 backdrop-blur rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-200 border border-base-200"
                  >
                    <div className="card-body p-5 space-y-4">
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

                      {/* Languages with flags */}
                      <div className="flex flex-wrap gap-2">
                        <span className="badge badge-secondary badge-lg text-xs px-3 py-1 rounded-full flex items-center gap-1">
                          <LanguageFlag language={user.nativeLanguage} />
                          Native: {capitialize(user.nativeLanguage)}
                        </span>
                        <span className="badge badge-outline badge-lg text-xs px-3 py-1 rounded-full flex items-center gap-1">
                          <LanguageFlag language={user.learningLanguage} />
                          Learning: {capitialize(user.learningLanguage)}
                        </span>
                      </div>

                      {user.bio && (
                        <p className="text-sm opacity-70">{user.bio}</p>
                      )}

                      {/* Action button */}
                      <button
                        className={`btn w-full mt-2 rounded-full shadow-md transition hover:scale-105 text-base ${
                          hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                        } `}
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
                            Send Friend Request
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
