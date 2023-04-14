// import { Card } from "react-native-paper"
import { Image, View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import { memo } from "react";
import axios from "axios";
const CardItem = memo(({ item }) => {
  const [cover, setCover] = useState("");
  useEffect(() => {
    const url = "http://192.168.1.8:3032";
    const getMangaImage = (id) => {
      axios({
        url: `${url}/api/v1/manga/cover/${id}`,
        method: "GET",
      })
        .then((data) => {
          setCover(data.data.data)
        })
        .catch((err) => {
          console.log("Get cover error", err);
        });
    };
    getMangaImage(item.id);
  }, []);
  
  return (
    <View style={styles.card}>
      <Image
        source={{
          uri: cover?cover:'https://www.asiabooks.com/media/catalog/product/placeholder/default/Image_Empty.png',
        }}
        style={styles.image}
      />
      <LinearGradient
        // Background Linear Gradient
        colors={["transparent", "rgba(0,0,0,0.9)"]}
        style={{
          width: "100%",
          height: "50%",
          position: "absolute",
          bottom: 0,
        }}
      />
      <View style={{ position: "absolute", bottom: 0, margin: 10 }}>
        <Text style={[styles.primaryText, , styles.textWrap]}>
          {item.attributes.title["en"]}
        </Text>
        <Text style={[styles.secondaryText, styles.textWrap]}>
          Chapter {item.attributes.lastChapter}
        </Text>
      </View>
    </View>
  );
})
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
