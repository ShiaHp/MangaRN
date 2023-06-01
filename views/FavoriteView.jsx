import { withTheme, useTheme } from "react-native-paper";
import axios from "axios";
import {
  Appbar,
  Searchbar,
  Chip,
  Portal,
  Modal,
  Button,
  IconButton,
  ActivityIndicator,
  List,
} from "react-native-paper";
import CardItem from "../components/CardItem";
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
import {
  setSelectedTags,
  getMangaByQuery,
  getTags,
} from "../redux/reducer/manga";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import ExpoFastImage from "expo-fast-image";
import { useNavigation } from "@react-navigation/native";

const FavoriteView = ({ navigation }) => {
  const [popularList, setPopularList] = useState();
  const theme = useTheme();
    const user = useSelector(state=>state.user.value)
  useEffect(() => {
    async function fetching() {
      const { data } = await axios({
        url: `http://localhost:3033/api/v1/users/favorites/${user.id}`,
        method: "GET",
      });
      if (data.length != 0) {
        const result = await axios({
          url: "https://api.mangadex.org/manga",
          method: "GET",
          params: {
            ids: data,
            includes: ['cover_art']
          },
        });
        result.data.data.forEach((element, index) => {
            let cover = element.relationships.find(
              (item) => item.type === "cover_art"
            )
            result.data.data[index].cover = cover;
          });
        setPopularList(result.data.data)
      }
    }
    fetching();
  }, []);

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
        <Appbar.Content title="Favorites" />
      </Appbar.Header>

      <View style={{ flex: 1, height: 300 }}>
        {!popularList ? (
            <View>
                <Text style={{color:'white', fontSize:20, fontWeight: '600', textAlign:'center', marginTop:100}}>Nothing to show here</Text>
            </View> 
        ) : (
          <>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{ width: "100%", height: 220 }}
            >
              {popularList.map((item) => (
                <View key={item.id} style={{ width: 160, height: 220 }}>
                  <CardItem item={item} />
                </View>
              ))}
            </ScrollView>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default withTheme(FavoriteView);
