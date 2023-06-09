import { useTheme } from "react-native-paper";

const loginStyle = () => {
  const theme = useTheme();
  return {
    flexContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    //   paddingHorizontal: 20,
      // justifyContent: "center",
    },
    input: {
      borderRadius: 5,
      width: 300,
      backgroundColor: theme.colors.neuralVariant,
      color: theme.colors.onSurfaceVariant,
      marginTop: 10,
    },
    button: {
      marginTop: 10,
    },
    headerText: {
      color: "#fff",
      fontWeight: 700,
      fontSize: 26,
      marginTop: 30,
    },
    logoText: {
      color: theme.colors.primary,
      fontWeight: 900,
      fontSize: 40,
      marginBottom: 40,
    },
    forgotText: {
      color: theme.colors.secondary,
      marginVertical: 10,
    },
    guestText: {
      textDecorationLine: "underline",
      color: theme.colors.secondary,
      textAlign: "center",
      marginTop: 20,
    },
    modalWrapper: {
      backgroundColor: "rgba(0,0,0,.4)",
    },
    modalContent: {
        padding: 40,
        backgroundColor: theme.colors.darkContainer,
      },
  };
};

export default loginStyle ;
