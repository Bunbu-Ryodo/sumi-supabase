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

export default function SharedText() {
  let { id } = useLocalSearchParams();

  const [extract, setExtract] = useState<ExtractType>({
    id: 0,
    title: "",
    author: "",
    chapter: 0,
    year: "",
    previewtext: "",
    fulltext: "",
    portrait: "",
    coverart: "",
    textid: 0,
    subscribeart: "",
  });

  const [loading, setLoading] = useState(true);

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
    <ScrollView contentContainerStyle={styles.container}>
      <ScrollView style={styles.paper}>
        {loading ? (
          <ActivityIndicator size="large" color="#F6F7EB" />
        ) : (
          <View>
            <View>
              <View style={styles.titleBar}>
                <Text style={styles.title}>{extract.title}</Text>
                <Text style={styles.chapter}>{extract.chapter}</Text>
              </View>
              <Text style={styles.extractText}>{extract.fulltext}</Text>
            </View>
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
    width: "90%",
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
});
