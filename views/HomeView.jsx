import {
  withTheme,
  Button,
  Searchbar,
  Modal,
  Portal,
  BottomNavigation,
} from "react-native-paper";
import { StyleSheet } from "react-native";

import { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { View, Text } from "react-native";
import Style from "./Style";
import { BottomBar, TopBar } from "../components/";

function HomeView() {
  const style = Style();
  return (
    <>
      <View style={style.container}>
          <TopBar />
          <BottomBar />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default withTheme(HomeView);
