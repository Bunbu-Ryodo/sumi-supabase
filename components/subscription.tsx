import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

type instalmentProps = {
  id: number;
  extractId: number;
  title: string;
  author: string;
  chapter: string;
  subscribeArt: string;
};

export default function Subscription({
  id,
  extractId,
  title,
  author,
  chapter,
  subscribeArt,
}: instalmentProps) {
  return (
    <View style={styles.subscriptionWrapper}>
      <Link
        href={{ pathname: "/ereader/[id]", params: { id: extractId } }}
        asChild
      >
        <TouchableOpacity key={id} style={styles.subscriptionButton}>
          <Image style={styles.imageIcons} source={{ uri: subscribeArt }} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.author}>{author}</Text>
          <Text style={styles.author}>Chapter {chapter}</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  subscriptionSection: {
    marginTop: 12,
    flexDirection: "row",
    padding: 8,
    width: "100%",
  },
  subscriptionButton: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  subscriptionWrapper: {
    padding: 8,
    margin: 8,
  },
  imageIcons: {
    height: 100,
    width: 90,
    marginLeft: 8,
    marginRight: 8,
    borderRadius: 8,
  },
  noSubscribes: {
    fontFamily: "QuicksandReg",
    fontSize: 16,
  },
  title: {
    fontFamily: "QuicksandReg",
    fontSize: 16,
    alignSelf: "center",
    marginTop: 8,
  },
  author: {
    fontFamily: "QuicksandReg",
    fontSize: 16,
    alignSelf: "center",
  },
  chapter: {
    fontFamily: "QuicksandReg",
    fontSize: 16,
    alignSelf: "center",
  },
});
