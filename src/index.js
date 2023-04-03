const express = require('express');
const route = require('./router/route');
const mongoose = require('mongoose');
let app = express();


app.use(express.json());



mongoose.connect("mongodb+srv://shishir1912-DB:F85ml8mUXi1MrEKV@cluster0.2ta5zuw.mongodb.net/twitter", {
  useNewUrlParser: true,
  })
  .then(() => console.log("DB connected successfuly"))
  .catch((err) => console.log("mongodb connection failed: ", err.message));


app.use("/", route)

const port = process.env.PORT || 8080;




app.listen(port, () => {
  console.log(`server is running on  port ${port}`);
});

