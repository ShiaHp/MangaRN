import { StyleSheet } from "react-native";

const HomeScreenStyles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
            paddingHorizontal: 20,
        },
        modalContainer: {
            backgroundColor: theme.colors.background,
            marginHorizontal: 10,
            padding: 20,
            maxHeight: 600,
            marginBottom: 5,
        },
        h1: {
            fontSize: 23,
            fontWeight: 700,
            backgroundColor: theme.colors.background,
            zIndex: 5,
        },
        h2: {
            fontSize: 16,
            fontWeight: 700,
            marginTop: 10,
        },
        whiteText: {
            color: "white",
        },
        chipContainer: {
            flexDirection: "row",
            flexWrap: "wrap",
            marginTop: 10,
        },
        chip: {
            margin: 2,
        },
        selectedChip: {
            backgroundColor: theme.colors.primary,
            color: theme.colors.onPrimary,
        },
        chipText: {
            color: theme.colors.onSecondaryContainer,
        },
        selectedChipText: {
            color: theme.colors.onPrimary,
        },
    });

export default HomeScreenStyles;
