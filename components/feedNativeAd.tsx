import { View, Text, StyleSheet } from "react-native";
import {
  NativeAd,
  NativeAdView,
  NativeMediaView,
  TestIds,
} from "react-native-google-mobile-ads";
import { useEffect, useState } from "react";

export default function FeedNativeAd() {
  const [nativeAd, setNativeAd] = useState<NativeAd | null>(null);

  useEffect(() => {
    NativeAd.createForAdRequest(TestIds.NATIVE)
      .then(setNativeAd)
      .catch(console.error);
  }, []);

  if (!nativeAd) {
    // Optionally, show a loading indicator or nothing while the ad is loading
    return null;
  }

  return (
    <NativeAdView nativeAd={nativeAd}>
      <NativeMediaView />
    </NativeAdView>
  );
}

const styles = StyleSheet.create({
  extract: {
    backgroundColor: "#F6F7EB",
    width: "100%",
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#393E41",
  },
});
