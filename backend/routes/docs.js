const express = require("express");



const checkAuth = require("../middleware/check-auth");

const OrderController = require("../controllers/docs");
const extractFile = require("../middleware/filedoc");

const router = express.Router();


/*router.post(
  "",  //router ini path dia bila click jadi nie
  checkAuth,  //check token dkt import chck.auth.js nie amik data kat sini woiii
extractFile,
OrderController.createDoc  //check nie type of data betul ke tak
); */


router.put(
  "/:id",  //inie untuk edit .mksdnya klau ade id dia akan jadi edit
  checkAuth,
extractFile,
OrderController.updateDoc
);

router.get("",OrderController.getDocs );

router.get("/:id",OrderController.getDoc ); // nie untuk edit tak nk bagi hilang mase edit

router.delete(
  "/:id",
  checkAuth, OrderController.deleteDoc
  );

module.exports = router;
