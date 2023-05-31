import {
    withTheme,
    Button,
    Searchbar,
    Modal,
    Portal,
    BottomNavigation,
} from "react-native-paper";

import { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { View, Text } from "react-native";
import Style from "./Style";
import { BottomBar, TopBar, MangaListItem } from "../components/";

function DiscoveryView() {
    const style = Style();
    return (
        <>
            <View style={style.container}>
                <View>
                    <TopBar />
                </View>
                <MangaListItem />
                <BottomBar />
            </View>
        </>
    );
}


export default withTheme(DiscoveryView);
