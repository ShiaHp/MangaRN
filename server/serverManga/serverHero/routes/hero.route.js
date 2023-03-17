const express = require("express");
const router = express.Router();
const {
  getManga,
  listImageChapter,
  getRandomManga
} = require("../controllers/hero.controller.js");
const auth = require("../middleware/verifyToken.js");
const upload = require('../utils/multer')


// upload.single('image'),
router.route('/').get(getManga)
router.route('/:id')
router.route('/random').get(getRandomManga)
router.route('/cover/:id')
router.route('/chapter/:chapterId').get(listImageChapter)
















module.exports = router;
