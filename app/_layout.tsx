import { Stack } from "expo-router";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import supabase from "../lib/supabase";
import { createContext, useContext } from "react";

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
      <Stack>
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        ></Stack.Screen>
        <Stack.Screen
          name="register"
          options={{ headerShown: false }}
        ></Stack.Screen>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SupabaseContext.Provider>
  );
}
