const Hero = require("../models/hero.model");
const axios = require('axios')
const Tag = require("../models/tag.model");
const check = require("../check");
const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");
const { request } = require("express");
const cloudinary = require("../utils/cloudinary");

const baseUrl = `https://api.mangadex.org/`
const baseUploadUrl = `https://uploads.mangadex.org/`

// https://api.mangadex.org/manga/f98660a1-d2e2-461c-960d-7bd13df8b76d?includes[]=cover_art
module.exports = {
 getListChapter : async(req,res) =>{
  try {
    // https://api.mangadex.org/manga/:idManga/feed
    const mangaId = req.params.id;
    const listChapter = await axios({
      method: 'get',
      url: `${baseUrl}/manga/${mangaId}/feed`
    })

  } catch(e) {
    res.status(StatusCodes.EXPECTATION_FAILED).json({
      message : 'Error'
  })
  }
 },
 getCover: async(req,res) =>{
  // https://uploads.mangadex.org/covers/:manga-id/:cover-filename
  // https://uploads.mangadex.org/covers/f98660a1-d2e2-461c-960d-7bd13df8b76d/0e161616-96f5-4218-bb8c-5e1a0602a750.png
  //0e161616-96f5-4218-bb8c-5e1a0602a750.png
 },
 listImageChapter: async(req,res) =>{
  try {
    const idChapter = req.params.chapterId
    const data = await axios({
      method: 'get',
      url: `${baseUrl}/at-home/server/${idChapter}`
    })
 
  const hash = data.data.chapter.hash
  const images = data.data.chapter.data

const constructedUrls = images.map((image) => `${baseUploadUrl}data/${hash}/${image}`)
res.status(200).json({
  message: 's',
  constructedUrls: constructedUrls
})
  } catch(e) {
    res.status(404).json({e: e.message })
  }
 }
};
