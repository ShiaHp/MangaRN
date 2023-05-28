import { withTheme, useTheme } from "react-native-paper";
import {
  Appbar,
  Searchbar,
  Chip,
  Portal,
  Modal,
  Button,
  IconButton,
  List,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { memo, useState, useEffect, useRef, useMemo, useCallback } from "react";
import tag from "../tag.json";
import {
  setSelectedTags,
  getMangaByQuery,
  getTags,
} from "../redux/reducer/manga";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import ExpoFastImage from "expo-fast-image";
import { useNavigation } from "@react-navigation/native";
const MultipleSelectChip = memo(({ name, list, onChipPressed   }) => {
  const theme = useTheme();
  const style = HomeScreenStyles(theme);
  console.log("render chhild");
  // console.log(selectTags);
  const { selectedTags } = useSelector((state) => state.manga);
  return list.map((element) => {
    return (
      <Chip
        style={[
          style.chip,
          selectedTags &&
            selectedTags.includes(element.id) &&
            style.selectedChip,
        ]}
        key={element.id}
        textStyle={[
          style.chipText,
          selectedTags &&
            selectedTags.includes(element.id) &&
            style.selectedChipText,
        ]}
        onPress={() => onChipPressed({ key: name, tag: element.id })}
      >
        {element.name}
      </Chip>
    );
  });
});

const SearchSection = memo(() => {
  console.log("render searchh");
  const { tags } = useSelector((state) => state.manga);
  const theme = useTheme();
  const style = HomeScreenStyles(theme);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  // const [selectTags, setSelectTags] = useState([])
  const { selectedTags } = useSelector((state) => state.manga);
  const [searchText, setSearchText] = useState();
  const dispatch = useDispatch();
  const onApplyPress = () => {
    setSearchModalVisible(false);
  };

  const onChipPressed = useCallback(({ key, tag }) => {
    // setSelectTags((prev)=>[...prev,{key, tag}])
    dispatch(setSelectedTags({ key, tag }));
  }, []);
  useEffect(() => {
    // debouce search
    const submit = setTimeout(() => {
      // console.log(searchText);
      dispatch(getMangaByQuery(searchText));
    }, 1000);
    return () => {
      clearTimeout(submit);
    };
  }, [searchText, selectedTags]);

  return (
    <>
      <Searchbar
        style={{ marginTop: 20 }}
        traileringIcon="filter-variant"
        onChangeText={(text) => setSearchText(text)}
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
            {Object.keys(tags).map((item) => {
              return (
                <View key={item}>
                  <Text style={[style.whiteText, style.h2]}>{item}</Text>
                  <View style={style.chipContainer}>
                    <MultipleSelectChip
                    // selectTags={selectTags}
                      name={item}
                      list={tags[item]}
                      onChipPressed={onChipPressed}
                    />
                  </View>
                </View>
              );
            })}
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
    </>
  );
});

const ResultItem = ({ item }) => {
  const theme = useTheme();
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Detail", {
          id: item.id,
        })
      }
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          maxHeight: 130,
          overflow: "hidden",
          borderRadius: 5,
          backgroundColor: theme.colors.elevation.level4,
          padding: 5,
          marginBottom: 10,
        }}
      >
        {/* <ExpoFastImage
        // key={index}
        // cacheKey={item.id}
        uri={"https://product.hstatic.net/200000343865/product/12_f289eb898483406ca5bc77363e7f935d_master.jpg"}
        resizeMode="contain"
        style={{
          width : 80,
          height : 180,
        }}
      /> */}
        <Image
          source={{
            uri: `https://mangadex.org/covers/${item.id}/${item.cover.attributes.fileName}.256.jpg`,
          }}
          resizeMode="contain"
          style={{
            width: 90,
            height: 120,
            marginRight: 10,
          }}
        />
        <View style={{ flex: 1, flexDirection: "row",  }}>
          <View style={{ flex: 3 }}>
            <View>
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
              >
                {item.attributes.title.en}
              </Text>
              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  width: "100%",
                  height: 20,
                }}
              >
                <Icon name="account-edit" color="white" />
                <Text style={{ color: "white", marginLeft:5 }}>
                  {item.author.attributes.name}
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  width: "100%",
                  height: 20,
                }}
              >
                <Icon name="calendar-range" color="white" />
                <Text style={{ color: "white", marginLeft:5 }}>
                {item.attributes.updatedAt.slice(0, 10)}
                </Text>
              </View>
            </View>
          </View>
          <IconButton icon={"download"} style={{ flex: 1 , alignSelf:'center'}} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ResultSection = () => {
  const { searchResult } = useSelector((state) => state.manga);
  return searchResult ? (
    <FlatList
      data={searchResult}
      style={{ marginTop: 20 }}
      keyExtractor={(item) => item.id}
      initialNumToRender={10}
      renderItem={({ item }) => <ResultItem item={item} />}
    />
  ) : (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Icon name="bookmark-remove" size={40} color={"white"} />
      <Text style={{ color: "white", fontSize: 20 }}>There is no item</Text>
    </View>
  );
};

const SearchView = ({ navigation }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  dispatch(getTags());
  const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: 10,
      }}
    >
      <Appbar.Header
        mode="small"
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
      </Appbar.Header>
      <SearchSection />
      <ResultSection />
    </SafeAreaView>
  );
};

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

export default withTheme(SearchView);
