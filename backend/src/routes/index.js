const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware.js");
const cacheControl = require("../middlewares/noCache.js");

const authController = require("../controller/Auth.controller.js");
const fileController = require("../controller/File.controller.js");

router.get("/", (req, res) => {
  if (req.session.loggedInUser) {
    return res.redirect("/my-storage");
  }
  res.render("index");
});

router.get("/login", async (req, res) => {
  const loggedInUser = req.session.loggedInUser;
  if (loggedInUser !== undefined) {
    res.redirect("/my-storage");
    return;
  }
  const errorMessages = req.flash("error");
  const successMessages = req.flash("success");
  res.render("login", { errorMessages, successMessages });
});

router.post("/login", authController.validateLogin);

router.use(authMiddleware);
router.use(cacheControl);

router.get("/my-storage", async (req, res) => {
  const successMessages = req.flash("success");

  const filesByUserPromise = fileController.getFilesByUser(
    req.session.loggedInUser
  );

  const filesByUser = await filesByUserPromise;
  res.render("myStorage", { successMessages, filesByUser });
});

router.post("/newfile", fileController.uploadFile);

router.get("/download/:fileId", fileController.downloadFile);

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
