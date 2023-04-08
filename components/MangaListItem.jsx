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
                    uri: "https://mangadex.org/covers/fb569d12-1e00-47e3-86cd-793b4eae715c/354dd4df-3331-4b7c-9e16-3aa87f54942f.jpg",
                }}
            />
        )}
    />;
};

export default MangaListItem;
