const mongoose = require("mongoose")
const objectId = mongoose.Schema.Types.ObjectId

const tweetSchema = mongoose.Schema({
    text: {
      type: String,
      required: true
    },
    author: {
      type: objectId,
      ref: 'User'
    },
    likes: [{
      type: objectId,
      ref: 'User'
    }],
    retweets: [{
      type: objectId,
      ref: 'User'
    }],
    hashtags: [{
      type: String,
      lowercase: true
    }],
  },{ timestamps: true });

module.exports = mongoose.model("tweet", tweetSchema);