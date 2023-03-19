import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider, MD3DarkTheme as DefaultTheme } from 'react-native-paper';
import { StyleSheet, Text, View } from 'react-native';
import { Provider as ReduxProvider } from 'react-redux';
import {LoginView} from './views'
const theme = {
  ...DefaultTheme,
  myOwnProperty : true,
  colors : {
    "primary": "#A1C9FF",
    "primaryContainer": "#00487F",
    "onPrimary": "#00325A",
    "onPrimaryContainer": "#D2E4FF",
    "secondary": "#BBC7DB",
    "secondaryContainer": "#3C4858",
    "onSecondary": "#253141",
    "onSecondaryContainer": "#D7E3F8",
    "tertiary": "#D8BDE4",
    "tertiaryContainer": "#533F5F",
    "onTertiary": "#3C2947",
    "onTertiaryContainer": "#F4D9FF",
    "error": "#FFB4AB",
    "errorContainer": "#93000A",
    "onError": "#690005",
    "onErrorContainer": "#FFDAD6",
    "outline": "#8D9199",
    "background": "#1A1C1E",
    "onBackground": "#E3E2E6",
    "surface": "#1A1C1E",
    "onSurface": "#C6C6CA",
    "surfaceVariant": "#43474E",
    "onSurfaceVariant": "#C3C6CF",
    "inverseSurface": "#E3E2E6",
    "inverseOnSurface": "#1A1C1E",
    "inversePrimary": "#0F61A4",
    "shadow": "#000000",
    "surfaceTint": "#A1C9FF",
    "outlineVariant": "#43474E",
    "scrim": "#000000",
    "neuralVariant" : "#4E535A",
  }
}
export default function App() {
  return (
    // <ReduxProvider>
      <PaperProvider theme={theme}>
        <View style={styles.container} >
          <StatusBar style="auto" />
          <LoginView/>
        </View>
      </PaperProvider>
    // </ReduxProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
