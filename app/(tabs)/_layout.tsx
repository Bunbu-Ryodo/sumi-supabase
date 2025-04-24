import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#F6F7EB",
        headerStyle: {
          backgroundColor: "#393E41",
        },
        headerTitleStyle: {
          fontFamily: "QuicksandReg",
        },
        headerShadowVisible: false,
        headerTintColor: "#F6F7EB",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#393E41",
        },
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: "Feed",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "newspaper" : "newspaper-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      ></Tabs.Screen>
    </Tabs>
  );
}
