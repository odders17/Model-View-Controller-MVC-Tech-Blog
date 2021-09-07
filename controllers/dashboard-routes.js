const router = require("express").Router();
const sequelize = require("../config/connection");
const withAuth = require("../utils/auth");
const { User, Post, Comment } = require("../models");

// Get all posts for the Dashboard
router.get("/", withAuth, (req, res) => {
  Post.findAll({
    where: {
      user_id: req.session.user_id,
    },
    attributes: ["id", "title", "content", "created_at"],
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
      const posts = dbPostData.map((post) => post.get({ plain: true }));
      return posts;
    })
    .then((posts) => {

      return User.findOne({
        where: {
          id: req.session.user_id
        },
        attributes: { exclude: ['password'] },
      })
        .then((dbUserData) => {
          if (dbUserData) {
            const user = dbUserData.get({ plain: true });
            res.render("dashboard", { posts, loggedIn: true, location: user.location ? user.location : "Unknown", Bio: user.bio ? user.bio : "", Username: user.username, Id: user.id, Picture: user.profile_picture, Birthday: user.birthday });

          } else {
            res.status(404).end();
          }
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// edit profile route
router.get("/edit-profile/", withAuth, (req, res) => {
  User.findOne({
    where: {
      id: req.session.user_id
    },
    attributes: { exclude: ['password'] },
  })
    .then((dbUserData) => {
      if (dbUserData) {
        const user = dbUserData.get({ plain: true });

        res.render("edit-profile", {
          user,
          loggedIn: true,
        });
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.get("/edit/:id", withAuth, (req, res) => {
  Post.findByPk(req.params.id, {
    attributes: ["id", "title", "content", "created_at"],
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
      if (dbPostData) {
        const post = dbPostData.get({ plain: true });

        res.render("edit-post", {
          post,
          loggedIn: true,
        });
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;