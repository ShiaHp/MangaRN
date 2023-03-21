import { withTheme, Button } from "react-native-paper";
import { View, Text } from "react-native";
import style from "./Style";
import { useDispatch } from "react-redux";
import {  logOut } from "../redux/reducer/user";
import {BottomBar} from '../components/'
function HomeView() {
    const dispatch = useDispatch()
    const onLogOutPressed = ()=>{
        dispatch(logOut())
    }
  return (
    <View style={style(style).container}>
      <Button mode="contained" onPress={onLogOutPressed}>
        Log out
      </Button>

      <BottomBar/>
      
    </View>
  );
}

export default withTheme(HomeView);
