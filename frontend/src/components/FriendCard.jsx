import { Link } from "react-router";
import { LANGUAGE_TO_FLAG } from "../constants";

const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-base-100/80 backdrop-blur rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-200 border border-base-200">
      <div className="card-body p-5">
        {/* USER INFO */}
        <div className="flex items-center gap-4 mb-4">
          <div className="avatar w-14 h-14 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100 shadow-md overflow-hidden">
            <img
              src={friend.profilePic}
              alt={friend.fullName}
              className="object-cover w-full h-full"
            />
          </div>
          <h3 className="font-semibold text-lg truncate">{friend.fullName}</h3>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="badge badge-secondary badge-lg text-xs px-3 py-1 rounded-full flex items-center gap-1">
            {getLanguageFlag(friend.nativeLanguage)}
            Native: {friend.nativeLanguage}
          </span>
          <span className="badge badge-outline badge-lg text-xs px-3 py-1 rounded-full flex items-center gap-1">
            {getLanguageFlag(friend.learningLanguage)}
            Learning: {friend.learningLanguage}
          </span>
        </div>

        <Link
          to={`/chat/${friend._id}`}
          className="btn btn-primary w-full rounded-full shadow-md transition hover:scale-105"
        >
          Message
        </Link>
      </div>
    </div>
  );
};
export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}
