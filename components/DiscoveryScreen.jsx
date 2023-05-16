import { View, ScrollView, StyleSheet, FlatList } from "react-native";
import { useTheme, withTheme, Chip } from "react-native-paper";
import { setTags } from "../redux/reducer/manga";
import { useSelector, useDispatch } from "react-redux";
import { useState, memo, useEffect, useMemo, useCallback } from "react";
import CardItem from "./CardItem";
import ListItem from "./ListItem";

function DiscoveryScreen() {
    const manga = useSelector((state) => state.manga.manga);
    const theme = useTheme();
    const style = HomeScreenStyles(theme);

    const keyExtractor = useCallback((item) => item.id, []);
    return (
        <ScrollView style={style.container}>
            <View style={style.horizontalListContainer}>
                <Text>Recommend</Text>
                <ScrollView horizontal={true}>
                    <FlatList
                        removeClippedSubviews={true}
                        data={manga ? manga : []}
                        keyExtractor={keyExtractor}
                        renderItem={({ item }) => <CardItem item={item} />}
                        initialNumToRender={5}
                        nestedScrollEnabled={true}
                    />
                </ScrollView>
                <Text>New to You</Text>
                <ScrollView horizontal={true}>
                    <FlatList
                        removeClippedSubviews={true}
                        data={manga ? manga : []}
                        keyExtractor={keyExtractor}
                        renderItem={({ item }) => <CardItem item={item} />}
                        initialNumToRender={5}
                        nestedScrollEnabled={true}
                    />
                </ScrollView>
            </View>
            <FlatList
                removeClippedSubviews={true}
                data={manga ? manga : []}
                keyExtractor={keyExtractor}
                renderItem={({ item }) => <ListItem item={item} />}
                initialNumToRender={5}
                nestedScrollEnabled={true}
            />
        </ScrollView>
    );
}

function RecommendSection() {
    const manga = useSelector((state) => state.manga.manga);
    const theme = useTheme();
    const style = HomeScreenStyles(theme);
    const keyExtractor = useCallback((item) => item.id, []);

    return (
        <>
            <Text style={[style.h1, style.whiteText, { marginVertical: 10 }]}>
                Recommended for You
            </Text>
            <SafeAreaView style={{ flex: 1 }}>
                <FlatList
                    horizontal={true}
                    removeClippedSubviews={true}
                    data={manga ? manga : []}
                    keyExtractor={keyExtractor}
                    renderItem={({ item }) => <CardItem item={item} />}
                    initialNumToRender={5}
                    nestedScrollEnabled={true}
                />
                <ActivityIndicator animating={true} />
            </SafeAreaView>
        </>
    );
}

const MultipleSelectChip = memo(({ name, list }) => {
    const theme = useTheme();
    const style = HomeScreenStyles(theme);
    const [selectedChips, setSelectedChips] = useState([]);
    const dispatch = useDispatch();
    console.log("render");

    const manga = useSelector((state) => state.manga);
    useEffect(() => {
        let object = {
            ...manga.tag,
            [name]: selectedChips,
        };
        dispatch(setTags(object));
        console.log(manga.tag);
    }, [selectedChips]);
    const toggleSelectedChip = useCallback(
        (chip) => {
            // console.log(chip);
            setSelectedChips((prevState) => {
                if (prevState.includes(chip)) {
                    return prevState.filter((item) => item !== chip);
                }
                return [...prevState, chip];
            });
        },
        [setSelectedChips]
    );
    return useMemo(() => {
        return list.map((element) => (
            <Chip
                style={[
                    style.chip,
                    selectedChips.includes(element) && style.selectedChip,
                ]}
                key={element}
                textStyle={[
                    style.chipText,
                    selectedChips.includes(element) && style.selectedChipText,
                ]}
                onPress={() => toggleSelectedChip(element)}
            >
                {element}
            </Chip>
        ));
    }, [list, selectedChips]);
});

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
