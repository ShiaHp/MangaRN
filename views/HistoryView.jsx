import { View, Text, ScrollView } from "react-native";
import { useTheme, withTheme } from "react-native-paper";

function HistoryView() {
    const theme = useTheme()
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: 10,
      }}
    ></ScrollView>
  );
}

export default withTheme(HistoryView);
