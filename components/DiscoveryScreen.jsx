import { View, SafeAreaView, ScrollView, StyleSheet, Text, FlatList } from "react-native";
import { useTheme, withTheme, Chip, ActivityIndicator } from "react-native-paper";
import { getPopularMangas, getRecommendedMangas } from "../redux/reducer/manga";
import { useSelector, useDispatch } from "react-redux";
import tag from "../tag.json";
import { useState, memo, useEffect, useMemo, useCallback } from "react";

function DiscoveryScreen() {
    // const manga = useSelector((state) => state.manga.manga);
    const theme = useTheme();
    const style = HomeScreenStyles(theme);
    // const dispatch = useDispatch();
    // const [page, increasePage] = useState(0);
    // const keyExtractor = useCallback((item) => item.id, []);
    return (
        <ScrollView style={style.container}>
            <PopularSection />
            <RecommendSection />
        </ScrollView>
    );
}

function PopularSection() {
    const manga = useSelector((state) => state.manga.manga);
    const theme = useTheme();
    const style = HomeScreenStyles(theme);
    const keyExtractor = useCallback((item) => item.id, []);
    const dispatch = useDispatch();
    const [page, increasePage] = useState(0);
    useEffect(() => {
        dispatch(getPopularMangas(page));
    }, [page]);
    return (
        <>
            <Text style={[style.h1, style.whiteText, { marginVertical: 10 }]}>
                Popular
            </Text>
            <SafeAreaView style={{ flex: 1 }}>
                <ActivityIndicator animating={true} />
                <FlatList
                    horizontal={true}
                    removeClippedSubviews={true}
                    data={manga ? manga : []}
                    keyExtractor={keyExtractor}
                    renderItem={({ item }) => <CardItem item={item} />}
                    initialNumToRender={5}
                    nestedScrollEnabled={true}
                    scrollEventThrottle={400}
                />
            </SafeAreaView>
        </>
    );
}
function RecommendSection() {
    const manga = useSelector((state) => state.manga.manga);
    const theme = useTheme();
    const style = HomeScreenStyles(theme);
    const keyExtractor = useCallback((item) => item.id, []);
    const dispatch = useDispatch();
    const [page, increasePage] = useState(0);
    useEffect(() => {
        dispatch(getRecommendedMangas(page));
    }, [page]);
    return (
        <>
            <Text style={[style.h1, style.whiteText, { marginVertical: 10 }]}>
                Recommended for You
            </Text>
            <SafeAreaView style={{ flex: 1 }}>
                <ActivityIndicator animating={true} />
                <FlatList
                    horizontal={true}
                    removeClippedSubviews={true}
                    data={manga ? manga : []}
                    keyExtractor={keyExtractor}
                    renderItem={({ item }) => <CardItem item={item} />}
                    initialNumToRender={5}
                    nestedScrollEnabled={true}
                />
            </SafeAreaView>
        </>
    );
}

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
        horizontalListContainer: {
            flexDirection: "row",
            marginBottom: 20,
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

export default withTheme(DiscoveryScreen);
