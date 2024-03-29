import { useTheme, withTheme } from "react-native-paper";
import React, { useEffect, useRef, useState } from "react";
import { GestureHandlerRootView, TouchableWithoutFeedback, TouchableNativeFeedback } from "react-native-gesture-handler";
import Carousel from "react-native-reanimated-carousel";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ToastAndroid,
  Alert
} from "react-native";
import { urlManga } from "../redux/reducer/manga";
import { Appbar, ActivityIndicator, Badge, Snackbar } from "react-native-paper";
import { Dimensions, Platform } from "react-native";
import ExpoFastImage from "expo-fast-image";
import axios from "axios";
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';


const ReadView = ({ route, navigation }) => {
  const { chapterId, title, volume, chapter } = route.params;
  const [pages, setPages] = useState(null);
  const [isScrollReadMode, changeIsScrollReadMode] = useState(false);
  const [idx, setidx] = useState(1);
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isSnackbarVisible, setSnackbarVisible] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(chapterId);
  const [loadedChapters, setLoadedChapters] = useState([]);
  const [isHiddenTop, setHiddenTop] = useState(false);

  const [nextChapter, setNextChapter] = useState();
  const [prevChapter, setPrevChapter] = useState();
  const onToggleSnackBar = () => setSnackbarVisible(!isSnackbarVisible);
  const onDismissSnackBar = () => setSnackbarVisible(false);
  const temp = useRef(0);
  const carousel = useRef();
  const snackbarChildren = useRef();
  const [imageDimensions, setImageDimensions] = useState({
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
  });

  const fetchChapterData = async (chapterId) => {
    return await axios({
      url: `${urlManga}/api/v1/manga/chapter/image/${chapterId}`,
      method: "GET",
    });
  };

  const loadNextChapter = async () => {
    if (nextChapter) {
      setLoadedChapters([...loadedChapters, nextChapter]);
      // setIsLoading(true);
      fetchChapterData(nextChapter.id)
        .then(async (res) => {
          const pageObj = [...pages];
          const pageObjNextChapter = [];
          setNextChapter(res.data.nextChapterItem);
          setPrevChapter(res.data.preChapterItem);
          const randomImageUrl = 'https://e0.pxfuel.com/wallpapers/134/765/desktop-wallpaper-popular-mobile-276-loading-please-wait.jpg';
          const randomImage = await new Promise((resolve) => {
            Image.getSize(randomImageUrl, (width, height) => {
              resolve({
                width,
                height,
                url: randomImageUrl,
                id: 'random-image',
                index: pageObjNextChapter.length,
                offset: 0, // Set the offset as desired for the random image
              });
            });
          });
          pageObjNextChapter.push(randomImage);

          await Promise.all(res.data.constructedUrls.map(async (url, index) => {
            const regex = /\/.*-([a-f0-9]{64})\./;
            const data = await new Promise((resolve) => {
              Image.getSize(url, (width, height) => {
                let id = url.match(regex)[1];
                let currentHeight = Math.round(imageDimensions.width / (width / height));
                temp.current += currentHeight;
                resolve({ width, height: currentHeight, url, id, index, offset: temp.current });
              });
            });
            pageObjNextChapter.push(data);
          }));
          setPages([...pageObj, ...pageObjNextChapter]);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      console.log("No next chapter available");
    }
  };


  const isCloseToBottom = (e) => {
    const { layoutMeasurement, contentSize, contentOffset } = e.nativeEvent;
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };
  // let chapterId = "b5cbe34b-89b3-46a2-86b7-2e92797c5cb9";
  // let title = "title";
  // let volume = 3;
  // let chapter = 2;
  useEffect(() => {

    setIsLoading(true);
    fetchChapterData(chapterId)
      .then(async (res) => {
       const pageObj = [];
        setNextChapter(res.data.nextChapterItem);
        setPrevChapter(res.data.preChapterItem);
        await Promise.all(res.data.constructedUrls.map(async (url, index) => {
          const regex = /\/.*-([a-f0-9]{64})\./;
          const data = await new Promise((resolve) => {
            Image.getSize(url, (width, height) => {
              let id = url.match(regex)[1];
              let currentHeight = Math.round(imageDimensions.width / (width / height));
              temp.current += currentHeight;
              resolve({ width, height: currentHeight, url, id, index, offset: temp.current });
            });
          });
          pageObj.push(data);
        }));
        setPages(pageObj);
        setIsLoading(false)
      })
      .catch((err) => {
        console.error(err);
      });
  }, [chapterId]);

  const moveChapter = (val) => {
    if (val > 0) {
      navigation.navigate("Reader", {
        chapterId: nextChapter.id,
        title: nextChapter.attributes.title,
        volume: nextChapter.attributes.volume,
        chapter: nextChapter.attributes.chapter,
      });
    } else {
      if (prevChapter === undefined) {
          Alert.alert("This is the first chapter");
          return;
      }
      navigation.navigate("Reader", {
        chapterId: prevChapter.id,
        title: prevChapter.attributes.title,
        volume: prevChapter.attributes.volume,
        chapter: prevChapter.attributes.chapter,
      });
    }
  };

  const CountPage = () => {
    return (
      <Badge
        style={{
          position: "absolute",
          bottom: 10,
          left: imageDimensions.width / 2 - 25,
          width: 50,
          height: 30,
          lineHeight: 30,
          zIndex: 10,
          fontSize: 14,
          fontWeight: "bold",
          backgroundColor: theme.colors.secondaryContainer,
          color: theme.colors.onSecondaryContainer,
        }}
      >
        {`${idx}/${pages.length}`}
      </Badge>
    );
  };

  const showDiffInfor = () => {
    Alert.alert(
      "Information",
      `Title: ${title}\nVolume: ${volume}\nChapter: ${chapter}`,
      [
        {
          text: "OK",
          onPress: () => console.log("OK Pressed"),
        },
      ]
    );
  };
  const onScroll = async (e) => {
    const { y } = e.nativeEvent.contentOffset;
    const t = [{ offset: 0 }, ...pages];
    for (let i = 1; i < t.length; i++) {
      if (t[i - 1].offset < y && y < t[i].offset) {
        setidx(i);
        break;
      }
    }
    if (isCloseToBottom(e)) {
      loadNextChapter();
  };
  }

  const movePage = (val) => {
    if (val > 0) {
      carousel.current.next();
    } else {
      carousel.current.prev();
    }
    let i = carousel.current.getCurrentIndex() + 1;
    setidx(i);
  };

  const onChangeMode = () => {
    if (isScrollReadMode) {
      snackbarChildren.current = "Changed to Page mode";
      changeIsScrollReadMode(false);
    } else {
      snackbarChildren.current = "Changed to Scroll mode";
      changeIsScrollReadMode(true);
    }
    onToggleSnackBar();
  };

  return !isLoading ? (
    Platform.OS !== "web" ? (
      <>
        {/* app */}
        { isHiddenTop ? <></> : <Appbar.Header
          style={{
            backgroundColor: theme.colors.background,
            zIndex: 5,
            justifyContent: "space-between",
          }}
        >
          <Appbar.BackAction
            onPress={() => {
              navigation.goBack();
            }}
          />
          <View style={{ flex: 1 }}>
            <Appbar.Content title={title ?? "No Title"} titleStyle={{}} />
            <Appbar.Content
              title={`Vol. ${volume ?? "none"} - Chapter. ${chapter ?? "none"}`}
              titleStyle={{ fontSize: 13, lineHeight: 13 }}
            />
          </View>
          <Appbar.Action icon="book-open" onPress={onChangeMode} />
        </Appbar.Header>}
        {isScrollReadMode ? (

            <ScrollView onScroll={onScroll} scrollEventThrottle={400}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false} >

              {pages.map((item, index) => (
                 <TouchableWithoutFeedback onPress={() => {

                  setHiddenTop(!isHiddenTop);
                }}>
              <ExpoFastImage
                key={index}
                cacheKey={item.id}
                uri={item.url}
                resizeMode="contain"

                style={{
                  width: imageDimensions.width - 10,
                  height: item.height,
                  marginBottom: 5,
                  marginHorizontal: 5,
                }}
              />
               </TouchableWithoutFeedback>
            ))}


          </ScrollView>


        ) : (
          <GestureHandlerRootView>
            <View style={{ flex: 1 }}>
              <Carousel
                loop={false}
                width={imageDimensions.width}
                height={imageDimensions.height - 60}
                data={pages}
                scrollAnimationDuration={500}
                ref={carousel}
                windowSize={200}
                renderItem={({ index, item }) => (
                  <ExpoFastImage
                    key={index}
                    cacheKey={item.id}
                    uri={item.url}
                    resizeMode="contain"
                    style={{
                      width: imageDimensions.width - 10,
                      height: item.height,
                    }}
                  />
                )}
              />
            </View>
            <View
              style={{
                position: "absolute",
                width: imageDimensions.width,
                height: imageDimensions.height,
                flex: 1,
                flexDirection: "row",
                zIndex: 5,
                top: 0,
                left: 0,
                right: 0,
              }}
            >
              <View
                style={{ flex: 1 }}
                onTouchEnd={() => {
                  movePage(-1);
                }}
              ></View>
              <View
                style={{ flex: 1 }}
                onTouchEnd={() => {
                  movePage(+1);
                }}
              ></View>
            </View>
          </GestureHandlerRootView>
        )}
     { isHiddenTop ? <></> : <View style={styles.container}>
      <TouchableOpacity style={styles.iconContainerLeft}>
        <Ionicons name="information-circle" size={24} color="white" onPress={() => showDiffInfor()} />
      </TouchableOpacity>
      <View style={styles.iconContainerMiddle}></View>
      <View style={styles.iconContainerRight}>
        <TouchableOpacity style={styles.icon}>
        <AntDesign name="caretleft" size={20} color="black"  onPress={() => moveChapter(0)}/>
        </TouchableOpacity>
        <TouchableOpacity>
        <AntDesign name="caretright" size={20} color="black" onPress={() => moveChapter(1)} />
        </TouchableOpacity>
      </View>
    </View>}
      </>
    ) : (
      // webb
      <>
        <Appbar.Header
          mode="medium"
          style={{
            backgroundColor: theme.colors.background,
            zIndex: 5,
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          <Appbar.BackAction
            onPress={() => {
              navigation.goBack();
            }}
          />
          <View style={{ flex: 1 }}>
            <Appbar.Content title={title ?? "No Title"} titleStyle={{}} />
            <Appbar.Content
              title={`Vol. ${volume ?? "none"} - Chapter. ${chapter ?? "none"}`}
              titleStyle={{ fontSize: 13, lineHeight: 13 }}
            />
          </View>

          <Appbar.Action icon="book-open" onPress={onChangeMode} />
        </Appbar.Header>
        {isScrollReadMode ? (
          <View>
            <ScrollView
            style={{ backgroundColor: theme.colors.background }}
            onScroll={onScroll}
            scrollEventThrottle={150}
          >
            {pages.map((item, index) => (
              <Image
                key={index}
                source={{ uri: item.src }}
                resizeMode="contain"
                style={{
                  width: imageDimensions.width - 10,
                  height: item.height,
                  marginBottom: 5,
                  marginHorizontal: 5,
                }}
              />
            ))}
          </ScrollView>

          </View>

        ) : (
          <GestureHandlerRootView>
            <View style={{ flex: 1 }}>
              <Carousel
                loop={false}
                width={imageDimensions.width}
                height={imageDimensions.height - 60}
                data={pages}
                scrollAnimationDuration={500}
                ref={carousel}
                renderItem={({ index, item }) => (
                  <Image
                    key={index}
                    source={{ uri: item.src }}
                    resizeMode="contain"
                    style={{
                      width: imageDimensions.width - 10,
                      height: item.height,
                      marginBottom: 5,
                      marginHorizontal: 5,
                    }}
                  />
                )}
              />
            </View>
            <View
              style={{
                position: "absolute",
                width: imageDimensions.width,
                height: imageDimensions.height - 60,
                flex: 1,
                flexDirection: "row",
                zIndex: 5,
                top: 0,
                left: 0,
                right: 0,
              }}
            >
              <View
                style={{ flex: 1 }}
                onTouchEnd={() => {
                  movePage(-1);
                }}
              ></View>
              <View
                style={{ flex: 1 }}
                onTouchEnd={() => {
                  movePage(+1);
                }}
              ></View>
            </View>
          </GestureHandlerRootView>
        )}
        <Snackbar
          visible={isSnackbarVisible}
          onDismiss={onDismissSnackBar}
          duration={500}
          style={{ backgroundColor: theme.colors.secondaryContainer }}
          theme={{ colors: theme.colors.onSecondaryContainer }}
          children={snackbarChildren.current}
        ></Snackbar>
        <CountPage />
      </>
    )
  ) : (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator
        animating={true}
        color={theme.colors.onBackground}
        size={30}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  iconContainerLeft: {
    marginRight: "auto",
  },
  iconContainerMiddle: {
    flex: 1,
  },
  iconContainerRight: {
    flexDirection: "row",
    marginLeft: "auto",
    margin: 5,
  },
  icon: {
    marginHorizontal: 20,
  },
});

export default withTheme(ReadView)

