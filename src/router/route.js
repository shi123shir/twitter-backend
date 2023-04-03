const express = require("express")
const router = express.Router()

const { registerUser,
    loginUser,
    resetPassword,
    getUser} = require("../controller/userController");
 const { followUser,
    unfollowUser,
    followerDeatail,} = require("../controller/followController")

    const {createTwitter,
        getTwitter,
        searchUser,
        paginateTweet,
        liketweet,
        retweet} = require("../controller/twitterController")

 const {authentication,authorization} = require("../middleware/auth")

// user

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/reset", resetPassword)
router.get("/getuser/:userId",getUser)

// follower
router.post("/:userId/follow",authentication,authorization ,followUser)
router.post("/:userId/unfollow" , authentication,authorization,unfollowUser )
router.get("/:userId/getdetait",authentication,authorization,followerDeatail)

,
// tweets
router.post("/createtweet", authentication ,createTwitter)
router.get("/gettweets",authentication ,getTwitter)
router.get("/searchTweets",authentication,searchUser )
router.get("/paginateTweets",authentication,paginateTweet)
router.post("/:tweetId/like",authentication,liketweet)
router.post("/:tweetId/retweet",authentication,retweet)




module.exports = router