const { MANGA } = require('@consumet/extensions')
const axios = require('axios')
const mangadex = new MANGA.MangaDex();

const baseUrl = `https://api.mangadex.org/`
const baseUploadUrl = `https://uploads.mangadex.org/`

// https://api.mangadex.org/manga/f98660a1-d2e2-461c-960d-7bd13df8b76d?includes[]=cover_art
module.exports = {
  getListChapter: async (req, res) => {
    try {
      // https://api.mangadex.org/manga/:idManga/feed
      const mangaId = req.params.id;
      const listChapter = await axios({
        method: 'get',
        url: `${baseUrl}/manga/${mangaId}/feed`
      })

    } catch (e) {
      res.status(StatusCodes.EXPECTATION_FAILED).json({
        message: 'Error'
      })
    }
  },
  getCover: async (req, res) => {
    // https://uploads.mangadex.org/covers/:manga-id/:cover-filename
    // https://uploads.mangadex.org/covers/f98660a1-d2e2-461c-960d-7bd13df8b76d/0e161616-96f5-4218-bb8c-5e1a0602a750.png
    //0e161616-96f5-4218-bb8c-5e1a0602a750.png
  },
  listImageChapter: async (req, res) => {
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
    } catch (e) {
      res.status(404).json({ e: e.message })
    }
  },
  getManga: async (req, res) => {
  try {
    const { title, includedTagNames, excludedTagNames } = req.query;

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
      // sort data
    const order = {
      year: 'desc',
      rating: 'desc',
      followedCount: 'desc',
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
        'includedTags': includedTagIDs,
        'excludedTags': excludedTagIDs,
        ...finalOrderQuery
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
  filterByTag: async (req, res) => {
    try {
      // const includedTagNames = ['Action', 'Romance'];
      // const excludedTagNames = ['Harem'];

      const resp = await axios({
        method: 'GET',
        url: `${baseUrl}/manga`,
        params: {

        }
      });

      console.log(resp.data.data.map(manga => manga.id));

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
  }
};
