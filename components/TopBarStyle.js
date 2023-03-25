import { useTheme } from "react-native-paper";

const TopBarStyle = () => {
    const theme = useTheme();
    return {
        container: {
            backgroundColor: theme.colors.onBackground,
            flex : 1,
        },
        
    };
};

export default TopBarStyle;
