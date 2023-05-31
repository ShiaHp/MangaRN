import { StyleSheet } from "react-native";
import * as React from "react";
import { withTheme, useTheme } from "react-native-paper";
import {
  Text,
  Appbar,
  Portal,
  Modal,
  Avatar,
  Button,
  TouchableRipple,
} from "react-native-paper";
// import Style from "./TopBarStyle.js"
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../redux/reducer/user";

function TopBar() {
  const theme = useTheme();
  const style = styles(theme);
  const [visible, setVisible] = React.useState(true);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const dispatch = useDispatch();
  const user = useSelector((state)=>state.user.value)
  const onLogOutPressed = () => {
    dispatch(logOut());
  };
  return (
    <>
      <Appbar.Header
        style={style.appbarContainer}
        backgroundColor={theme.colors.darkContainer}
      >
        <Appbar.Content
          theme={theme}
          color={theme.colors.primary}
          style={{ margin: 0 }}
          title="KomicBooks"
        />
        <Appbar.Action icon="account" onPress={() => showModal(visible)} />
        <TouchableRipple onPress={() => showModal(visible)}>
          <Avatar.Image
            size={40}
            source={{
              uri: "https://gamek.mediacdn.vn/133514250583805952/2021/11/17/co9-16371265918121873152617.jpg",
            }}
          />
        </TouchableRipple>
      </Appbar.Header>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={{
            backgroundColor : theme.colors.elevation.level2,
            paddingHorizontal: 30,
            paddingVertical : 20,
            marginHorizontal : 30,
            borderRadius : 5
          }}
          style={style.modalWrapper}
          
        >
          <Text style={{fontWeight:'bold', fontSize: 25, textAlign : 'center'}}>{user||'Unamed'}</Text>
          <Button mode="contained" style={{marginBottom: 20}} onPress={onLogOutPressed}>
            Your favorite
          </Button>
          <Button mode="contained" onPress={onLogOutPressed}>
            Log out
          </Button>
        </Modal>
      </Portal>
    </>
  );
}

const styles = (theme) =>
  StyleSheet.create({
    appbarContainer: {
      // position: "absolute",
      // top: 20,
      // width: "100%",
    },
    modalContent: {
      //   textAlign: "center",
      padding: 40,
      backgroundColor: theme.colors.darkContainer,
    },
    modalWrapper: {
      backgroundColor: "rgba(0,0,0,.4)",
    },
  });

export default withTheme(TopBar);
