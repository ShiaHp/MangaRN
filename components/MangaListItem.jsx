import * as React from "react";

import { List } from "react-native-paper";

const MangaListItem = () => {
    <List.Item
        title="Komi can't communicate"
        description="She's mute - Robert Downey Jr."
        left={(props) => (
            <Image
                {...props}
                style={{
                    
                }}
                source={{
                    uri: "https://callstack.github.io/react-native-paper/screenshots/list-item-2.png",
                }}
            />
        )}
    />;
};

const style = StyleSheet.create({
    leftComponent: {
        flex: 1,
        aspectRatio: 9/16,
    }
})

export default MangaListItem;
