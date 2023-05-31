import {
  View,
  Text,
  ScrollView,
  Image,
  Button,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useTheme, withTheme, IconButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteReadListById,
  getReadListFromStore,
} from "../redux/reducer/manga";
// import readList from "../example.json";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
function HistoryView() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const theme = useTheme();
  const [history, setHistory] = useState();
  const [manga, setManga] = useState(null);
  const { readList } = useSelector((state) => state.manga);
  const onRemovePress = (id) => {
    dispatch(deleteReadListById(id));
  };
  const dataProccess = () => {
    // let temp = -Infinity;
    let arr = {};
    let temp = "";
    console.log(readList);
    readList?.forEach((item, idx) => {
      let key = new Date(readList[idx].lastTimeRead)
        .toLocaleString("vi")
        .split(" ")[1];
      if (temp != key) {
        temp = key;
        arr[key] = [{ ...readList[idx], id: item.mangaId }];
      } else {
        arr[key] = [...arr[key], { ...readList[idx], id: item.mangaId }];
      }
    });
    setHistory(arr);
    let listId = readList.map((item) => item.mangaId);
    if (listId.length !== 0) {
      axios({
        url: `https://api.mangadex.org/manga`,
        method: "GET",
        params: {
          ids: listId,
          includes: ["cover_art"],
        },
      })
        .then(({ data }) => {
          setManga(data.data);
        })
        .catch((err) => {
          console.log("get manga err", err);
        });
    }
  };

  useEffect(() => {
    dataProccess();
    return () => {
      setManga(null);
    };
  }, [readList]);
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: 10,
      }}
    >
      {history && manga ? (
        Object.keys(history).map((rawDate) => {
          return (
            <View key={rawDate}>
              <Text style={{ color: "white", fontWeight: "600", fontSize: 18 }}>
                {rawDate}
              </Text>
              {history[rawDate].map((item) => {
                let query = manga.find((i) => i.id === item.id);
                console.log({ query, manga, history });
                let cover = query?.relationships.find(
                  (item) => item.type === "cover_art"
                );
                query.cover = cover;
                return (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("Detail", { id: item.id });
                    }}
                    key={item.id}
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      marginVertical: 10,
                      width: "100%",
                    }}
                  >
                    <Image
                      source={{
                        uri: `https://mangadex.org/covers/${query.id}/${query.cover.attributes.fileName}.256.jpg`,
                      }}
                      style={{ width: 80, height: 100, borderRadius: 7 }}
                    />
                    <View style={{ flex: 1, marginLeft: 10, marginTop: 20 }}>
                      <Text
                        style={{ color: "white", fontWeight: "700" }}
                        numberOfLines={2}
                      >
                        {query.attributes.title.en ??
                          query.attributes.title["ja-ro"]}
                      </Text>
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "300",
                          fontSize: 14,
                        }}
                      >
                        Chapter {item.lastChapter}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        marginLeft: 10,
                        marginTop: 20,
                      }}
                    >
                      <IconButton
                        icon={"delete"}
                        onPress={() => onRemovePress(query.id)}
                        size={30}
                      />
                      <IconButton
                        icon={"play"}
                        size={30}
                        onPress={() =>
                          navigation.navigate("Reader", {
                            chapterId:
                              item.chapterId[item.chapterId.length - 1],
                            title: item.mangaTitle,
                            volume: null,
                            chapter: item.lastChapter,
                          })
                        }
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })
      ) : (
        <View>
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontSize: 19,
              marginTop: 100,
            }}
          >
            You haven't read anything yet
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

export default withTheme(HistoryView);
