import {
  Provider as PaperProvider,
  MD3DarkTheme as DefaultTheme,
} from "react-native-paper";
import theme from "./theme";
import { StyleSheet, Text, View } from "react-native";
import { Provider as ReduxProvider } from "react-redux";
import {LoginView, RegisterView, HomeView} from "./views";
import RedirectScreen from "./RedirectScreen";
import store from "./redux/reducer/store";
import * as native from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


export default function App() {
  
  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={theme}>
          <RedirectScreen/>
      </PaperProvider>
    </ReduxProvider>
  );
}

