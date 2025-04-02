import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import getEnvVars from "../config";
const { API_URL } = getEnvVars();
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Register() {
  const [readerTag, setReaderTag] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (email: string) => {
    setEmail(email);
    if (!validateEmail(email)) {
      setEmailError("Invalid email address");
    } else {
      setEmailError("");
    }
  };

  const register = async () => {
    setReaderTag(readerTag.trim());
    setEmail(email.trim());
    setPassword(password.trim());
    setConfirmPassword(confirmPassword.trim());

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ readerTag, email, confirmPassword, password }),
      });
      const result = await response.json();
      if (result.error) setRegisterError(result.error);
      if (result.error == "Passwords do not match")
        setPasswordError(result.error);

      if (!response.ok) {
        throw new Error(result.error || "Failed to register");
      }

      console.log(result, "RESULT");
      await AsyncStorage.setItem("token", result.token);
      await AsyncStorage.setItem("userId", result.userId);
      await AsyncStorage.setItem("readerTag", result.readerTag);

      router.push("/feed");
    } catch (error: any) {
      console.log("Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoBook}>
        <View style={styles.logoTitle}></View>
      </View>
      <View style={styles.titleTaglineContainer}>
        <Text style={styles.header}>Sumi</Text>
        <Text style={styles.tagline}>Just One More Chapter</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.formLabel}>ReaderTag</Text>
        <TextInput
          style={styles.formInput}
          onChangeText={setReaderTag}
        ></TextInput>
        <Text style={styles.formLabel}>Email</Text>
        <TextInput
          style={[styles.formInput, emailError ? styles.errorInput : null]}
          keyboardType="email-address"
          onChangeText={handleEmailChange}
        ></TextInput>
        <Text style={styles.formLabel}>Create Password</Text>
        <TextInput
          secureTextEntry={true}
          onChangeText={setPassword}
          style={[styles.formInput, passwordError ? styles.errorInput : null]}
        ></TextInput>
        <Text style={styles.formLabel}>Confirm Password</Text>
        <TextInput
          secureTextEntry={true}
          onChangeText={setConfirmPassword}
          style={[styles.formInput, passwordError ? styles.errorInput : null]}
        ></TextInput>
        <TouchableOpacity style={styles.buttonPrimary} onPress={register}>
          <Text style={styles.primaryButtonText}>Register</Text>
        </TouchableOpacity>
        <Link href="/" asChild>
          <TouchableOpacity style={styles.buttonSecondary} onPress={() => {}}>
            <Text style={styles.secondaryButtonText}>Back to Sign In</Text>
          </TouchableOpacity>
        </Link>
        {registerError ? (
          <Text style={styles.errorText}>{registerError}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#393E41",
    width: "100%",
  },
  logoBook: {
    width: 50,
    height: 73,
    padding: 5,
    backgroundColor: "#F6F7EB",
    borderRadius: 2,
  },
  logoTitle: {
    width: 12,
    height: 30,
    borderRadius: 2,
    backgroundColor: "#393E41",
  },
  titleTaglineContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  header: {
    fontSize: 36,
    fontFamily: "GoudyBookletter",
    color: "#F6F7EB",
  },
  tagline: {
    fontSize: 18,
    fontFamily: "QuicksandReg",
    color: "#F6F7EB",
  },
  form: {
    width: "90%",
    maxWidth: 368,
  },
  formLabel: {
    fontSize: 16,
    fontFamily: "QuicksandReg",
    color: "#F6F7EB",
  },
  formInput: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 16,
    fontFamily: "QuicksandReg",
    color: "#F6F7EB",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F6F7EB",
    padding: 12,
    backgroundColor: "transparent",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 12,
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
  buttonSecondary: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#F6F7EB",
    color: "#F6F7EB",
    borderRadius: 8,
    alignItems: "center",
    fontFamily: "QuicksandReg",
    width: "100%",
  },
  secondaryButtonText: {
    color: "#F6F7EB",
    fontFamily: "QuicksandReg",
    fontSize: 16,
  },
  errorText: {
    color: "#FE7F2D",
    marginTop: 12,
    fontSize: 16,
    fontFamily: "QuicksandReg",
    alignSelf: "center",
  },
  errorInput: {
    borderColor: "#FE7F2D",
  },
});
