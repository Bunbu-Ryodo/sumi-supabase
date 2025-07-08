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
import {
  getUserArtworkById,
  deleteUserArtwork,
} from "../../supabase_queries/artworks";
import {
  postArtworkToFeed,
  deleteArtworkFromFeed,
} from "../../supabase_queries/artworks";
import { lookUpUserProfile } from "../../supabase_queries/auth.js";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

let adUnitId = "";

if (__DEV__) {
  adUnitId = TestIds.ADAPTIVE_BANNER;
} else if (!__DEV__ && Platform.OS === "android") {
  adUnitId = "ca-app-pub-5850018728161057/6524403480";
} else if (!__DEV__ && Platform.OS === "ios") {
  adUnitId = "ca-app-pub-5850018728161057/3269917700";
}

const postToast = (url: string) => {
  Toast.show({
    type: "postedArtwork",
    text1: "Posted Artwork to Feed",
    text2: url,
  });
};

const deleteToast = (url: string) => {
  Toast.show({
    type: "postedArtwork",
    text1: "Deleted Artwork From Feed",
    text2: url,
  });
};

export default function PostArtwork() {
  const router = useRouter();
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
  };

  const postToFeed = async () => {
    if (artwork) {
      const { title, artist, year, url, userid } = artwork;
      const profile = await lookUpUserProfile(userid);
      const { username } = profile;
      const posted = await postArtworkToFeed(
        userid,
        username,
        artist,
        title,
        url,
        year
      );
      if (posted) {
        fetchArtwork();
        postToast(url);
      }
    }
  };

  const deleteFromFeed = async () => {
    if (artwork) {
      const { title, artist, year, url } = artwork;

      const deleted = await deleteArtworkFromFeed(
        artwork?.userid,
        title,
        artist,
        year
      );
      if (deleted) {
        fetchArtwork();
        deleteToast(url);
      }
    }
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

  const deleteArtwork = async () => {
    if (artwork) {
      const deleted = await deleteUserArtwork(artwork?.userid, artwork?.id);
      if (deleted) {
        router.push("/subscriptions");
      }
    }
  };

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
          <View style={styles.artworkDetailsContainer}>
            <Text style={styles.artworkTitle}>{artwork?.title}</Text>
            <Text style={styles.artworkDetails}>{artwork?.artist}</Text>
            <Text style={styles.artworkDetails}>{artwork?.year}</Text>
          </View>
          {artwork && artwork.posted ? (
            <TouchableOpacity
              style={styles.postButton}
              onPress={deleteFromFeed}
            >
              <Ionicons name="close" size={24} color="#F6F7EB" />
              <Text style={styles.buttonText}>Remove Artwork From Feed</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.postButton} onPress={postToFeed}>
              <Ionicons name="share-social" size={24} color="#F6F7EB" />
              <Text style={styles.buttonText}>Post Artwork To Public Feed</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.deleteButton} onPress={deleteArtwork}>
            <Ionicons name="trash" size={24} color="#F6F7EB" />
            <Text style={styles.buttonText}>
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
    justifyContent: "center",
    backgroundColor: "#F6F7EB",
    minHeight: 450,
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
    flexDirection: "row",
    backgroundColor: "#393E41",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "QuicksandReg",
    width: "100%",
  },
  deleteButton: {
    marginTop: 8,
    padding: 16,
    flexDirection: "row",
    backgroundColor: "#D64045",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "QuicksandReg",
    width: "100%",
  },
  buttonText: {
    color: "#F6F7EB",
    fontFamily: "QuicksandReg",
    fontSize: 16,
    marginLeft: 8,
  },
  artworkTitle: {
    fontFamily: "EBGaramondItalic",
    fontSize: 18,
    color: "#393E41",
    textAlign: "center",
  },
  artworkDetails: {
    fontFamily: "EBGaramond",
    fontSize: 18,
    color: "#393E41",
    textAlign: "center",
  },
  artworkDetailsContainer: {},
});
