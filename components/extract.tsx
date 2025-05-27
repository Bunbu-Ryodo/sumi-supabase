import * as Clipboard from "expo-clipboard";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { Link } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, {
  useImperativeHandle,
  forwardRef,
  useRef,
  useEffect,
  useState,
} from "react";
import type { PropsWithChildren } from "react";
import { ExtractType } from "../types/types.js";
import { useRouter } from "expo-router";

type BounceInProps = PropsWithChildren<{}>;

const BounceView = forwardRef<any, BounceInProps>((props, ref) => {
  const scale = useRef(new Animated.Value(1)).current;

  useImperativeHandle(ref, () => ({
    bounce: () => {
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.3333,
          duration: 200,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 100,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    },
  }));

  return (
    <Animated.View
      style={{
        transform: [{ scale }],
      }}
    >
      {props.children}
    </Animated.View>
  );
});

export default function Extract({
  id,
  title,
  author,
  chapter,
  year,
  previewtext,
  portrait,
  coverart,
  textid,
}: ExtractType) {
  const [like, setLike] = useState(false);
  const router = useRouter();

  function toggleLike() {
    if (heartRef.current) {
      heartRef.current.bounce();
    }
    setLike(!like);
  }

  const copyToClipboard = async () => {
    if (clipRef.current) {
      clipRef.current.bounce();
    }
    const link = `http://localhost:8081/share_text/${id}`;
    await Clipboard.setStringAsync(link);
  };

  const handleNavigation = () => {
    router.push({
      pathname: "/ereader/[id]",
      params: { id },
    });
  };

  useEffect(() => {}, []);

  const clipRef = useRef<any>(null);
  const heartRef = useRef<any>(null);

  return (
    <View style={styles.extract}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleNavigation}>
          <Image source={{ uri: portrait }} style={styles.portrait}></Image>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNavigation}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerTextTitle}>{title}</Text>
            <Text style={styles.headerText}>Chapter {chapter}</Text>
            <Text style={styles.headerText}>{author}</Text>
            <Text style={styles.headerText}>({year})</Text>
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleNavigation}>
        <View style={styles.previewText}>
          <Text style={styles.text}>{previewtext}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleNavigation} style={styles.thumbnail}>
        <Image source={{ uri: coverart }} style={styles.thumbnail} />
      </TouchableOpacity>
      {/* <View style={styles.engagementButtons}>
        <TouchableOpacity style={styles.icon} onPress={toggleLike}>
          <BounceView ref={heartRef}>
            <Ionicons
              name={like ? "heart" : "heart-outline"}
              size={24}
              color="#D64045"
            />
          </BounceView>
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon} onPress={copyToClipboard}>
          <BounceView ref={clipRef}>
            <Ionicons name="clipboard" size={24} color="#8980F5" />
          </BounceView>
        </TouchableOpacity>
      </View> */}
    </View>
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
  thumbnail: {
    width: "100%",
    maxWidth: 768,
    alignItems: "center",
    borderRadius: 8,
    height: 250,
    cursor: "pointer",
  },
  previewText: {
    marginTop: 12,
    marginBottom: 12,
  },
  portrait: {
    borderRadius: 8,
    height: 100,
    width: 100,
    cursor: "pointer",
  },
  text: {
    fontFamily: "EBGaramond",
    fontSize: 18,
    cursor: "pointer",
  },
  header: {
    flexDirection: "row",
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomColor: "#393E41",
    borderBottomWidth: 1,
    borderStyle: "dotted",
    width: "100%",
  },
  headerContainer: {
    padding: 8,
    cursor: "pointer",
  },
  headerText: {
    marginLeft: 12,
    fontSize: 14,
    fontFamily: "EBGaramond",
  },
  headerTextTitle: {
    marginLeft: 12,
    fontSize: 16,
    fontFamily: "EBGaramondItalic",
  },
  headerTextFrequency: {
    marginLeft: 12,
    fontWeight: 600,
    fontSize: 14,
    fontFamily: "EBGaramond",
    color: "#D64045",
  },
  engagementButtons: {
    marginTop: 16,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
  },
  icon: {
    cursor: "pointer",
  },
  subscribe: {
    flexDirection: "row",
  },
  readFullText: {
    fontFamily: "EBGaramond",
    fontSize: 14,
    color: "#393E41",
    textDecorationLine: "underline",
    marginLeft: 12,
  },
});
