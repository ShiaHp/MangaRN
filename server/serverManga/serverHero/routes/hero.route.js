const express = require("express");
const router = express.Router();
const {

  listImageChapter
} = require("../controllers/hero.controller.js");
const auth = require("../middleware/verifyToken.js");
const upload = require('../utils/multer')


// upload.single('image'),

router.route('/manga/:id')
router.route('/cover/:id')
router.route('/chapter/:chapterId').get(listImageChapter)
















module.exports = router;
