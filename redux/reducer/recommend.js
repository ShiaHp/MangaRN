import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const url = "http://127.0.0.1:8000/";

export const getRecommendMangas = (offset) => (dispatch) => {
  axios({
    url: `${url}/docs#/anime/anime_anime_post`,
    method: "POST",
    params: {
      anime: offset,
    },
  })
    .then((payload) => {
      const mangaList = payload.data.data.data;
      var cover = null;
      mangaList.forEach((element, index) => {
        cover = element.relationships.filter(
          (item) => item.type === "cover_art"
        )[0];
        mangaList[index].cover = cover;
      });
      dispatch(setManga(mangaList));
    })
    .catch((err) => {
      console.log("Get manga error", err);
    });
};
