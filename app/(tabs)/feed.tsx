import { StyleSheet, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  createNewProfile,
  lookUpUserProfile,
  getUserSession,
} from "../../supabase_queries/auth.js";
import { getExtracts } from "../../supabase_queries/feed";
import {
  getAllDueSubscriptions,
  getExtractByTextIdChapter,
  createInstalment,
  updateSubscription,
  getAllInstalments,
} from "../../supabase_queries/subscriptions";
import { ExtractType } from "../../types/types.js";
import Extract from "../../components/extract";

export default function FeedScreen() {
  const router = useRouter();
  const [extracts, setExtracts] = useState([] as ExtractType[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserAuthenticated = async function () {
      const user = await getUserSession();

      if (!user) {
        router.push("/");
      } else if (user) {
        const userProfile = await lookUpUserProfile(user.id);
        if (!userProfile) {
          await createNewProfile(user.id, new Date());
        }
        await fetchExtracts();
        const { data: subscriptionData, error } = await getAllDueSubscriptions(
          user.id
        );
        console.log("Subscriptions:", subscriptionData);
        if (subscriptionData) {
          for (let i = 0; i < subscriptionData.length; i++) {
            console.log("textid", subscriptionData[i].textid);
            console.log("chapter", subscriptionData[i].chapter);
            const { data: extract, error } = await getExtractByTextIdChapter(
              subscriptionData[i].textid,
              subscriptionData[i].chapter
            );
            console.log("Extract:", extract);
            console.log("index", i);

            if (extract && extract.length > 0) {
              const { data: instalmentData, error } = await createInstalment(
                user.id,
                extract[0].id,
                extract[0].chapter,
                extract[0].title,
                extract[0].author,
                subscriptionData[i].id
              );

              if (error) {
                console.error("Error creating instalment:", error.message);
              } else {
                console.log("Instalment created successfully:", instalmentData);
                const { data, error: updateError } = await updateSubscription(
                  subscriptionData[i].id,
                  subscriptionData[i].chapter + 1
                );

                if (updateError) {
                  console.error(
                    "Error updating subscription:",
                    updateError.message
                  );
                } else {
                  console.log("Subscription updated successfully:", data);
                }
              }
            }
          }
        } else if (error) {
          console.log("Error", error);
        }
        const { data, error: fetchInstalmentError } = await getAllInstalments(
          user.id
        );
        console.log("Instalments:", data);
      }
    };
    checkUserAuthenticated();
  }, []);

  const fetchExtracts = async function () {
    const { data, error } = await getExtracts();
    if (error) {
      console.error("Error fetching extracts:", error);
    } else {
      if (data) {
        setExtracts(data);
      } else {
        setExtracts([]);
      }
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      style={styles.container}
    >
      {extracts &&
        extracts.map((extract: ExtractType, index: number) => (
          <Extract
            key={index}
            id={extract.id}
            textid={extract.textid}
            author={extract.author}
            title={extract.title}
            year={extract.year}
            chapter={extract.chapter}
            previewtext={extract.previewtext}
            fulltext={extract.fulltext}
            subscribeart={extract.subscribeart}
            portrait={extract.portrait}
            coverart={extract.coverart}
          />
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: "center", // Center the Extract components horizontally
    paddingVertical: 24, // Add some vertical padding if needed
  },
  container: {
    backgroundColor: "#393E41",
    flex: 1,
  },
  headerBar: {
    padding: 12,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  buttonPrimary: {
    marginTop: 8,
    padding: 16,
    backgroundColor: "#F6F7EB",
    borderRadius: 8,
    alignItems: "center",
    fontFamily: "QuicksandReg",
    width: "100%",
  },
  primaryButtonText: {
    color: "#393E41",
    fontFamily: "QuicksandReg",
    fontSize: 16,
  },
});
