const router = require("express").Router();
const sequelize = require("../config/connection");
const { User, Post, Comment } = require("../models");

router.get("/", (req, res) => {
  console.log("Up the Villa its up and running!");
  console.log(req.session, "homepage render");
  Post.findAll({
    attributes: [
      "id",
      "title",
      "content",
      "created_at",
    ],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
      // In the homepage template pass a single post object
      const posts = dbPostData.map((post) => post.get({ plain: true }));
      // console.log(req.session, "homepage render");
      res.render("homepage", {
        posts,
        loggedIn: req.session.loggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }
  // else login
  res.render("login");
});
router.get("/signup", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }
  // else login
  res.render("signup");
});

router.get("/post/:id", (req, res) => {
  console.log(req.session, "post testing");
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: [
      "id",
      "title",
      "content",
      "created_at",
    ],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }

      // serialize the data
      const post = dbPostData.get({ plain: true });

      // pass data to template
      console.log(post);
      console.log(post.user.username);
      res.render("single-post", {
        post,
        loggedIn: req.session.loggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;