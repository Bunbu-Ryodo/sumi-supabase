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
  const nextInstalmentDue =
    new Date(sequeldue).getTime() - new Date().getTime();
  const daysUntilNextInstalment = Math.floor(
    nextInstalmentDue / (1000 * 60 * 60 * 24)
  );

  const nextInstalmentDate = new Date(sequeldue).toLocaleDateString("en-GB", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View style={styles.subscriptionWrapper}>
      <Link
        href={{ pathname: "/ereader/[id]", params: { id: extractid } }}
        asChild
      >
        <TouchableOpacity key={id} style={styles.subscriptionButton}>
          <Image style={styles.imageIcons} source={{ uri: subscribeart }} />
          <Text style={styles.instalmentTitle}>{title}</Text>
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
