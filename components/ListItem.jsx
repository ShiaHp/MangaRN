import * as React from "react";
import { StyleSheet } from "react-native";
import { List } from "react-native-paper";

const ListItem = () => {
    <List.Item
        title="Komi can't communicate"
        description="She's mute - Robert Downey Jr."
        left={(props) => (
            <Image
                {...props}
                source={{
                    uri: `https://mangadex.org/covers/${item.id}/${item.cover.attributes.fileName}.256.jpg`,
                }}
                style={styles.image}
            />
        )}
    />;
};

const styles = StyleSheet.create({
    image: {
        flex: 1,
        aspectRatio: 9/16,
    }
})

export default ListItem;
