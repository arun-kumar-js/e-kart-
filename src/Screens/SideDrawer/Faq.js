import React, { useState, useCallback } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import axios from "axios";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FAQ, API_ACCESS_KEY, API_BASE_URL } from "../../config/config";
import Header from "../../components/Header";

const Faq = () => {
  const navigation = useNavigation();
  console.log("Faq component mounted");
  const [faqItems, setFaqItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { width } = useWindowDimensions();

  const parseFaqHtml = (htmlContent) => {
    try {
      // Extract FAQ items using regex
      const faqRegex = /<h3[^>]*>([^<]+)<\/h3>\s*<p[^>]*>([^<]*)<\/p>/g;
      const items = [];
      let match;
      let counter = 1;

      while ((match = faqRegex.exec(htmlContent)) !== null) {
        const question = match[1].replace(/^\d+\.\s*/, ""); // Remove numbering
        const answer = match[2].trim();

        if (question && answer) {
          items.push({
            id: counter,
            question: question,
            answer: answer,
          });
          counter++;
        }
      }

      return items;
    } catch (error) {
      console.log("Error parsing FAQ HTML:", error);
      return [];
    }
  };

  const fetchFaq = async () => {
    console.log("Starting FAQ API fetch...");
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await axios.get(FAQ);
      console.log("API response raw:", response);

      if (response.status === 200 && response.data) {
        let htmlContent = response.data;
        htmlContent = htmlContent.replace(/<img[^>]*>/g, ""); // remove all images
        const parsedFaqs = parseFaqHtml(htmlContent);
        setFaqItems(parsedFaqs);
      } else {
        console.log("API returned empty content or error", response);
        setErrorMessage("API returned empty content or error");
      }
    } catch (error) {
      console.log("API fetch error:", error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
      console.log("API fetch finished");
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log("FAQ page focused, triggering API fetch...");
      fetchFaq();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="FAQ" showBack={false} />

      {loading ? (
        <ActivityIndicator size="large" color="#EE2737" />
      ) : errorMessage ? (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </ScrollView>
      ) : (
        <ScrollView style={styles.scrollView}>
          {/* Intro Section */}
          <View style={styles.introSection}>
            <Text style={styles.introText}>Quick answers to your queries</Text>
          </View>

          {/* FAQ Content */}
          <View style={styles.faqContainer}>
            <Text style={styles.faqHeading}># FAQs</Text>
            {faqItems.map((item) => (
              <View key={item.id} style={styles.faqCard}>
                <Text style={styles.questionText}>
                  {item.id}. {item.question}
                </Text>
                <Text style={styles.answerText}>{item.answer}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  scrollView: {
    flex: 1,
  },
  introSection: {
    backgroundColor: "#2C2C2C",
    padding: 20,
    marginBottom: 0,
  },
  introText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 24,
  },
  faqContainer: {
    backgroundColor: "#F5F5F5",
    padding: 20,
    flex: 1,
  },
  faqHeading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#014C8D",
    marginBottom: 20,
    fontFamily: "Poppins",
  },
  faqCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  questionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f47c2e",
    marginBottom: 8,
    fontFamily: "Poppins",
  },
  answerText: {
    fontSize: 14,
    color: "#000",
    textTransform: "uppercase",
    fontFamily: "Poppins",
    lineHeight: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#000",
    fontFamily: "Poppins",
  },
});

export default Faq;
