import { withTheme, Button } from "react-native-paper";
import { View, Text } from "react-native";
import Style from "./Style";
import { useDispatch } from "react-redux";
import { logOut } from "../redux/reducer/user";
import { BottomBar, TopBar } from "../components/";
function HomeView() {
  const dispatch = useDispatch();
  const style = Style();
  const onLogOutPressed = () => {
    dispatch(logOut());
  };
  return (
    <>
      <View style={style.container}>
        <View>
          <TopBar />
          {/* <Button mode="contained" onPress={onLogOutPressed}>
            Log out
          </Button> */}

          {/* <BottomBar/> */}
        </View>
      </View>
    </>
  );
}

export default withTheme(HomeView);
