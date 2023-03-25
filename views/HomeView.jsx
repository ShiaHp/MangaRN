import { useState } from "react";
import {
  withTheme,
  Button,
  Searchbar,
  Modal,
  Portal,
} from "react-native-paper";
import { View, Text } from "react-native";
import Style from "./Style";
import { BottomBar, TopBar } from "../components/";
function HomeView() {
  const style = Style();
  const [visible, setVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState("");
  const onChangeSearch = (query) => setSearchQuery(query);
  return (
    <View style={style.container}>
      <TopBar />
      <Searchbar
        placeholder="Search..."
        onChangeText={onChangeSearch}
        value={searchQuery}
        traileringIcon="filter-variant"
        onTraileringIconPress={() => setVisible(true)}
      />
      <Portal>
        <Modal
          visible={visible}
          onDismiss={()=>setVisible(false)}
          contentContainerStyle={style.modalContent}
          style={style.modalWrapper}
        >
          <Text>alskdjalsdkj</Text>
        </Modal>
      </Portal>
      {/* <BottomBar/> */}
    </View>
  );
}

export default withTheme(HomeView);
