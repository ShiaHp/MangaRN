
const axios = require('axios')
const baseUrl = `https://api.mangadex.org/`
const baseUploadUrl = `https://uploads.mangadex.org/`

// https://api.mangadex.org/manga/f98660a1-d2e2-461c-960d-7bd13df8b76d?includes[]=cover_art
module.exports = {
  getListChapter: async (req, res) => {
    try {
      // https://api.mangadex.org/manga/:idManga/feed
      const mangaId = req.params.mangaId;
      const { order, limit, offset, includes } = req.query;
      const listChapter = await axios({
        method: 'get',
        url: `${baseUrl}manga/${mangaId}/feed`,
        params: {
          order,
          limit,
          offset,
          translatedLanguage: ['en'],
          includes,
        }
      });
      let latestChapter = 0;
      let startChapter = 0;
      let startChapterItem = null;

      for (let item of listChapter.data.data) {
        const currentChapter = Number(item.attributes.chapter);

        if (currentChapter > latestChapter) {
          latestChapter = currentChapter;
        }

        if (startChapter === 0 || currentChapter < startChapter) {
          startChapter = currentChapter;
          startChapterItem = item;
        }
      }




      res.status(200).json({
        message: 'Success',
        data: {
          ...listChapter.data,
          latestChapter: latestChapter,
          startChapter: startChapter,
          startChapterId: startChapterItem,
        }

      })
    } catch (e) {
      res.status(404).json({
        message: 'Error',
      })
    }
  },
  startChapter: async (req, res) => {
    try {
      // https://api.mangadex.org/manga/:idManga/feed
      const mangaId = req.params.mangaId;
      const listChapter = await axios({
        method: 'get',
        url: `${baseUrl}manga/${mangaId}/feed`,
       params: {
        translatedLanguage: ['en'],
       }

      });
      let latestChapter = 0;
      let startChapter = 0;
      let startChapterItem = null;

      for (let item of listChapter.data.data) {
        const currentChapter = Number(item.attributes.chapter);

        if (currentChapter > latestChapter) {
          latestChapter = currentChapter;
        }

        if (startChapter === 0 || currentChapter < startChapter) {
          startChapter = currentChapter;
          startChapterItem = item;
        }
      }




      res.status(200).json({
        message: 'Success',
        data: {
          latestChapter: latestChapter,
          startChapter: startChapter,
          startChapterItem: startChapterItem,
        }

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
    try {
      const idManga = req.params.id;
      let coverFileName;
      const response = await axios({
        method: 'GET',
        url: `${baseUrl}/manga/${idManga}?includes[]=cover_art`,
      })
      for (let item of response.data.data.relationships) {
        if (item.type === "cover_art") {
          coverFileName = item.attributes.fileName
        }
      }
      res.status(200).json({
        method: 'GET',
        data: `${baseUploadUrl}covers/${idManga}/${coverFileName}`
      })
    } catch (e) {
      res.status(404).json({
        message: 'Error',
      })
    }
  },
  listImageChapter: async (req, res) => {
    try {
      const idChapter = req.params.chapterId
      let mangaId;
      const data = await axios({
        method: 'get',
        url: `${baseUrl}at-home/server/${idChapter}`
      });

      const preAndCurrentChapter = await axios({
        method: 'get',
        url: `${baseUrl}chapter/${idChapter}`
      })
      for (let item of preAndCurrentChapter.data.data.relationships) {
        if (item.type === "manga") {
          mangaId = item.id
        }
      }
      const listChapter = await axios({
        method: 'get',
        url: `${baseUrl}manga/${mangaId}/feed`,
        params: {
          translatedLanguage: ['en'],
        }
      });
      let nextChapterItem = null;
      let preChapterItem = null;

      for (let item of listChapter.data.data) {
        const currentChapter = Number(item.attributes.chapter);

        if (currentChapter === Number(preAndCurrentChapter.data.data.attributes.chapter) - 1) {
          preChapterItem = item;
        }

        if (currentChapter === Number(preAndCurrentChapter.data.data.attributes.chapter) + 1) {
          nextChapterItem = item;
        }
      }

      const hash = data.data.chapter.hash
      const images = data.data.chapter.data

      const constructedUrls = images.map((image) => `${baseUploadUrl}data/${hash}/${image}`)
      res.status(200).json({
        message: 'Success',
        constructedUrls: constructedUrls,
        nextChapterItem: nextChapterItem,
        preChapterItem: preChapterItem,
      })
    } catch (e) {
      res.status(404).json({ e: e.message })
    }
  },
  getManga: async (req, res) => {
    try {
      const { title, includedTagNames, excludedTagNames, limit, offset, includes, availableTranslatedLanguage } = req.query;

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
      var data = await axios({
        method: 'GET',
        url: `${baseUrl}/manga`,
        params: {
          title: title,
          limit,
          offset,
          includes,
          availableTranslatedLanguage: ['en'],
          'includedTags': includedTagIDs,
          'excludedTags': excludedTagIDs,
          // ...finalOrderQuery
        }
      })
      res.status(200).json(
        {
          message: 'Success',
          data: data.data,
        }
      )
    } catch (e) {
      res.status(404).json({ e: e.message })
    }
  },
  getRandomManga: async (req, res) => {
    try {
      // https://api.mangadex.org/manga/random
      const response = await axios({
        method: 'GET',
        url: 'https://api.mangadex.org/manga/random'
      })
      res.status(202).json({
        data: response.data
      })
    } catch (e) {
      res.status(404).json({ e: e.message })
    }
  },
  detailManga: async (req, res) => {
    try {
      const idManga = req.params.id;
      const response = await axios({
        method: 'GET',
        url: `${baseUrl}/manga/${idManga}`,
        params: {
          includes: ['cover_art', 'author']
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
  }
};
