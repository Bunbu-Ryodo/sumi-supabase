import { Stack } from "expo-router";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import supabase from "../lib/supabase";
import { createContext, useContext } from "react";
import { View, Text } from "react-native";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast, { BaseToast } from "react-native-toast-message";
import Ionicons from "@expo/vector-icons/Ionicons";

const SupabaseContext = createContext(supabase);

import mobileAds from "react-native-google-mobile-ads";

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    QuicksandReg: require("../assets/fonts/Quicksand-Regular.ttf"),
    EBGaramond: require("../assets/fonts/EBGaramondVariable.ttf"),
    EBGaramondItalic: require("../assets/fonts/EBGaramondItalic.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      // Keep the splash screen visible while we fetch resources
      await SplashScreen.preventAutoHideAsync();

      // Initialize Google Mobile Ads SDK
      await mobileAds().initialize();

      // Load any other resources or data that you need
    }

    prepare();
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const toastConfig = {
    achievementUnlocked: ({
      text1,
      text2,
    }: {
      text1?: string;
      text2?: string;
    }) => (
      <View
        style={{
          width: "85%",
          borderRadius: 8,
          backgroundColor: "#F6F7EB",
          borderWidth: 1,
          borderColor: "#393E41",
          padding: 12,
          flexDirection: "row",
        }}
      >
        <View
          style={{
            height: 44,
            width: 44,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#393E41",
            borderRadius: 8,
            marginRight: 8,
          }}
        >
          <Ionicons name="star" size={24} color="#F6F7EB"></Ionicons>
        </View>
        <View>
          <Text
            style={{
              fontFamily: "QuicksandReg",
              fontSize: 16,
              color: "#393E41",
            }}
          >
            {text1 ?? ""}
          </Text>
          <Text
            style={{
              fontFamily: "QuicksandReg",
              fontSize: 12,
              color: "#393E41",
            }}
          >
            {text2 ?? ""}
          </Text>
        </View>
      </View>
    ),
  };

  return (
    <SupabaseContext.Provider value={supabase}>
      <GestureHandlerRootView>
        <StatusBar
          backgroundColor="#393E41" // Match the header background color
          barStyle="light-content" // Light icons for dark background
        />
        <Stack>
          <Stack.Screen
            name="index"
            options={{ headerShown: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="register"
            options={{ headerShown: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="passwordreset"
            options={{ headerShown: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="changepassword"
            options={{ headerShown: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="ereader/[id]"
            options={{ headerShown: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="share_text/[id]"
            options={{ headerShown: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="post_artwork/[id]"
            options={{
              headerShown: true,
              title: "Post Artwork",
              headerStyle: {
                backgroundColor: "#393E41",
              },
              headerTitleStyle: {
                fontFamily: "QuicksandReg",
                color: "#F6F7EB",
              },
              headerTintColor: "#F6F7EB",
              headerShadowVisible: false,
            }}
          ></Stack.Screen>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <Toast config={toastConfig} />
      </GestureHandlerRootView>
    </SupabaseContext.Provider>
  );
}
