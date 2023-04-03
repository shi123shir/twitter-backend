const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    favorite_color: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    tweets: [{ type: objectId, ref: "tweet" }],

    following: [{ type: objectId, ref: "User" }],

    followers: [{ type: objectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
