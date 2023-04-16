
const axios = require('axios')
const baseUrl = `https://api.mangadex.org/`
const baseUploadUrl = `https://uploads.mangadex.org/`

// https://api.mangadex.org/manga/f98660a1-d2e2-461c-960d-7bd13df8b76d?includes[]=cover_art
module.exports = {
  getListChapter: async (req, res) => {
    try {
      // https://api.mangadex.org/manga/:idManga/feed
      const mangaId = req.params.mangaId;
      const listChapter = await axios({
        method: 'get',
        url: `${baseUrl}manga/${mangaId}/feed`
      })
      res.status(200).json({
        message: 'Success',
        data: listChapter.data
      })
    } catch (e) {
      res.status(404).json({
        message: 'Error',
      })
    }
  },
  getCover: async (req, res) => {
    // lÀM SAO ĐỂ LẤY ĐƯỢC COVER-FILENAME
    // PHẢI GỌI API GET MANGA THÊM 1 LẦN NỮA THÌ MỚI LẤY ĐƯỢC :))
    try{
      const idManga = req.params.id;
      let coverFileName;
      const response = await axios({
        method: 'GET',
        url: `${baseUrl}/manga/${idManga}?includes[]=cover_art`,
      })
      for(let item of response.data.data.relationships){
        if(item.type === "cover_art"){
          coverFileName= item.attributes.fileName
        }
      }
      res.status(200).json({
        method: 'GET',
        data: `${baseUploadUrl}covers/${idManga}/${coverFileName}`
      })
    } catch(e){
      res.status(404).json({
        message: 'Error',
      })
    }
  },
  listImageChapter: async (req, res) => {
    try {
      const idChapter = req.params.chapterId

      const data = await axios({
        method: 'get',
        url: `${baseUrl}at-home/server/${idChapter}`
      })
  
      const hash = data.data.chapter.hash
      const images = data.data.chapter.data

      const constructedUrls = images.map((image) => `${baseUploadUrl}data/${hash}/${image}`)
      res.status(200).json({
        message: 's',
        constructedUrls: constructedUrls
      })
    } catch (e) {
      res.status(404).json({ e: e.message })
    }
  },
  getManga: async (req, res) => {
  try {
    const { title, includedTagNames, excludedTagNames,limit,offset,includes} = req.query;

      // filter by tag
    let includedTagIDs, excludedTagIDs;
    if (includedTagNames || excludedTagNames) {
        const tags = await axios(`${baseUrl}manga/tag`);
        if (includedTagNames) {
          includedTagIDs = tags.data.data
            .filter(tag => includedTagNames.includes(tag.attributes.name.en))
            .map(tag => tag.id);
        }
        if (excludedTagNames) {
          excludedTagIDs = tags.data.data
            .filter(tag => excludedTagNames.includes(tag.attributes.name.en))
            .map(tag => tag.id);
        }

      }
  
    const order = {
      // year: 'desc',
      rating: 'desc',
      createdAt: 'desc',
      updatedAt: 'desc',
    };

    const finalOrderQuery = {};
    for (const [key, value] of Object.entries(order)) {
      finalOrderQuery[`order[${key}]`] = value;
  };
    const response = await axios({
      method: 'GET',
      url: `${baseUrl}/manga`,
      params: {
        title: title,
        limit,
        offset,
        includes,
        'includedTags': includedTagIDs,
        'excludedTags': excludedTagIDs,
        // ...finalOrderQuery
        }
      })

      res.status(200).json(
        {
          message: 'Success',
          data: response.data
        }
      )
    } catch (e) {
      res.status(404).json({ e: e.message })
    }
  },
  getRandomManga: async(req,res) => {
    try {
      // https://api.mangadex.org/manga/random
      const response = await axios({
        method: 'GET',
        url: 'https://api.mangadex.org/manga/random'
      })
      res.status(202).json({
        data: response.data
      })
    } catch(e){
      res.status(404).json({ e: e.message })
    }
  },
  detailManga: async(req,res) =>{
    try {
      const idManga = req.params.id;
      const response = await axios({
        method: 'GET',
        url: `${baseUrl}/manga/${idManga}`,
        })
  
        res.status(200).json(
          {
            message: 'Success',
            data: response.data
          }
        )
    } catch(e) {
      res.status(404).json({ e: e.message })
    }
  }
};
