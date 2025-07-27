import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ExtractType } from "../../types/types";
import { getExtract } from "../../supabase_queries/extracts";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function SharedText() {
  let { id } = useLocalSearchParams();

  const [extract, setExtract] = useState<ExtractType>({
    id: 0,
    title: "",
    author: "",
    chapter: 0,
    year: "",
    fulltext: "",
    portrait: "",
    coverart: "",
    textid: 0,
    subscribeart: "",
    coverartArtist: "",
    coverartYear: 0,
    coverartTitle: "",
  });

  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState(18);
  const [warmth, setWarmth] = useState(0);

  const fontUp = () => {
    setFontSize((prevFont) => {
      if (prevFont + 4 > 32) {
        return prevFont;
      }
      return prevFont + 4;
    });
  };

  const fontDown = () => {
    setFontSize((prevFont) => {
      if (prevFont - 4 < 18) {
        return prevFont;
      }
      return prevFont - 4;
    });
  };

  const adjustBrightness = () => {
    setWarmth((prevWarmth) => {
      if (prevWarmth < 4) {
        return prevWarmth + 1;
      } else return 0;
    });
  };

  const brightnessHex = ["#F6F7EB", "#FEECD1", "#FEE4BD", "#FFDAA3", "#393E41"];

  const fetchExtract = async () => {
    const extract = await getExtract(id);

    if (extract) {
      setExtract(extract);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExtract();
  }, []);

  return (
    <ScrollView
      style={[styles.paper, { backgroundColor: brightnessHex[warmth] }]}
    >
      {loading ? (
        <ActivityIndicator size="large" color="#393E41" />
      ) : (
        <View>
          <View style={styles.adjustFontSize}>
            <TouchableOpacity
              style={[
                styles.fontUp,
                warmth === 4 && { backgroundColor: "#F6F7EB" },
              ]}
              onPress={fontUp}
            >
              <Ionicons name="text" size={24} color="#393E41"></Ionicons>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.fontDown,
                warmth === 4 && { backgroundColor: "#F6F7EB" },
              ]}
              onPress={fontDown}
            >
              <Ionicons name="text" size={18} color="#393E41"></Ionicons>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.brightness,
                warmth === 4 && { backgroundColor: "#F6F7EB" },
              ]}
              onPress={adjustBrightness}
            >
              <Ionicons
                name="sunny-outline"
                size={18}
                color="#393E41"
              ></Ionicons>
            </TouchableOpacity>
          </View>
          <View style={styles.titleBar}>
            <Text style={[styles.title, warmth === 4 && { color: "#F6F7EB" }]}>
              {extract.title}
            </Text>
            <Text
              style={[styles.chapter, warmth === 4 && { color: "#F6F7EB" }]}
            >
              {extract.chapter}
            </Text>
          </View>
          <Text
            style={[
              styles.extractText,
              { fontSize },
              warmth === 4 && {
                color: "#F6F7EB",
                borderBottomColor: "#F6F7EB",
              },
            ]}
          >
            {extract.fulltext}
          </Text>
          <View style={styles.logoContainer}>
            <View style={styles.logoBook}>
              <View style={styles.logoTitle}></View>
            </View>
            <View style={styles.titleTaglineContainer}>
              <Text style={styles.header}>Sumi</Text>
              <Text style={styles.tagline}>Just One More Chapter</Text>
            </View>
          </View>
          <Link href="/" asChild>
            <TouchableOpacity style={styles.buttonPrimary}>
              <Text style={styles.primaryButtonText}>Start Reading More</Text>
            </TouchableOpacity>
          </Link>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#393E41",
    width: "100%",
    height: "100%",
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 8,
  },
  titleBar: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "EBGaramond",
    fontSize: 24,
    marginBottom: 8,
  },
  chapter: {
    fontFamily: "EBGaramond",
    fontSize: 18,
    marginBottom: 16,
  },
  paper: {
    backgroundColor: "#F6F7EB",
    width: "100%",
    padding: 16,
    height: "100%",
  },
  extractText: {
    fontFamily: "EBGaramond",
    borderBottomWidth: 1,
    borderColor: "#393E41",
    paddingBottom: 16,
    borderStyle: "dotted",
  },
  buttonPrimary: {
    marginTop: 8,
    padding: 16,
    backgroundColor: "#393E41",
    borderRadius: 8,
    alignItems: "center",
    fontFamily: "QuicksandReg",
    width: "100%",
  },
  primaryButtonText: {
    color: "#F6F7EB",
    fontFamily: "QuicksandReg",
    fontSize: 16,
  },
  titleTaglineContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoBook: {
    width: 50,
    height: 73,
    padding: 5,
    backgroundColor: "#393E41",
    borderRadius: 2,
  },
  logoTitle: {
    width: 12,
    height: 30,
    borderRadius: 2,
    backgroundColor: "#F6F7EB",
  },
  header: {
    fontSize: 36,
    fontFamily: "EBGaramond",
    color: "#393E41",
  },
  tagline: {
    fontSize: 18,
    fontFamily: "QuicksandReg",
    color: "#393E41",
  },
  adjustFontSize: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  fontUp: {
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    width: 44,
    borderWidth: 1,
    borderColor: "#393E41",
    borderRadius: 8,
    marginHorizontal: 4,
  },
  fontDown: {
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    width: 44,
    borderWidth: 1,
    borderColor: "#393E41",
    marginHorizontal: 4,
    borderRadius: 8,
  },
  brightness: {
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    width: 44,
    borderWidth: 1,
    borderColor: "#393E41",
    marginHorizontal: 4,
    borderRadius: 8,
  },
});
