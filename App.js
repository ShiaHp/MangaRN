import {
  Provider as PaperProvider,
  MD3DarkTheme as DefaultTheme,
} from "react-native-paper";
import theme from "./theme";
import { Provider as ReduxProvider, useSelector } from "react-redux";
import RedirectScreen from "./RedirectScreen";
import store from "./redux/reducer/store";


export default function App() {
  
  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={theme}>
          <RedirectScreen/>
      </PaperProvider>
    </ReduxProvider>
  );
}

