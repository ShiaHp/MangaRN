import { View, Text, ScrollView, StyleSheet } from "react-native";
import Styles from "./HomeScreenStyle";
import {
  useTheme,
  Searchbar,
  Portal,
  Modal,
  withTheme,
  Chip,
  Button,
} from "react-native-paper";
import { setTags } from "../redux/reducer/manga";
import { useSelector, useDispatch } from "react-redux";
import tag from "../tag.json";
import { useState, memo, useEffect, useMemo, useCallback } from "react";

const MultipleSelectChip = memo(({ name, list }) => {
  const theme = useTheme();
  const style = HomeScreenStyles(theme);
  const [selectedChips, setSelectedChips] = useState([]);
  const dispatch = useDispatch();
  console.log("render");
  
  const manga = useSelector((state) => state.manga);
  useEffect(() => {
    let object = {
      ...manga.tag,
      [name]: selectedChips,
    };
    setTimeout(() => {
      dispatch(setTags(object));
    }, 100);
    
  }, [selectedChips]); 
  
  const toggleSelectedChip = useCallback((chip) => {
    setSelectedChips((prevState) => {
      if (prevState.includes(chip)) {
        return prevState.filter((item) => item !== chip);
      }
      return [...prevState, chip];
    });
  }, []);
  return useMemo(() => {
    return list.map((element) => (
      <Chip
        style={[
          style.chip,
          selectedChips.includes(element) && style.selectedChip,
        ]}
        key={element}
        showSelectedOverlay={true}
        textStyle={[
          style.chipText,
          selectedChips.includes(element) && style.selectedChipText,
        ]}
        onPress={() => toggleSelectedChip(element)}
      >
        {element}
      </Chip>
    ));
  },[[list, selectedChips, toggleSelectedChip]]);
});

function HomeScreen() {
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const manga = useSelector((state) => state.manga);
  const theme = useTheme();
  const style = HomeScreenStyles(theme);
  const [chipVisible, setChipVisible] = useState(false);
  const {tags} = manga;
  console.log("render container");
  const onApplyPress = () => {
    // console.log(selectedChips);
    setChipVisible((prev)=>{return !prev})
  };

  const [searchChips, setSearchChips] = useState([]);
  useEffect(() => { 
    setSearchChips([]);
    tags &&
      Object.keys(tags).forEach((element) => {
        tags[element] &&
          tags[element].map((el) => {
            setSearchChips((prev) => {
              return [...prev, el];
            });
          });
      });
  }, []);

  return (
    <ScrollView style={style.container}>
      <Searchbar
        style={style.searchbar}
        traileringIcon="filter-variant"
        onTraileringIconPress={() => setSearchModalVisible(true)}
      />
      <ScrollView
        horizontal={true}
        style={style.chipContainer}
        showsHorizontalScrollIndicator={false}
      >
        {
          searchChips.length !== 0 &&
          searchChips.map((e) => (
            <Chip style={style.chip} key={e}>
              {e}
            </Chip>
          ))}
      </ScrollView>
      <Portal>
        <Modal
          contentContainerStyle={style.modalContainer}
          visible={searchModalVisible}
          onDismiss={() => setSearchModalVisible(false)}
        >
          <Text style={[style.h1, style.whiteText]}>Filter</Text>
          <ScrollView style={{ marginBottom: 10 }}>
            <Text style={[style.whiteText, style.h2]}>Sort By</Text>
            <View style={style.chipContainer}>
              <MultipleSelectChip name="Order" list={tag.sortBy} />
            </View>
            <Text style={[style.whiteText, style.h2]}>Status</Text>
            <View style={style.chipContainer}>
              <MultipleSelectChip name="Status" list={tag.status} />
            </View>
            <Text style={[style.whiteText, style.h2]}>Gerne</Text>
            <View style={style.chipContainer}>
              <MultipleSelectChip name="Gerne" list={tag.genres} />
            </View>
            <Text style={[style.whiteText, style.h2]}>Theme</Text>
            <View style={style.chipContainer}>
              <MultipleSelectChip name="Theme" list={tag.themes} />
            </View>
            <Text style={[style.whiteText, style.h2]}>Format</Text>
            <View style={style.chipContainer}>
              <MultipleSelectChip name="Format" list={tag.formats} />
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
    </ScrollView>
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
      backgroundColor: theme.colors.background,
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
