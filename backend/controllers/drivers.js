const Post = require("../models/driver");

exports.createDriver = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    driverName: req.body.driverName,
    driverDescription: req.body.driverDescription,
    imagePath: url + "/imagesDriver/" + req.file.filename, // nie amik kat file name tu
    creator: req.userData.usernameId, // nie amik kat middleware check-auth.js , tgok type model kat post.js
  });
  post
    .save()
    .then(createdPost => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          ...createdPost,
          id: createdPost._id // nie utk refresh saja
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a post failed kat sini ui"
      });
    });
};

exports.updateDriver = (req, res, next) => {
  let imagePath = req.body.imagePath;
if (req.file) {
  const url = req.protocol + '://' + req.get('host');
  imagePath = url + "/imagesDriver/" + req.file.filename
}
  const post = new Post({
    _id: req.body.id,
    driverName: req.body.driverName,
    driverDescription: req.body.driverDescription,
    imagePath: imagePath,
    creator: req.userData.usernameId // nie server side setting
  });
  Post
  .updateOne(
    { _id: req.params.id, creator: req.userData.usernameId },   // nie utk tgok email dgn user id same ke tak dua dua klaau tk dia tk update
    post)
    .then(result => {
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

exports.getDrivers = (req, res, next) => {
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

exports.getDriver = (req, res, next) => {
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

exports.deleteDriver = (req, res, next) => {
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
