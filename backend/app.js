const path = require("path"); // nie pakai teknik path untuk images tu
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// tgok sini dia buat postroutes create variable baru
const userRoutes = require("./routes/user");
const driverRoutes =  require("./routes/drivers")
const docRoutes =  require("./routes/docs")

const app = express();

mongoose.connect( // first first dia kan connect sini dlu
  "mongodb+srv://zaid:" +
   process.env.MONGO_ATLAS_PW +   // amik nie dekat nodemon.json ade pass situ
    "@cluster0-kqayu.mongodb.net/node-angular", { useUnifiedTopology: true }
    )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json()); // body parser nie mcm bantuan untuk jadi alamat pggil function dia
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images"))); // nie untuk bagi request /images tuh kat backend/images pakai teknik path
app.use("/imagesDriver", express.static(path.join("backend/imagesDriver")));
app.use("/documents", express.static(path.join("backend/documents")));


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes); // nie postroutes nie adelah post.jd yg kt dlm routes .nie akn di request dkat  post.service.js front end nie dia declare kat ats
app.use("/api/user", userRoutes); // dia declare kat ats
app.use("/api/drivers", driverRoutes);
app.use("/api/docs", docRoutes)
module.exports = app;









