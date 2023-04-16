import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
  FlatList,
} from "react-native";
import Styles from "./HomeScreenStyle";
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
import {ActivityIndicator} from 'react-native-paper'
import { setTags, getLatestMangas } from "../redux/reducer/manga";
import { useSelector, useDispatch } from "react-redux";
import tag from "../tag.json";
import example from "../example.json";
import { useState, memo, useEffect, useMemo, useCallback } from "react";
import { useRef } from "react";
import CardItem from "./CardItem";
const MultipleSelectChip = memo(
  ({ name, list, selectChips, isApplyPressed, onPassProps }) => {
    const theme = useTheme();
    const style = HomeScreenStyles(theme);
    const [selectedChips, setSelectedChips] = useState(selectChips);
    const firstUpdate = useRef(true);
    console.log("render chhild");
    useEffect(() => {
      if (firstUpdate.current) {
        firstUpdate.current = false;
        return;
      }
      onPassProps(name, selectedChips);
    }, [isApplyPressed]);

    const toggleSelectedChip = (chip) => {
      setSelectedChips((prevState) => {
        if (prevState.includes(chip)) {
          return prevState.filter((item) => item !== chip);
        }
        return [...prevState, chip];
      });
    };
    return list.map((element) => (
      <Chip
        style={[
          style.chip,
          selectedChips &&
            selectedChips.includes(element) &&
            style.selectedChip,
        ]}
        key={element}
        textStyle={[
          style.chipText,
          selectedChips &&
            selectedChips.includes(element) &&
            style.selectedChipText,
        ]}
        onPress={() => toggleSelectedChip(element)}
      >
        {element}
      </Chip>
    ));
  }
);

const SearchSection = memo(() => {
  console.log("render searchh");
  const theme = useTheme();
  const style = HomeScreenStyles(theme);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [generalSelected, setGeneralSelected] = useState({
    Order: [],
    Status: [],
    Gerne: [],
    Theme: [],
    Format: [],
  });
  const count = useRef(0);
  const onApplyPress = () => {
    ++count.current;
    setSearchModalVisible(false);
  };

  const onPassProps = (name, selectedChips) => {
    setGeneralSelected((prev) => {
      return {
        ...prev,
        [name]: selectedChips,
      };
    });
  };

  const searchChips = useMemo(() => {
    const chips = [];
    Object.keys(generalSelected).forEach((element) => {
      generalSelected[element] &&
        generalSelected[element].map((el) => {
          chips.push(el);
        });
    });
    return chips;
  }, [generalSelected]);
  return (
    <>
      <Searchbar
        style={style.searchbar}
        traileringIcon="filter-variant"
        onTraileringIconPress={() => {
          setSearchModalVisible(true);
        }}
      />
      <Portal>
        <Modal
          contentContainerStyle={style.modalContainer}
          visible={searchModalVisible}
          onDismiss={() => {
            setSearchModalVisible(false);
          }}
        >
          <Text style={[style.h1, style.whiteText]}>Filter</Text>
          <ScrollView style={{ marginBottom: 10 }}>
            <Text style={[style.whiteText, style.h2]}>Sort By</Text>
            <View style={style.chipContainer}>
              <MultipleSelectChip
                name="Order"
                list={tag.sortBy}
                // onSelectChips={onSelectChips}
                selectChips={generalSelected["Order"]}
                isApplyPressed={count.current}
                onPassProps={onPassProps}
              />
            </View>
            <Text style={[style.whiteText, style.h2]}>Status</Text>
            <View style={style.chipContainer}>
              <MultipleSelectChip
                name="Status"
                list={tag.status}
                // onSelectChips={onSelectChips}
                selectChips={generalSelected["Status"]}
                isApplyPressed={count.current}
                onPassProps={onPassProps}
              />
            </View>
            <Text style={[style.whiteText, style.h2]}>Gerne</Text>
            <View style={style.chipContainer}>
              <MultipleSelectChip
                name="Gerne"
                list={tag.genres}
                // onSelectChips={onSelectChips}
                selectChips={generalSelected["Gerne"]}
                isApplyPressed={count.current}
                onPassProps={onPassProps}
              />
            </View>
            <Text style={[style.whiteText, style.h2]}>Theme</Text>
            <View style={style.chipContainer}>
              <MultipleSelectChip
                name="Theme"
                list={tag.themes}
                // onSelectChips={onSelectChips}
                selectChips={generalSelected["Theme"]}
                isApplyPressed={count.current}
                onPassProps={onPassProps}
              />
            </View>
            <Text style={[style.whiteText, style.h2]}>Format</Text>
            <View style={style.chipContainer}>
              <MultipleSelectChip
                name="Format"
                list={tag.formats}
                // onSelectChips={onSelectChips}
                selectChips={generalSelected["Format"]}
                isApplyPressed={count.current}
                onPassProps={onPassProps}
              />
            </View>
            <View></View>
          </ScrollView>
          <Button
            mode="contained"
            style={style.applyBtn}
            onPress={() => onApplyPress()}
          >
            Apply
          </Button>
        </Modal>
      </Portal>
      <View style={style.chipContainer}>
        {searchChips.map((el) => {
          return (
            <Chip
              style={[style.chip, style.selectedChip]}
              key={el}
              textStyle={[style.chipText, style.selectedChipText]}
            >
              {el}
            </Chip>
          );
        })}
      </View>
    </>
  );
});

const PopularSection = memo(() => {
  console.log("render popular");
  const theme = useTheme();
  const style = HomeScreenStyles(theme);
  const width = Dimensions.get("window").width;
  return (
    <>
      <Text style={[style.h1, style.whiteText, { marginVertical: 10 }]}>
        Popular
      </Text>
      <GestureHandlerRootView>
        <View style={{ flex: 1 }}>
          <Carousel
            loop
            autoPlay
            autoPlayInterval={2000}
            width={width - 40}
            height={width / 2}
            data={example.manga}
            scrollAnimationDuration={1500}
            renderItem={({ index, item }) => (
              <View
                style={{
                  flex: 1,
                  borderWidth: 1,
                  justifyContent: "center",
                  borderRadius: 5,
                  overflow: "hidden",
                }}
              >
                <Image
                  source={{
                    uri: item.image,
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
                      uri: item.image,
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
                      {item.title}
                    </Text>
                    <Text style={[style.whiteText]}>{item.author}</Text>
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      </GestureHandlerRootView>
    </>
  );
});

const LatestSection = memo(() => {
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
        />
        <ActivityIndicator animating={true}/>
      </SafeAreaView>
    </>
  );
});

function HomeScreen() {
  const theme = useTheme();
  const style = HomeScreenStyles(theme);
  console.log("render parent");
  const dispatch = useDispatch();
  const [page, increasePage] = useState(0);

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
        <SearchSection />
        <PopularSection />
        <LatestSection />
      </ScrollView>
    </>
  );
}

const HomeScreenStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 20,
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
