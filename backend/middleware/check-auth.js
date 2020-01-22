const jwt = require("jsonwebtoken");  //middleware nie pakai untuk recieve token drpde backend nk tgok ade token ke tak

module.exports = (req, res, next) => {
  try {
const token =  req.headers.authorization.split(" ")[1];  //ini nak kutip token untuk verify kat bawah ni amik drpde headers
  const decodedToken = jwt.verify(token, process.env.JWT_KEY); //nie dpt data drpde jwt.sign kat user.js dia pkai modeule jwt- dtg drpde nodemon.json
  req.userData = { email: decodedToken.email, userId: decodedToken.userId , usernameId: decodedToken.usernameId }; //sume yg mintak check-auth.js dpt dua data nie
  next();
} catch (error) {
    res.status(401).json({ message: "Invalid authentication credentials!"});
  }
};


