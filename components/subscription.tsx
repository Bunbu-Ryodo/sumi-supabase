import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { InstalmentTypeClient } from "../types/types.js";

export default function Subscription({
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
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.author}>{author}</Text>
            <Text style={styles.chapter}>Chapter {chapter}</Text>
            <Text style={styles.daysuntil}>
              Available for {daysUntilNextInstalment} days
            </Text>
            <Text style={styles.date}>Next chapter arrives:</Text>
            <Text style={styles.date2}>{nextInstalmentDate}</Text>
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
  },
  subscriptionWrapper: {
    width: "100%",
    margin: 8,
  },
  imageIcons: {
    height: 100,
    width: 90,
    borderRadius: 8,
    margin: 8,
  },
  noSubscribes: {
    fontFamily: "QuicksandReg",
    fontSize: 16,
  },
  title: {
    fontFamily: "QuicksandReg",
    fontSize: 16,
    marginTop: 8,
    marginRight: 12,
  },
  author: {
    fontFamily: "QuicksandReg",
    fontSize: 16,
    marginRight: 12,
  },
  chapter: {
    fontFamily: "QuicksandReg",
    fontSize: 16,
    marginRight: 12,
  },
  daysuntil: {
    fontFamily: "QuicksandReg",
    fontSize: 16,
    marginRight: 12,
  },
  date: {
    fontFamily: "QuicksandReg",
    fontSize: 16,
    marginRight: 12,
  },
  date2: {
    fontFamily: "QuicksandReg",
    fontSize: 16,
    marginRight: 12,
    marginBottom: 8,
  },
});
