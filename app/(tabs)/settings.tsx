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
import { getUserSession } from "../../supabase_queries/auth";
import supabase from "../../lib/supabase.js";
import { updateSubscriptionInterval } from "../../supabase_queries/profiles";

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
  const [interval, setInterval] = useState(0);

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

  useEffect(() => {
    const changeSubscriptionInterval = async () => {
      const user = await getUserSession();
      if (user) {
        await updateSubscriptionInterval(user.id, interval);
      }
    };
    changeSubscriptionInterval();
  }, [interval]);

  const Logout = async function () {
    await supabase.auth.signOut();
    router.push("/");
  };

  const updateReaderTag = async () => {
    const updateReaderTag = await updateUsername(readerTag);
    if (updateReaderTag) {
      console.log("ReaderTag updated successfully:", updateReaderTag);
      setReaderTagChangeSuccess("ReaderTag changed successfully");
    } else {
      setReaderTagChangeSuccess("");
    }
  };

  const changePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setPasswordChangeError("Passwords do not match");
      return;
    }
    const passwordUpdated = await updatePassword(newPassword);
    if (passwordUpdated) {
      setPasswordChangeSuccess("Password changed successfully");
      setPasswordChangeError("");
    } else {
      setPasswordChangeError("Error changing password");
      setPasswordChangeSuccess("");
    }
  };

  const intervals = [
    { label: "Every few days", value: 3 },
    { label: "Every week", value: 7 },
    { label: "Bi-weekly", value: 14 },
  ];

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
        <TouchableOpacity
          style={styles.changePasswordButton}
          onPress={changePassword}
        >
          <Text style={styles.changePasswordButtonText}>Change Password</Text>
        </TouchableOpacity>
        {passwordChangeError ? (
          <Text style={styles.errorPasswordText}>{passwordChangeError}</Text>
        ) : passwordChangeSuccess ? (
          <Text style={styles.successPasswordText}>
            {passwordChangeSuccess}
          </Text>
        ) : null}
        <Text style={styles.subscriptionFrequencyLabel}>
          Set Subscription Frequency
        </Text>
        <View style={styles.intervalDropdown}>
          {intervals.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.radioButtonContainer}
              onPress={() => setInterval(option.value)}
            >
              <View
                style={[
                  styles.radioButton,
                  interval === option.value && styles.radioButtonSelected,
                ]}
              />
              <Text style={styles.radioButtonLabel}>{option.label}</Text>
            </TouchableOpacity>
          ))}
          <Text style={styles.selectedText}>Selected: {interval}</Text>
        </View>
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
  changePasswordButton: {
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
  changePasswordButtonText: {
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
  intervalDropdown: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: 16,
    minHeight: 100,
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    minHeight: 20,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#F6F7EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioButtonSelected: {
    backgroundColor: "#F6F7EB",
  },
  radioButtonLabel: {
    fontSize: 16,
    color: "#F6F7EB",
    fontFamily: "QuicksandReg",
  },
  selectedText: {
    marginTop: 16,
    fontSize: 16,
    color: "#393E41",
  },
  subscriptionFrequencyLabel: {
    fontSize: 16,
    fontFamily: "QuicksandReg",
    color: "#F6F7EB",
    marginBottom: 8,
  },
});
