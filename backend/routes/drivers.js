const express = require("express");



const checkAuth = require("../middleware/check-auth");

const DriverController = require("../controllers/drivers");
const extractFile = require("../middleware/fileDriver");

const router = express.Router();



router.post(
  "",  //router ini path dia bila click jadi nie
  checkAuth,  //check token dkt import chck.auth.js nie amik data kat sini woiii
extractFile,
DriverController.createDriver  //check nie type of data betul ke tak
);

router.put(
  "/:id",  //inie untuk edit .mksdnya klau ade id dia akan jadi edit
  checkAuth,
extractFile,
DriverController.updateDriver
);

router.get("",DriverController.getDrivers );

router.get("/:id",DriverController.getDriver ); // nie untuk edit tak nk bagi hilang mase edit

router.delete(
  "/:id",
  checkAuth, DriverController.deleteDriver
  );

module.exports = router;
