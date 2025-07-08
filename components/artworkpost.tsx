import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRef, useEffect, useState } from "react";
import { ArtworkPostType } from "../types/types";

export default function ArtworkPost({
  id,
  userid,
  username,
  artist,
  title,
  year,
  url,
}: ArtworkPostType) {
  const [imgDimensions, setImgDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const screenWidth = Dimensions.get("window").width - 20;
  let imageHeight = 200; // fallback

  if (imgDimensions) {
    imageHeight = (screenWidth * imgDimensions.height) / imgDimensions.width;
  }

  useEffect(() => {
    if (url) {
      Image.getSize(
        url,
        (width, height) => setImgDimensions({ width, height }),
        (error) => console.log("Failed to get image size", error)
      );
    }
  }, [url]);

  return (
    <View style={styles.artworkpost}>
      <View style={styles.header}>
        {/* <TouchableOpacity>
          <Image></Image>
        </TouchableOpacity> */}
        <View style={{ flex: 1 }}>
          <Text style={styles.username}>{username} shared:</Text>
          <Text style={styles.artworkDetailsTitle}>{title}</Text>
          <Text style={styles.artworkDetails}>{artist}</Text>
          <Text style={styles.artworkDetails}>{year}</Text>
        </View>
      </View>
      <Image
        source={{ uri: url }}
        style={{
          width: screenWidth - 50,
          height: imageHeight,
          marginBottom: 16,
          borderRadius: 8,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  artworkpost: {
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
  header: {
    flexDirection: "row",
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomColor: "#393E41",
    width: "100%",
  },
  username: {
    fontFamily: "EBGaramond",
    fontSize: 16,
    color: "#393E41",
  },
  artworkDetailsTitle: {
    fontFamily: "EBGaramondItalic",
    fontSize: 16,
    color: "#393E41",
  },
  artworkDetails: {
    fontFamily: "EBGaramond",
    fontSize: 16,
    color: "#393E41",
  },
  portrait: {
    borderRadius: 8,
    height: 100,
    width: 100,
    cursor: "pointer",
  },
  thumbnail: {
    width: "100%",
    maxWidth: 768,
    alignItems: "center",
    borderRadius: 8,
    height: 250,
    cursor: "pointer",
  },
});
