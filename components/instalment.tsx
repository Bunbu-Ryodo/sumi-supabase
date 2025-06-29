import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { InstalmentTypeClient } from "../types/types.js";

export default function Instalment({
  id,
  extractid,
  title,
  author,
  chapter,
  subscribeart,
  sequeldue,
}: InstalmentTypeClient) {
  return (
    <View style={styles.subscriptionWrapper}>
      <Link
        href={{ pathname: "/ereader/[id]", params: { id: extractid } }}
        asChild
      >
        <TouchableOpacity key={id} style={styles.subscriptionButton}>
          <Image style={styles.imageIcons} source={{ uri: subscribeart }} />
          <Text style={styles.instalmentTitle}>
            {title}, ch. {chapter}
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  subscriptionButton: {
    width: "100%",
    alignItems: "center",
  },
  subscriptionWrapper: { flex: 0.333 },
  instalmentTitle: {
    fontSize: 16,
    fontFamily: "EBGaramondItalic",
    textAlign: "center",
  },
  imageIcons: {
    height: 81,
    width: 81,
    borderRadius: 8,
    margin: 8,
  },
  noSubscribes: {
    fontFamily: "QuicksandReg",
    fontSize: 16,
  },
  details: {
    fontFamily: "QuicksandReg",
    fontSize: 16,
  },
  daysLeft: {
    color: "#D64045",
  },
  detailsPanel: {
    padding: 8,
  },
});
