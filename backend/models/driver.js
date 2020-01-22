const mongoose = require('mongoose');


const postSchema = mongoose.Schema({  // nie mcm token untuk stiap user big ade auth
  driverName: { type: String, required: true},
  driverDescription: { type: String, required: true },
  imagePath: { type: String, required:true},
  creator: { type: mongoose.Schema.Types.String, ref:'User', required: true},
  driverLocation: { type:String, default:'Dock/otw', required: true },
  driverStatus: {type:String, default:'Available', required: true},
  document: {type:String, default:'NO Data', required: true}
   // mongoose.Schema.Types.Object nie pakai Object id sebab dia dpt drpde _id tu kalau nk tukar kene tkar ke Types.String bru leh pakai input token yg lain
});


module.exports= mongoose.model('Driver', postSchema);
