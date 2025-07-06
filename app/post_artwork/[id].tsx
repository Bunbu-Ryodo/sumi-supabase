import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { useState, useEffect } from "react";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useForeground,
} from "react-native-google-mobile-ads";
import { ArtworkType } from "@/types/types";
import { useLocalSearchParams } from "expo-router";
import { getUserArtworkById } from "../../supabase_queries/artworks";
import { getUserSession } from "../../supabase_queries/auth.js";

let adUnitId = "";

if (__DEV__) {
  adUnitId = TestIds.ADAPTIVE_BANNER;
} else if (!__DEV__ && Platform.OS === "android") {
  adUnitId = "ca-app-pub-5850018728161057/6524403480";
} else if (!__DEV__ && Platform.OS === "ios") {
  adUnitId = "ca-app-pub-5850018728161057/3269917700";
}

export default function PostArtwork() {
  let { id } = useLocalSearchParams();
  const [artwork, setArtwork] = useState<ArtworkType | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgDimensions, setImgDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const fetchArtwork = async () => {
    setLoading(true);
    const artworkId = Array.isArray(id) ? id[0] : id;
    const artwork = await getUserArtworkById(artworkId);
    setArtwork(artwork);
    console.log(artwork, "ARTWORK DATA");
  };

  useEffect(() => {
    fetchArtwork();
  }, []);

  useEffect(() => {
    if (artwork && artwork.url) {
      Image.getSize(
        artwork.url,
        (width, height) => setImgDimensions({ width, height }),
        (error) => console.log("Failed to get image size", error)
      );
      setLoading(false);
    }
  }, [artwork]);

  const screenWidth = Dimensions.get("window").width - 20;
  let imageHeight = 200; // fallback

  if (imgDimensions) {
    imageHeight = (screenWidth * imgDimensions.height) / imgDimensions.width;
  }

  return (
    <ScrollView
      contentContainerStyle={styles.postArtworkWrapper}
      style={styles.container}
    >
      {loading ? (
        <ActivityIndicator size="large" color="#393E41" />
      ) : (
        <View style={styles.frameButtonsSection}>
          {artwork && artwork.url ? (
            <Image
              source={{ uri: artwork.url }}
              style={{
                width: screenWidth,
                height: imageHeight,
                marginBottom: 16,
                borderRadius: 8,
              }}
            />
          ) : (
            <Text>No artwork found.</Text>
          )}
          <TouchableOpacity style={styles.postButton}>
            <Text style={styles.signInButtonText}>
              Post Artwork To Public Feed
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.postButton}>
            <Text style={styles.signInButtonText}>
              Delete Artwork from My Collection
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  postArtworkWrapper: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#F6F7EB",
  },
  container: {
    flex: 1,
    backgroundColor: "#F6F7EB",
  },
  frameButtonsSection: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  postButton: {
    marginTop: 8,
    padding: 16,
    backgroundColor: "#393E41",
    borderRadius: 8,
    alignItems: "center",
    fontFamily: "QuicksandReg",
    width: "100%",
  },
  signInButtonText: {
    color: "#F6F7EB",
    fontFamily: "QuicksandReg",
    fontSize: 16,
  },
});
