import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getUserFriends, sendFriendRequest, searchUsers } from "../lib/api";
import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import { debounce } from "../lib/utils";
import useAuthUser from "../hooks/useAuthUser";
import { Link } from "react-router";

// FriendsPage: Shows your friends and lets you search/add new friends
const FriendsPage = () => {
  const queryClient = useQueryClient();
  const { authUser } = useAuthUser();

  // State for search
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // Fetch your friends
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  // Mutation to send a friend request
  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["friends"] }),
  });

  // Helper: get all friend IDs
  const friendIds = friends.map((f) => f._id);

  // Debounced search function
  const debouncedSearch = debounce(async (q) => {
    if (!q) {
      setSearchResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    try {
      const users = await searchUsers(q);
      setSearchResults(users);
    } catch {
      setSearchResults([]);
    }
    setSearching(false);
  }, 400);

  // Handle search input
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-base-100/70 min-h-screen">
      <div className="container mx-auto max-w-5xl space-y-10">
        {/* --- Search Bar Section --- */}
        <section className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
            Find People
          </h2>
          <input
            className="input input-bordered w-full"
            type="text"
            placeholder="Search users by name..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searching && (
            <div className="mt-2 text-center text-sm opacity-70">
              Searching...
            </div>
          )}
          {searchResults.length > 0 && (
            <div className="bg-base-100 rounded-xl shadow mt-4 divide-y divide-base-200">
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-3 p-3 hover:bg-base-200 transition"
                >
                  <div className="avatar w-10 h-10 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100 shadow-md overflow-hidden">
                    <img
                      src={user.profilePic}
                      alt={user.fullName}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-base leading-tight truncate">
                      {user.fullName}
                    </p>
                    <div className="flex gap-2 text-xs mt-1">
                      <span className="badge badge-secondary">
                        {user.nativeLanguage}
                      </span>
                      <span className="badge badge-outline">
                        {user.learningLanguage}
                      </span>
                    </div>
                  </div>
                  {user._id === authUser?._id ? null : friendIds.includes(
                      user._id
                    ) ? (
                    <Link
                      to={`/chat/${user._id}`}
                      className="btn btn-success btn-sm rounded-full"
                    >
                      Message
                    </Link>
                  ) : (
                    <button
                      className="btn btn-primary btn-sm rounded-full"
                      onClick={() => sendRequestMutation(user._id)}
                      disabled={isPending}
                    >
                      Add Friend
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* --- Friends List Section --- */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
            Your Friends
          </h2>
          {loadingFriends ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : friends.length === 0 ? (
            <NoFriendsFound />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {friends.map((friend) => (
                <FriendCard key={friend._id} friend={friend} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default FriendsPage;
