const userModel = require("../model/userModel");

const followUser = async function (req, res) {
  try {
    const { userId } = req.params;
    const { followerId } = req.body;

    const user = await userModel.findById(userId);
    const follower = await userModel.findById(followerId);
    if (!user || !follower) {
      return res
      .status(404)
      .send({ message: "user not exist" });
    }

    if (user.following.includes(followerId)) {
      return res
      .status(400)
      .send({ msg: "already following this user" });
    }

    follower.followers.push(user);
    await follower.save();

    user.following.push(follower);
    await user.save();

    return res.status(200).send({ message: "following successful" });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "server error", error: err.message });
  }
};

const unfollowUser = async function (req, res) {
  try {
    const { userId } = req.params;
    const { followerId } = req.body;

    const user = await userModel.findById(userId);
    const follower = await userModel.findById(followerId);
    if (!user || !follower) {
      return res
      .status(404
        ).send({ message: "user does not exist" });
    }
    if (!user.followers.includes(followerId)) {
      return res
        .status(400 )
        .send({ message: "You are not follower of this user"});
    }

    user.following = user.followers.filter((x) => x.toString() !== followerId);
    await user.save();

    follower.followers = follower.following.filter(
      (y) => y.toString() !== userId
    );
    await follower.save();

    return res
    .status(200)
    .send({ message: "unfollow successful" });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "server error", error: err.message });
  }
};

const followerDeatail = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await userModel
      .findById(userId)
      .populate("followers","_id username tweets")
      .populate("following","_id username tweets")

    if (!user) {
      return res
      .status(404)
      .send({ message: "User not found" });
    }

    const numFollowers = user.followers.length;
    const numFollowing = user.following.length;

   return  res
      .status(200)
      .send({ message: "Success", data: { numFollowers, numFollowing, user } });
  } catch (error) {
    res.status(500).send({ message: "server error", error: error.message });
  }
};

module.exports = {
  followUser,
  unfollowUser,
  followerDeatail,
};
