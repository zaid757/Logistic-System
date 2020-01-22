const multer = require("multer"); // pakai multer sebab nak bagi file

const MIME_TYPE_MAP = { // nie untuk extesnion type
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};


const storage = multer.diskStorage({
  destination: (req, file, cb) => { // destination function dia akan jadi bila mulater nak save a file
    const isValid = MIME_TYPE_MAP[file.mimetype]; // nie nak tgok ade tak error kat extension dia . nie disamekan dgn atas
    let error = new Error("Invalid mime type"); // sini klau salah extensionsion
    if (isValid) {  // kalau isValid same dgn mime_type yg tige atas  tuh error dia jdi null kosong
      error = null; // null mksdnya okay // then dia pg kat bawah nie di panggil balik pakai cb (error , 'backend/images')
    }
    cb(error, "backend/imagesDriver"); // klalau semua okay dia akn store file ikut alamt nie . and ikut penama kat bawah
  },
  filename: (req, file, cb) => { // nie amik cb kat ats tuh.cb stands for call back dia function so bleh pggil apa apa
    const name = file.originalname   //format nama file . property Originalname tu wujud
      .toLowerCase() // sini convert ke lowercase
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];// nie untuk extension dia ikut ats
    cb(null, name + "-" + Date.now() + "." + ext); //buat name ngikut yg dah di setting nie atas nie
  }
});

module.exports = multer({ storage: storage }).single("imageDriver"); /* pakai single sbb expect dpt single file. and multer akan carik image punye properties dalam
request body which is nntie front bg */
