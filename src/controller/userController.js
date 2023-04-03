const userModel = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
 const {isString,isValidEmail,isValidPassword} = require("../validator/valid")

const registerUser = async (req, res) => {
  try {
    let data = req.body;
    let { username, email, password, favorite_color } = data;

    let user = await userModel.findOne({ username });
    if (user)
      return res
        .status(400)
        .send({ message: "This userName is already exist" });

    if (!username || !email || !password)
      return res.status(400).send({ message: "Plese enter required fields username, eamil, password" });

      if(!isString(username))
      return res
      .status(400)
      .send({message:"username is must be in string"})

      let checkEmail= await userModel.findOne({email})

      if(checkEmail)
        return res
        .status(400)
        .send({message:"This email is already exist"})

     if(!isValidEmail(email)) 
     return res
     .status(400)
    .send({message:"please enter valid email"})

    if(!isValidPassword(password))
    return res
    .status(400)
    .send({message:"please enter valid password"})

    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);

  if(!favorite_color)
  return res
  .status(400)
  .send({message:"favorite_color is required field"})

    let savedData = await userModel.create(data);
    return res
      .status(201)
      .send({ status: true, message: "created successfully", data: savedData });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

const loginUser = async function (req, res) {
  try {
    let data = req.body;
    let { email, password } = data;

    if (!email || !password)
      return res.status(400).send({ message: "email and password required" });


     if(!isValidEmail(email)) 
     return res
     .status(400)
    .send({message:"please enter valid email"})

    let checkEmail = await userModel.findOne({ email });
    if (!checkEmail) {
      return res
        .status(404)
        .send({ status: false, message: "email not exist" });
    }

         let encryptPwd = checkEmail.password;
         let actualPassword = await bcrypt.compare(password, encryptPwd);
         if (!actualPassword)
           return res
             .status(401)
             .send({ status: false, message: "Incorrect password" });
     
         let token = jwt.sign(
           {
             userId: checkEmail._id,
             iat: new Date().getTime(),
             exp: Math.floor(Date.now() / 1000) + 10 * 60 * 60,
           },
          "token"
         );
        return res.status(201).send({
          status: true,
          message: "User login successfull",
          data: { userId: checkEmail._id, token: token },
        });
      }
      catch (err) {
      return  res
      .status(500)
      .send({ staus: false, message: err.message });
  }

}

const resetPassword = async (req, res) => {

    try{
    const { newPassword, newPasswordRepeat, favorite_color } = req.body;
    const { userId } = req.params;
      
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
      
      if (user.favorite_color !== favorite_color) {
        return res.status(400).send({ status: false, message: "Security wrong inputs please correct it if you are a valid user." });
      }
  
      
      if (newPassword !== newPasswordRepeat) {
        return res.status(400).send({ status: false, message: "New password and password repeat do not match." });
      }
  
      
      user.password = newPassword;
      await user.save();
  
      res.status(200).send({ status: true, message: "Password updated successfully." });
    } catch (err) {
      console.error(err);
      res.status(500).send({ status: false, message: err.message });
    }
  };

  const getUser = async (req,res) =>{
    const userId = req.params.userId

    const alltweets = await userModel.findOne({ _id :userId}).populate("tweets")
    if(!alltweets)
    return res
    .status(404)
    .send({message:"user does not exist"})

    return res
    .status(200)
    .send({message:"user fetch successfull",data : alltweets})
  }

module.exports = {
  registerUser,
  loginUser,
  resetPassword,
  getUser
};