import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    bio: {
      type: String,
      default: "",
    },
    profilePic: {
      type: String,
      default: "",
    },
    nativeLanguage: {
      type: String,
      default: "",
    },
    learningLanguage: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    isOnboarded: {
      type: Boolean,
      default: false, // when user signs up -> lands on onboarding page since this is false-> once they complete onboarding, this will be set to true
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId, // store the ObjectId of the User model
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);
// Pre-hook to hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // If password is not modified, skip hashing
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  const isPasswordCorrect = await bcrypt.compare(
    enteredPassword,this.password
  );
  return isPasswordCorrect;
};
const User = mongoose.model("User", userSchema);

export default User;
