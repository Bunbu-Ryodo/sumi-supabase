import { Stack } from "expo-router";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import supabase from "../lib/supabase";
import { createContext, useContext } from "react";
import { StatusBar } from "react-native";

const SupabaseContext = createContext(supabase);

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    GoudyBookletter: require("../assets/fonts/GoudyBookletter1911-Regular.ttf"),
    QuicksandReg: require("../assets/fonts/Quicksand-Regular.ttf"),
    Merriweather: require("../assets/fonts/Merriweather-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SupabaseContext.Provider value={supabase}>
      <>
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
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </>
    </SupabaseContext.Provider>
  );
}
