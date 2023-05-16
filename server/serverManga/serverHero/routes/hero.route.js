const express = require("express");
const router = express.Router();
const {
  getManga,
  listImageChapter,
  getRandomManga,
  getCover,
  getListChapter,
  detailManga
} = require("../controllers/hero.controller.js");
const auth = require("../middleware/verifyToken.js");

// get manga with search/filter parameters
router.route('/').get(getManga)
// get detail of manga
router.route('/:id').get(detailManga)
router.route('/random').get(getRandomManga)
router.route('/cover/:id').get(getCover)
router.route('/chapter/list/:mangaId').get(getListChapter)
router.route('/chapter/image/:chapterId').get(listImageChapter)
















module.exports = router;
