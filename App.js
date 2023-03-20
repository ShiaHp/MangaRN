import { StatusBar } from "expo-status-bar";
import {
    Provider as PaperProvider,
    MD3DarkTheme as DefaultTheme,
} from "react-native-paper";
import theme from "./theme";
import { StyleSheet, Text, View } from "react-native";
import { Provider as ReduxProvider } from "react-redux";
import LoginView from "./views/LoginView";
import RegisterView from "./views/RegisterView";
// import HomeView from "./views/HomeView";
import * as native from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        // <ReduxProvider>
        <PaperProvider theme={theme}>
            <native.NavigationContainer theme={theme}>
                <Stack.Navigator
                    initialRouteName='Login'
                    screenOptions={{
                        headerShown: false,
                        animation: "slide_from_right",
                    }}
                >
                    <Stack.Screen name='Login' component={LoginView} />
                    <Stack.Screen name='Register' component={RegisterView} />
                    {/* <Stack.Screen name="Home" component={HomeView} /> */}
                </Stack.Navigator>
            </native.NavigationContainer>
        </PaperProvider>
        // </ReduxProvider>
    );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.colors.background,
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
