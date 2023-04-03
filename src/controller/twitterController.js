const twitterModel = require("../model/twitterModel");
const userModel = require("../model/userModel");


const createTwitter = async function (req, res) {
  try {
    const { author, text} = req.body;
    const authorExists = await userModel.findById(author);
    if (!authorExists) {
      return res.status(400).json({ msg: "Author not found" });

    }
    if(author != req.decode)
    return res
    .status(403)
    .send({message:"unauthorised user"})

    const tweet = new twitterModel({ author, text });
    
const regex = /#[a-zA-Z]+/g;
const hashtags = tweet.text.match(regex);

if (hashtags) {
 
  tweet.hashtags = hashtags.map(hashtag => hashtag.toLowerCase());
}


    await tweet.save();

    authorExists.tweets.push(tweet._id);

    await authorExists.save();
 return res
 .status(201)
 .send({message:"tweet created successfully" ,data : tweet})
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};


const getTwitter = async function (req, res) {
  try {
    const tweets = await twitterModel
      .find()
      .populate("author")
   return res 
   .status(200)
   .send({message:"fetch tweets successfully", data:tweets})
  } catch (err) {
    return  res
    .status(500)
    .send({message:"server error", error:err.message});
  }
};

const searchUser = async function (req, res) {
    try {
        const query = req.query.hashtag;
        const tweets = await twitterModel.find({ hashtags: { $regex: query, $options: 'i' }  });
       return res
       .status(200)
       .send({message:"data fetch successfull",data:tweets})
    } catch (err) {
        res.status(500).json({ message: 'Failed to search tweets', err: err.message });
    }
};


const paginateTweet= async function (req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  try {
    const tweets = await twitterModel.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).send({ message:"tweeet fetch successfuly",data:tweets});
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

const liketweet = async (req,res) =>{
   try {
    const tweetId = req.params.tweetId
    const data = req.body.author
    

    if(data != req.decode)
    return res
    .status(403)
    .send({message:"unauthorised user"})
    
    let like = await twitterModel.findOne({ _id :tweetId})
    if(like.likes.includes(data)){
        return res
        .status(400)
        .send({message:"already liked"})
    }
     like.likes.push(data)
     await like.save()
     return res
     .status(200)
     .send({message:"tweet liked successfully", data:like})
   } catch (err) {
    return res
    .status(500)
    .send({message:"server error",error:err.message})
   }
}

const retweet = async (req,res) =>{
    try {
        const tweetId = req.params.tweetId
        const data = req.body.author
      
        if(data != req.decode)
        return res
        .status(403)
        .send({message:"unauthorised user"})
        
        let ret = await twitterModel.findOne({ _id :tweetId})
        if(ret.retweets.includes(data)){
            return res
            .status(400)
            .send({message:"already retweeted"})
        }
      ret.retweets.push(data)
      await ret.save()
      return res
      .status(200)
      .send({message:"tweet liked successfully", data:ret})
    } catch (err) {
     return res
     .status(500)
     .send({message:"server error",error:err.message})
    }
 }

module.exports = {
  createTwitter,
  getTwitter,
  searchUser,
  paginateTweet,
  liketweet,
  retweet
};