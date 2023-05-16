// import { Card } from "react-native-paper"
import { Image, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { memo } from "react";
import { useNavigation } from "@react-navigation/native";
const CardItem = memo(({ item }) => {
  console.log("render item");
  const navigation = useNavigation()
const onItemPress = ()=>{
  navigation.navigate("Detail",{
    id : item.id,
  })
}
  return (
    <TouchableOpacity onPress={onItemPress} style={styles.card}>
    {/* <View style={styles.card}> */}
        <Image
          source={{
            uri: `https://mangadex.org/covers/${item.id}/${item.cover.attributes.fileName}.256.jpg`,
          }}
          style={styles.image}
        />
        <LinearGradient
          // Background Linear Gradient
          colors={["transparent", "rgba(0,0,0,0.9)"]}
          locations={[0, 0.8]}
          style={{
            width: "100%",
            height: "50%",
            position: "absolute",
            bottom: 0,
          }}
        />
        <View style={{ position: "absolute", bottom: 0, margin: 10 }}>
          <Text
            style={[styles.primaryText, , styles.textWrap]}
            numberOfLines={3}
          >
            {item.attributes.title["en"]}
          </Text>
          <Text style={[styles.secondaryText, styles.textWrap]}>
            Chapter {item.attributes.lastChapter}
          </Text>
        </View>
      {/* </View> */}
        </TouchableOpacity>
  );
});
const styles = StyleSheet.create({
  textWrap: {
    color: "white",
    flex: 1,
    flexWrap: "wrap",
  },
  primaryText: {
    fontSize: 18,
    fontWeight: "700",
  },
  secondaryText: {
    fontSize: 13,
    fontWeight: "400",
  },
  card: {
    flex: 1,
    flexDirection: "column",
    margin: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 10,
  },
});

export default CardItem;
