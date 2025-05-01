import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  updatePassword,
  updateUsername,
} from "../../supabase_queries/settings";
import { getUsername } from "../../supabase_queries/settings";
import supabase from "../../lib/supabase.js";

export default function Settings() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [readerTag, setReaderTag] = useState("");
  const [loading, setLoading] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordChangeError, setPasswordChangeError] = useState("");
  const [readerTagChangeSuccess, setReaderTagChangeSuccess] = useState("");
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      const username = await getUsername();
      if (username !== null) {
        setUsername(username);
      }
    };
    if (loading) {
      fetchUsername();
      setLoading(false);
    }
  }, []);

  const Logout = async function () {
    await supabase.auth.signOut();
    router.push("/");
  };

  const updateReaderTag = async () => {
    try {
      const updateReaderTag = await updateUsername(readerTag);
      if (updateReaderTag) {
        console.log("ReaderTag updated successfully:", updateReaderTag);
        setReaderTagChangeSuccess("ReaderTag changed successfully");
      } else {
        setReaderTagChangeSuccess("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const changePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setPasswordChangeError("Passwords do not match");
      return;
    }
    try {
      const passwordUpdated = await updatePassword(newPassword);
      if (passwordUpdated) {
        setPasswordChangeSuccess("Password changed successfully");
        setPasswordChangeError("");
      } else {
        setPasswordChangeError("Error changing password");
        setPasswordChangeSuccess("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.settingsWrapper}>
      <View style={styles.form}>
        <Text style={styles.formLabel}>Change ReaderTag</Text>
        <TextInput
          defaultValue={username}
          style={[
            styles.formInput,
            readerTagChangeSuccess ? styles.successInput : null,
          ]}
          onChangeText={setReaderTag}
        ></TextInput>
        <TouchableOpacity
          style={styles.changeReaderTagButton}
          onPress={updateReaderTag}
        >
          <Text style={styles.changeReaderTagButtonText}>Change ReaderTag</Text>
        </TouchableOpacity>
        {readerTagChangeSuccess ? (
          <Text style={styles.successText}>{readerTagChangeSuccess}</Text>
        ) : null}
        <Text style={styles.formLabel}>Change Password</Text>
        <TextInput
          secureTextEntry={true}
          style={[
            styles.formInput,
            passwordChangeError
              ? styles.errorInput
              : passwordChangeSuccess
              ? styles.successInput
              : null,
          ]}
          onChangeText={setNewPassword}
        ></TextInput>
        <Text style={styles.formLabel}>Confirm New Password</Text>
        <TextInput
          secureTextEntry={true}
          style={[
            styles.formInput,
            passwordChangeError
              ? styles.errorInput
              : passwordChangeSuccess
              ? styles.successInput
              : null,
          ]}
          onChangeText={setConfirmNewPassword}
        ></TextInput>
        <TouchableOpacity style={styles.buttonPrimary} onPress={changePassword}>
          <Text style={styles.primaryButtonText}>Change Password</Text>
        </TouchableOpacity>
        {passwordChangeError ? (
          <Text style={styles.errorPasswordText}>{passwordChangeError}</Text>
        ) : passwordChangeSuccess ? (
          <Text style={styles.successPasswordText}>
            {passwordChangeSuccess}
          </Text>
        ) : null}
        <TouchableOpacity style={styles.buttonPrimary} onPress={Logout}>
          <Text style={styles.primaryButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  settingsWrapper: {
    flex: 1,
    backgroundColor: "#393E41",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  headerBar: {
    marginTop: 16,
    padding: 12,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
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
    marginTop: 8,
    fontSize: 16,
    fontFamily: "QuicksandReg",
    color: "#F6F7EB",
  },
  formInput: {
    marginTop: 8,
    fontSize: 16,
    fontFamily: "QuicksandReg",
    color: "#F6F7EB",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F6F7EB",
    padding: 12,
    backgroundColor: "transparent",
  },
  signIn: {
    marginTop: 14,
    backgroundColor: "#F6F7EB",
    borderRadius: 8,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 16,
  },
  buttonPrimary: {
    paddingVertical: 16,
    backgroundColor: "#F6F7EB",
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
    marginTop: 16,
  },
  changeReaderTagButton: {
    paddingVertical: 16,
    backgroundColor: "#F6F7EB",
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginBottom: 12,
    marginTop: 16,
  },
  buttonLogout: {
    paddingVertical: 16,
    color: "#F6F7EB",
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    backgroundColor: "#8980F5",
  },
  primaryButtonText: {
    color: "#393E41",
    fontFamily: "QuicksandReg",
    fontSize: 16,
  },
  changeReaderTagButtonText: {
    color: "#393E41",
    fontFamily: "QuicksandReg",
    fontSize: 16,
  },
  buttonSecondary: {
    paddingVertical: 16,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#F6F7EB",
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  secondaryButtonText: {
    color: "#F6F7EB",
    fontFamily: "QuicksandReg",
    fontSize: 16,
  },
  errorText: {
    color: "#FE7F2D",
    fontSize: 16,
    fontFamily: "QuicksandReg",
    alignSelf: "center",
  },
  errorPasswordText: {
    color: "#FE7F2D",
    fontSize: 16,
    fontFamily: "QuicksandReg",
    alignSelf: "center",
    marginBottom: 12,
  },
  errorInput: {
    borderColor: "#FE7F2D",
  },
  successInput: {
    borderColor: "#77966D",
  },
  successText: {
    color: "#77966D",
    fontSize: 16,
    fontFamily: "QuicksandReg",
    alignSelf: "center",
  },
  successPasswordText: {
    color: "#77966D",
    fontSize: 16,
    fontFamily: "QuicksandReg",
    alignSelf: "center",
    marginBottom: 12,
  },
});
