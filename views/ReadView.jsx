import { Button, useTheme, withTheme } from "react-native-paper";
import React, { useEffect, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Carousel from "react-native-reanimated-carousel";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ToastAndroid,
  Alert,
  Modal,
  Pressable
} from "react-native";
import { ImageZoom } from '@likashefqet/react-native-image-zoom';
import { url } from "../redux/reducer/manga";
import { Appbar, ActivityIndicator, Badge, Snackbar } from "react-native-paper";
import { Dimensions, Platform } from "react-native";
import ExpoFastImage from "expo-fast-image";
import axios from "axios";
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Animated } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library'

const waitToRetryAgain = (delay) => new Promise((resolve) => {
  setTimeout(resolve, delay);
});

const retryRequest = async (
  image,
  retries = 3,
  delay
) => {
  for (let i = 0; i <= retries - 1; i++) {
    try {
      const response = await fetch(image);
      return response;
    } catch (err) {
      await waitToRetryAgain(delay);
    }
  }
  throw new Error('Max retries exceeded');
};

const handleDownload = async (src) => {
  let date = new Date().getTime();
  let fileUri = FileSystem.documentDirectory + `${date}.jpg`;
  try {
      const res = await FileSystem.downloadAsync(src, fileUri)
      await saveFile(res.uri)
  } catch (err) {
      console.log("FS Err: ", err)
  }
}

const saveFile = async (fileUri) => {
  const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
  if (status === "granted") {
      try {
          const asset = await MediaLibrary.createAssetAsync(fileUri);
          const album = await MediaLibrary.getAlbumAsync('Download');
          if (album == null) {
              await MediaLibrary.createAlbumAsync('Download', asset, false);
          } else {
              await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
          }
      } catch (err) {
          console.log("Save err: ", err)
      }
  } else if (status === "denied") {
      alert("please allow permissions to download")
  }
}

const ReadView = ({ route, navigation }) => {
  const { chapterId, title, volume, chapter } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [pages, setPages] = useState(null);
  const [hidden, setHidden] = useState(false);
  const [isScrollReadMode, changeIsScrollReadMode] = useState(false);
  const [idx, setidx] = useState(1);
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isSnackbarVisible, setSnackbarVisible] = useState(false);
  const [nextChapter, setNextChapter] = useState();
  const [prevChapter, setPrevChapter] = useState();
  const onToggleSnackBar = () => setSnackbarVisible(!isSnackbarVisible);
  const onDismissSnackBar = () => setSnackbarVisible(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const temp = useRef(0);
  const carousel = useRef();
  const snackbarChildren = useRef();
  const [imageDimensions, setImageDimensions] = useState({
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
  });

  // let chapterId = "b5cbe34b-89b3-46a2-86b7-2e92797c5cb9";
  // let title = "title";
  // let volume = 3;
  // let chapter = 2;
  useEffect(() => {
    setIsLoading(true);
    async function fetchData() {
      return await axios({
        url: `${url}/api/v1/manga/chapter/image/${chapterId}`,
        method: "GET",
      });
    }
    fetchData()
      .then((res) => {
        var promises = [];
        temp.current = 0;
        setNextChapter(res.data.nextChapterItem);
        setPrevChapter(res.data.preChapterItem);

        res.data.constructedUrls.forEach((src, index) => {
          promises.push(
            new Promise(async (resolve, reject) => {
              try {
                const response = await fetch(src);
                 await Image.getSize(response.url, (width, height) => {
                  let id = src.slice(-11, -4);
                  let currentHeight = imageDimensions.width / (width / height);
                  temp.current += currentHeight;
                  resolve({
                    width,
                    height: currentHeight,
                    src,
                    id,
                    index,
                    offset: temp.current,
                  });
                });


              } catch (error) {
                console.error(`Error fetching ${src}:`, error);
                const res = await retryRequest(src, 3, 1000).catch((err) => {
                  return err
                });
                await Image.getSize(res.url, (width, height) => {
                  let id = src.slice(-11, -4);
                  let currentHeight = imageDimensions.width / (width / height);
                  temp.current += currentHeight;
                  resolve({
                    width,
                    height: currentHeight,
                    src,
                    id,
                    index,
                    offset: temp.current,
                  });
                });
              }
            })
          );
        });
        Promise.all(promises)
          .then((result) => {
            setPages(result);
            setIsLoading(false);
          })
          .catch((err) => {
            console.error(err);
          });
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

  const onScroll = (e) => {
    const { y } = e.nativeEvent.contentOffset;
    const t = [{ offset: 0 }, ...pages];
    for (let i = 1; i < t.length; i++) {
      if (t[i - 1].offset < y && y < t[i].offset) {
        setidx(i);
        break;
      }
    }
  };

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

  // FIX TODO: add animation here
  // const AnimatedAppbarHeader = ({ hidden, theme, navigation, title, volume, chapter, onChangeMode }) => {
  //   const fadeAnim = useRef(new Animated.Value(0)).current;

  //   useEffect(() => {
  //     if (!hidden) {
  //       Animated.timing(fadeAnim, {
  //         toValue: 1,
  //         duration: 2500,
  //         useNativeDriver: true,
  //       }).start();
  //     }
  //   }, [fadeAnim]);

  //   return (
  //     <Animated.View style={{ opacity: fadeAnim }}>
  //       <Animated.View style={{ transform: [{ translateY: fadeAnim.interpolate({
  //           inputRange: [0, 1],
  //           outputRange: [10, 0],
  //         })}] }}>
  //         <Appbar.Header
  //           style={{
  //             backgroundColor: theme.colors.background,
  //             zIndex: 5,
  //             justifyContent: "space-between",
  //           }}
  //         >
  //           <Appbar.BackAction
  //             onPress={() => {
  //               navigation.goBack();
  //             }}
  //           />
  //           <View style={{ flex: 1 }}>
  //             <Appbar.Content title={title ?? "No Title"} titleStyle={{}} />
  //             <Appbar.Content
  //               title={`Vol. ${volume ?? "none"} - Chapter. ${chapter ?? "none"}`}
  //               titleStyle={{ fontSize: 13, lineHeight: 13 }}
  //             />
  //           </View>
  //           <Appbar.Action icon="book-open" onPress={onChangeMode} />
  //         </Appbar.Header>
  //       </Animated.View>
  //     </Animated.View>
  //   );
  // }
  const toggleHidden = () => {
    setTimeout(() => {
      setHidden(!hidden)
    }, 500 )

  }

  return !isLoading ? (
    Platform.OS !== "web" ? (
      <>
        {/* app */}
        {hidden ? null : (
          <Appbar.Header
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
        </Appbar.Header>
)}

        {!isScrollReadMode ? (
      <><ScrollView onScroll={onScroll} scrollEventThrottle={100}>
            {pages.map((item, index) => (
              <View key={index}>
                <TouchableOpacity onLongPress={() => {
                  setModalVisible();
                  setModalImage(item.src)
                }}>
                  <ImageZoom
                    uri={item.src}
                    resizeMode="contain"
                    style={{
                      flex: 1,
                      width: imageDimensions.width - 10,
                      height: item.height,
                    }} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible !== null}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(null);
            } }
          >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>Hello World!</Text>
                  <Button
                    style={styles.textStyle}
                    onPress={() => {
                      handleDownload(modalImage);
                      setModalVisible(null);
                    } }
                    title="Download" />
                </View>
              </View>
            </Modal></>




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
                    uri={item.src}
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
      { hidden ? null :
      <View style={styles.container}>
      <TouchableOpacity style={styles.iconContainerLeft}>
        <Ionicons name="information-circle" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.iconContainerMiddle}></View>
      <View style={styles.iconContainerRight}>
        <TouchableOpacity style={styles.icon}>
          <AntDesign name="caretleft" size={20} color="black" onPress={() => moveChapter(0)} />
        </TouchableOpacity>
        <TouchableOpacity>
          <AntDesign name="caretright" size={20} color="black" onPress={() => moveChapter(1)} />
        </TouchableOpacity>
      </View>
    </View>

}
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  // fade-in-up' : 'fade-in-down'
});

export default withTheme(ReadView);
