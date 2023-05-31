import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  useTheme,
  withTheme,
  Chip,
  Searchbar,
  ActivityIndicator,
} from "react-native-paper";
import { useState, memo, useEffect, useMemo, useCallback } from "react";
import CardItem from "./CardItem";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
function DiscoveryScreen() {
  const theme = useTheme();
  const style = HomeScreenStyles(theme);
  const navigation = useNavigation();
  return (
    <ScrollView style={style.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Search");
        }}
      >
        <Searchbar style={style.searchbar} traileringIcon="filter-variant" />
      </TouchableOpacity>
      <PopularSection />
      <RecommendSection />
    </ScrollView>
  );
}

function PopularSection() {
  const [popularList, setPopularList] = useState();
  const theme = useTheme();
  const style = HomeScreenStyles(theme);

  useEffect(() => {
    axios({
      url: `https://api.mangadex.org/manga`,
      method: "GET",
      params: {
        limit: 10,
        includes: ["cover_art"],
        "order[followedCount]": "desc",
        hasAvailableChapters: true,
      },
    })
      .then(({ data }) => {
        const mangaList = data.data;
        mangaList.forEach((element, index) => {
          let cover = element.relationships.filter(
            (item) => item.type === "cover_art"
          )[0];
          mangaList[index].cover = cover;
        });
        setPopularList(mangaList);
      })
      .catch((err) => {
        console.log("Get manga error", err);
      });
  }, []);

  return (
    <View style={{borderBottomWidth:2, borderTopWidth:2, marginTop: 20, borderColor:'gray', backgroundColor:theme.colors.elevation.level3}}>
      <Text style={[style.h1, style.whiteText, { marginVertical: 10, backgroundColor:theme.colors.elevation.level3 }]}>
        Popular
      </Text>
      <SafeAreaView style={{ flex: 1, height: 300 }}>
        {!popularList ? (
          <ActivityIndicator animating={true} />
        ) : (
          <>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{ width: "100%", height: 220 }}
            >
              {popularList.map((item) => (
                <View key={item.id} style={{ width: 160, height: 220 }}>
                  <CardItem item={item}  />
                </View>
              ))}
            </ScrollView>
          </>
        )}
      </SafeAreaView>
    </View>
  );
}
function RecommendSection() {
  const theme = useTheme();
  const style = HomeScreenStyles(theme);
  const [recList, setRecList] = useState()
  useEffect(() => {
    axios({
      url: `https://api.mangadex.org/manga`,
      method: "GET",
      params: {
        limit: 10,
        includes: ["cover_art"],
        "order[updatedAt]": "desc",
      },
    })
      .then(({data}) => {
        const mangaList = data.data;
        mangaList.forEach((element, index) => {
          let cover = element.relationships.filter(
            (item) => item.type === "cover_art"
          )[0];
          mangaList[index].cover = cover;
        });
        setRecList(mangaList)
      })
      .catch((err) => {
        console.log("Get manga error", err);
      });
  }, []);

  return (
    <>
      <Text style={[style.h1, style.whiteText, { marginVertical: 10 }]}>
        Recommended for You
      </Text>
      <SafeAreaView style={{ flex: 1, height: 300 }}>
        {!recList ? (
          <ActivityIndicator animating={true} />
        ) : (
          <>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{ width: "100%", height: 220 }}
            >
              {recList.map((item) => (
                <View style={{ width: 160, height: 220 }} key={item.id}>
                  <CardItem item={item}  />
                </View>
              ))}
            </ScrollView>
          </>
        )}
      </SafeAreaView>
    </>
  );
}

const HomeScreenStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      // paddingHorizontal: 20,
    },
    modalContainer: {
      backgroundColor: theme.colors.background,
      marginHorizontal: 10,
      padding: 20,
      maxHeight: 600,
      marginBottom: 5,
    },
    horizontalListContainer: {
      flexDirection: "row",
      marginBottom: 20,
    },
    h1: {
      marginLeft : 10,
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

export default withTheme(DiscoveryScreen);
