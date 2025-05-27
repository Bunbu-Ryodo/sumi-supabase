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
          <View style={styles.detailsPanel}>
            <Text style={styles.details}>{title}</Text>
            <Text style={styles.details}>{author}</Text>
            <Text style={styles.details}>Chapter {chapter}</Text>
            <Text style={[styles.details, styles.daysLeft]}>
              Available for {daysUntilNextInstalment} days
            </Text>
            <Text style={styles.details}>Next chapter arrives</Text>
            <Text style={styles.details}> {nextInstalmentDate}</Text>
          </View>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  subscriptionButton: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#393E41",
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  subscriptionWrapper: {
    width: "100%",
    margin: 8,
  },
  imageIcons: {
    height: 120,
    width: 120,
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
