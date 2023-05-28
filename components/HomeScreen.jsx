import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { documentDirectory } from "expo-file-system";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  useTheme,
  Searchbar,
  Portal,
  Modal,
  withTheme,
  Chip,
  Button,
} from "react-native-paper";
import Carousel from "react-native-reanimated-carousel";
import { ActivityIndicator } from "react-native-paper";
import { setTags, getLatestMangas } from "../redux/reducer/manga";
import { useSelector, useDispatch } from "react-redux";
import tag from "../tag.json";
import example from "../example.json";
import { useState, memo, useEffect, useMemo, useCallback } from "react";
import { useRef } from "react";
import CardItem from "./CardItem";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const PopularSection = memo(() => {
  const navigation = useNavigation()
  const carousel = useRef();
  // console.log("render popular");
  const theme = useTheme();
  const style = HomeScreenStyles(theme);
  const width = Dimensions.get("window").width;
  const [popularList, setPopularList] = useState();
  useEffect(() => {
    axios({
      url: `https://api.mangadex.org/manga?includes[]=cover_art&includes[]=artist&includes[]=author&order[followedCount]=desc&contentRating[]=safe&hasAvailableChapters=true`,
      method: "GET",
    }).then(({ data }) => {
      let temp = data.data;
      let temp1 = temp.forEach((element, index) => {
        let cover = element.relationships.filter(
          (item) => item.type === "cover_art"
        )[0];
        let author = element.relationships.filter(
          (item) => item.type === "author"
        )[0];
        temp[index].cover = cover;
        temp[index].author = author;
      });
      // console.log(temp);
      setPopularList(temp);
    });
  }, []);

  return (
    <>
      <Text style={[style.h1, style.whiteText, { marginVertical: 10 }]}>
        Popular
      </Text>
      <GestureHandlerRootView>
        <View style={{ flex: 1 }}>
          {popularList ? (
            <Carousel
              loop
              autoPlay
              autoPlayInterval={2000}
              width={width - 20}
              height={width / 2}
              data={popularList}
              scrollAnimationDuration={1500}
              ref={carousel}
              renderItem={({ index, item }) => (
                <TouchableOpacity onPress={()=>navigation.navigate('Detail',{id:item.id})} style={{
                  flex: 1,
                  borderWidth: 1,
                  justifyContent: "center",
                  borderRadius: 5,
                  overflow: "hidden",
                }}>
                    <Image
                      source={{
                        uri: `https://mangadex.org/covers/${item.id}/${item.cover.attributes.fileName}.256.jpg`,
                      }}
                      style={{ width: "100%", height: "100%" }}
                      blurRadius={5}
                    />
                    <View
                      style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        zIndex: 2,
                        position: "absolute",
                      }}
                    ></View>
                    <View
                      style={{
                        position: "absolute",
                        zIndex: 3,
                        flex: 1,
                        padding: 10,
                        flexDirection: "row",
                      }}
                    >
                      <Image
                        source={{
                          uri: `https://mangadex.org/covers/${item.id}/${item.cover.attributes.fileName}.256.jpg`,
                        }}
                        style={{ width: 100, height: 160 }}
                      />
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text
                          style={[
                            style.h1,
                            style.whiteText,
                            { flexShrink: 1, flexWrap: "wrap" },
                          ]}
                        >
                          {item.attributes.title.en ??
                            item.attributes.title["ja-ro"]}
                        </Text>
                        <Text style={[style.whiteText]}>
                          {item.author.attributes.name}
                        </Text>
                      </View>
                    </View>
                </TouchableOpacity>
              )}
            />
          ) : (
            <></>
          )}
        </View>
      </GestureHandlerRootView>
    </>
  );
});

const LatestSection = memo(({ navigation }) => {
  const theme = useTheme();
  const style = HomeScreenStyles(theme);
  const manga = useSelector((state) => state.manga.manga);
  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <>
      <Text style={[style.h1, style.whiteText, { marginVertical: 10 }]}>
        Latest Update
      </Text>
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          removeClippedSubviews={true}
          data={manga ? manga : []}
          keyExtractor={keyExtractor}
          numColumns={2}
          renderItem={({ item }) => <CardItem item={item} />}
          initialNumToRender={10}
          nestedScrollEnabled={true}
          // navigation={navigation}
        />
        <ActivityIndicator animating={true} />
      </SafeAreaView>
    </>
  );
});

function HomeScreen({ navigation }) {
  const theme = useTheme();
  const style = HomeScreenStyles(theme);
  console.log("render parent");
  const dispatch = useDispatch();
  const [page, increasePage] = useState(0);
  // console.log(documentDirectory);
  useEffect(() => {
    dispatch(getLatestMangas(page));
  }, [page]);

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    const paddingToBottom = 0;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };
  return (
    <>
      <ScrollView
        style={style.container}
        nestedScrollEnabled={true}
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            increasePage(page + 1);
          }
        }}
        scrollEventThrottle={400}
      >
        {/* <SearchSection /> */}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Search");
          }}
        >
          <Searchbar style={style.searchbar} traileringIcon="filter-variant" />
        </TouchableOpacity>
        <PopularSection />
        <LatestSection navigation={navigation} />
      </ScrollView>
    </>
  );
}

const HomeScreenStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 10,
    },
    modalContainer: {
      backgroundColor: theme.colors.background,
      marginHorizontal: 10,
      padding: 20,
      maxHeight: 600,
      marginBottom: 5,
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
      marginTop: 10,
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
    },
    selectedChip: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.onPrimary,
    },
    chipText: {
      color: theme.colors.onSecondaryContainer,
    },
    selectedChipText: {
      color: theme.colors.onPrimary,
    },
  });

export default withTheme(HomeScreen);
