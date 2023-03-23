import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomNavigation, Text } from "react-native-paper";

const Tab = createBottomTabNavigator();

const BottomBar = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => (
        <BottomNavigation {...props} barStyle={{ backgroundColor: "#fff" }} />
      )}
    >
      <Tab.Screen
        name="Home"
        component={() => <Text>Home</Text>}
        options={{ tabBarIcon: "home" }}
      />
      <Tab.Screen
        name="Search"
        component={() => <Text>Search</Text>}
        options={{ tabBarIcon: "magnify" }}
      />
      <Tab.Screen
        name="Settings"
        component={() => <Text>Settings</Text>}
        options={{ tabBarIcon: "settings" }}
      />
    </Tab.Navigator>
  );
};

export default BottomBar;
