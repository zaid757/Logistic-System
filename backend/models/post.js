const mongoose = require('mongoose');


const postSchema = mongoose.Schema({  // nie mcm token untuk stiap user big ade auth
  title: { type: String, required: true},
  content: { type: String, required: true },
  imagePath: { type: String, required:true},
  status: { type: String ,required:true},
  creator: { type: mongoose.Schema.Types.String, ref:'User', required: true}
   // mongoose.Schema.Types.Object nie pakai Object id sebab dia dpt drpde _id tu kalau nk tukar kene tkar ke Types.String bru leh pakai input token yg lain
});


module.exports= mongoose.model('Post', postSchema); // sini mongoose akan create name datbase name post jadi auto plural huruf kecik 'posts'
