const express = require("express");



const checkAuth = require("../middleware/check-auth");

const PostController = require("../controllers/posts"); // sini utk bawah tu
const extractFile = require("../middleware/file");

const router = express.Router();



router.post( // nie tak kisah nama dia apa apa sebab nie function . function dia nie edit.then dia akan exsecute la ikut turutan bawah tu
  "",  //router function dia akn request kalau kosong jdi sini lah
  checkAuth,  //check token dkt import chck.auth.js nie amik data kat sini woiii // nk tgok betul ke tak user valide ke tak
extractFile, // nie utk gmbr kat sini lah tmpt backend untuk store gmbr skli validation
PostController.createPost  //nie function dia amik drpde dekat controllers/posts.js  dlm posts,js tuh ade function dia utk create post
);

router.put( // nie function dia untuk edit
  "/:id",  //router function dia akn request kalau ade id dia akan jadi sini sbb body parser dah convert dia . tgok dia ade backend_url + id  dlm post/service.ts
  checkAuth,
extractFile, // nie utk gmbr
PostController.updatePost // nie function dia amik drpde dekat controller/posts
);

router.get("",PostController.getPosts );

router.get("/:id",PostController.getPost );

router.delete(
  "/:id",  //router function dia akn request kalau ade id dia akan jadi sini sbb body parser dah convert dia . tgok dia ade backend_url + postId dlm post/service.ts
  checkAuth, PostController.deletePost
  );

module.exports = router;
