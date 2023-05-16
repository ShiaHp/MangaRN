import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Animated,
  Image,
} from "react-native";
import Markdown from "@ronradtke/react-native-markdown-display";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme, withTheme } from "react-native-paper";
import {
  Appbar,
  Button,
  Chip,
  Divider,
  ActivityIndicator,
  IconButton,
} from "react-native-paper";
import { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDetailManga, listChapter } from "../redux/reducer/manga";
import Icon from "react-native-paper/src/components/Icon";
const chapters = [
  {
    title: "A story of long title",
    volume: 3,
    chapter: 10,
    dateUpload: "12/12/2121",
    author: "Unknown",
  },
  {
    title: "A story of long title",
    volume: 3,
    chapter: 10,
    dateUpload: "12/12/2121",
    author: "Unknown",
  },
  {
    title: "A story of long title",
    volume: 3,
    chapter: 10,
    dateUpload: "12/12/2121",
    author: "Unknown",
  },
  {
    title: "A story of long title",
    volume: 3,
    chapter: 10,
    dateUpload: "12/12/2121",
    author: "Unknown",
  },
  {
    title: "A story of long title",
    volume: 3,
    chapter: 10,
    dateUpload: "12/12/2121",
    author: "Unknown",
  },
];

const PageRenderer = ({ times }) => {
  const arr = Array(times).fill(null);
  const [active, setActive] = useState(1);
  const {id} = useSelector((state)=>state.manga.detailManga)
  const dispatch = useDispatch()
  useEffect(()=>{
    console.log('a');
    dispatch(listChapter(id,active))
  },[active])
  const theme = useTheme();
  const setPage = (method, page) => {
    switch (method) {
      case "NEXT":
        if (active + 1 <= times) setActive(active + 1);
        break;
      case "PREV":
        if (active - 1 > 0) setActive(active - 1);
        break;
      case "SPEC":
        setActive(page);
        break;
    }
  };
  return (
    <>
      <IconButton
        icon={"menu-left"}
        containerColor={theme.colors.secondaryContainer}
        iconColor={theme.colors.onSecondaryContainer}
        onPress={() => setPage("PREV")}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {arr.map((el, index) => {
          return (
            <Button
              key={index}
              mode="contained"
              buttonColor={
                active === index + 1
                  ? theme.colors.primary
                  : theme.colors.secondaryContainer
              }
              textColor={
                active === index + 1
                  ? theme.colors.onPrimary
                  : theme.colors.onSecondaryContainer
              }
              onPress={() => setPage("SPEC", index + 1)}
              style={{ marginHorizontal: 4, height: 35, padding: 0 }}
            >
              {index + 1}
            </Button>
          );
        })}
      </ScrollView>
      <IconButton
        icon={"menu-right"}
        containerColor={theme.colors.secondaryContainer}
        iconColor={theme.colors.onSecondaryContainer}
        onPress={() => setPage("NEXT")}
      />
    </>
  );
};

const ChapterList = () => {
  const theme = useTheme();
  const style = DetailViewStyle(theme);
  const dispatch = useDispatch();
  const listChapter = useSelector((state) => state.manga.listChapter);

  return listChapter ? (
    <View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={[style.whiteText, style.h2]}>
          {listChapter.total} Chapters
        </Text>
        <Icon source={"sort-variant"} color="white" size={25} />
      </View>
      <Divider bold />
      {listChapter.data.map((item) => {
        return (
          <View key={item.id}>
            <View
              
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginVertical: 10,
              }}
            >
              <View>
                <Text
                  style={[style.whiteText, { width: 300 }]}
                  numberOfLines={1}
                >
                  Vol.{item.attributes.volume} Ch.{item.attributes.chapter} -{" "}
                  {item.attributes.title?item.attributes.title:'No Title'}
                </Text>
                <Text style={[style.whiteText]}>
                  {item.attributes.updatedAt?.slice(0, 10)} - unknown
                </Text>
              </View>
              <Icon
                source={"download-circle-outline"}
                size={25}
                color="white"
              />
            </View>
            <Divider bold />
          </View>
        );
      })}
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 20,
        }}
      >
        <PageRenderer times={Math.ceil(listChapter.total / 100)} />
      </View>
    </View>
  ) : (
    <></>
  );
};

function DetailView({ navigation, route }) {
  const {id} = route.params
  const dispatch = useDispatch();
  const detailManga = useSelector((state) => state.manga.detailManga);
  // const id = "34f45c13-2b78-4900-8af2-d0bb551101f4"
  useEffect(() => {
    dispatch(getDetailManga(id));
  }, []);
  const theme = useTheme();
  const style = DetailViewStyle(theme);

  return detailManga ? (
    <View style={style.container}>
      <Animated.View>
        <Appbar.Header
          style={{ backgroundColor: "transparent", zIndex: 5, height: 45 }}
        >
          <Appbar.BackAction
            onPress={() => {
              navigation.goBack();
            }}
          />
          <View style={style.actionContainer}>
            <Appbar.Action icon="bookmark" onPress={() => {}} />
            <Appbar.Action icon="share-variant" onPress={() => {}} />
            <Appbar.Action icon="download" onPress={() => {}} />
          </View>
        </Appbar.Header>
      </Animated.View>
      <ScrollView
        style={{
          flex: 1,
          position: "relative",
          height: "100%",
          flexDirection: "column",
        }}
      >
        {/* <View> */}
        <View style={{ width: "100%", height: 240, position: "absolute" }}>
          <Image
            source={{
              uri: `https://mangadex.org/covers/${detailManga?.id}/${detailManga?.cover.attributes.fileName}.256.jpg`,
            }}
            style={{ width: "100%", height: "100%", zIndex: 1 }}
            blurRadius={3}
          />
          <View
            style={{
              backgroundColor: "rgba(26, 28, 30, 0.4)",
              zIndex: 3,
              width: "100%",
              height: "100%",
              position: "absolute",
            }}
          ></View>
          <LinearGradient
            colors={["transparent", theme.colors.background]}
            locations={[0, 0.9]}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              bottom: 0,
              zIndex: 3,
            }}
          />
        </View>
        <View
          style={{
            padding: 10,
            flex: 1,
            flexDirection: "row",
            marginTop: 50,
            height: "100%",
          }}
        >
          <Image
            source={{
              uri: `https://mangadex.org/covers/${detailManga?.id}/${detailManga?.cover.attributes.fileName}.256.jpg`,
            }}
            style={{ width: 100, height: 150 }}
          />

          <View style={{ marginLeft: 10, width: 230 }}>
            <Text
              style={[
                style.h1,
                style.whiteText,
                { flexShrink: 1, flexWrap: "wrap" },
              ]}
            >
              {detailManga.attributes.title["en"]}
            </Text>
            <Text style={[style.whiteText, { fontWeight: 400, marginTop: 5 }]}>
              {detailManga.author.attributes.name}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 5,
              }}
            >
              <Icon source="clock" color="white" />
              <Text style={[style.whiteText, { marginLeft: 5 }]}>
                Publication: {detailManga.attributes.year},{" "}
                {detailManga.attributes.status}
              </Text>
            </View>
            <Button
              icon="play"
              mode="contained"
              style={{ marginTop: 10 }}
              onPress={() => {}}
            >
              Start Reading
            </Button>
          </View>
        </View>
        {/* </View> */}
        <View style={{ padding: 10 }}>
          <Text style={[style.whiteText, style.h2]}>About this manga</Text>
          <Markdown
            style={{
              body: { color: "white" },
              hr: { backgroundColor: "white" },
            }}
          >
            {detailManga.attributes.description["en"]}
          </Markdown>
          <View style={style.chipContainer}>
            {detailManga.attributes.tags.map((item) => {
              return (
                <Chip
                  style={[style.chip]}
                  key={item.id}
                  textStyle={[style.chipText]}
                >
                  {item.attributes.name["en"]}
                </Chip>
              );
            })}
          </View>
          <ChapterList />
        </View>
      </ScrollView>
    </View>
  ) : (
    <ActivityIndicator animating={true} color={theme.colors.primary} />
  );
}

const DetailViewStyle = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    actionContainer: {
      flex: 1,
      flexDirection: "row",
      position: "absolute",
      right: 0,
    },
    h1: {
      fontSize: 23,
      fontWeight: 700,
      // backgroundColor: theme.colors.background,
      zIndex: 5,
    },
    h2: {
      fontSize: 16,
      fontWeight: 700,
      // marginTop: 10,
    },
    whiteText: {
      color: "white",
    },
    chipContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 10,
    },
    chip: {
      margin: 2,
      marginRight: 10,
      marginBottom: 5,
      backgroundColor: theme.colors.secondaryContainer,
    },
    chipText: {
      color: theme.colors.onSecondaryContainer,
    },
  });

export default withTheme(DetailView);
