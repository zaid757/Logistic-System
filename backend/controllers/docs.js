const Post = require("../models/driver");

exports.updateDoc = (req, res, next) => {
  let document = req.body.document;
if (req.file) {
  const url = req.protocol + '://' + req.get('host');
  document = url + "/documents/" + req.file.filename
}
  const post = new Post({
    _id: req.body.id,
    driverName: req.body.driverName,
    driverLocation:  req.body.driverLocation,
    driverDescription: req.body.driverDescription,
    document: document,
    imagePath: req.body.imagePath,
    creator: req.userData.usernameId, // nie server side setting
    driverStatus: req.body.driverStatus
  });
  Post
  .updateOne(
    { _id: req.params.id, creator: req.userData.usernameId },   // nie utk tgok email dgn user id same ke tak dua dua klaau tk dia tk update
    post)
    .then(result => {
      console.log(result)
    if (result.n > 0) {
      res.status(200).json({ message: "Update successful!" });
    } else {
      res.status(401).json({ message: "Not Authorized" });

    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Couldn't update post!"
    });
  });
};

exports.getDocs = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count
      });
    });
}

exports.getDoc = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching post failed!"
    });
  });
}

exports.deleteDoc = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.usernameId }).then(
    result => {
      console.log(result);
      if (result.n > 0) {  // nie .n logik dtg tu amik dlm database kene bukak tgok pakai console.log(result) bru nmpak
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting posts failed!"
      });
    });
}
