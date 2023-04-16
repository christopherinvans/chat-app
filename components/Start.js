import React from "react";
import {
  View,
  Alert,
  Text,
  Button,
  TextInput,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { auth } from "../firebase";
import { signInAnonymously } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

const backgroundColors = {
  black: { backgroundColor: "#000000" },
  grey: { backgroundColor: "#8a95a5" },
  purple: { backgroundColor: "#474056" },
  green: { backgroundColor: "#94ae89" },
};

export default function Start() {
  const [username, setUsername] = React.useState("");
  const [color, setColor] = React.useState("");

  const navigation = useNavigation();

  const signInUser = () => {
    signInAnonymously(auth)
      .then((user) => {
        navigation.navigate("Chat", {
          color: color,
          user: {
            uid: user.user.uid,
            username: username,
            isAnonymous: user.user.isAnonymous,
          },
        });
      })
      .catch((err) => {
        Alert.alert("Error", "Unable to signin anonymously");
        console.log(err);
      });
  };

  const { black, grey, purple, green } = backgroundColors;
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/background-image.png")}
        style={[styles.container, styles.image]}
      >
        <Text style={styles.title}>Chat App</Text>

        <View style={styles.inputBox}>
          <TextInput
            style={styles.nameBox}
            onChangeText={(name) => setUsername(name)}
            value={username}
            placeholder="Enter your Name"
          />

          <View>
            <Text style={styles.colorSelector}>Choose your Background:</Text>
            <View style={styles.colorWrapper}>
              <TouchableOpacity
                style={[
                  styles.color,
                  black,
                  color === black.backgroundColor ? styles.colorSelected : {},
                ]}
                onPress={() => setColor(black.backgroundColor)}
              />

              <TouchableOpacity
                style={[
                  styles.color,
                  grey,
                  color === grey.backgroundColor ? styles.colorSelected : {},
                ]}
                onPress={() => setColor(grey.backgroundColor)}
              />

              <TouchableOpacity
                style={[
                  styles.color,
                  purple,
                  color === purple.backgroundColor ? styles.colorSelected : {},
                ]}
                onPress={() => setColor(purple.backgroundColor)}
              />

              <TouchableOpacity
                style={[
                  styles.color,
                  green,
                  color === green.backgroundColor ? styles.colorSelected : {},
                ]}
                onPress={() => setColor(green.backgroundColor)}
              />
            </View>
          </View>
          <TouchableOpacity
            style={[styles.nameBox, styles.chatBox]}
            onPress={signInUser}
          >
            <Text style={[styles.colorSelector, styles.chatBoxText]}>
              Start Chatting
            </Text>
          </TouchableOpacity>
          {Platform.OS === "ios" ? (
            <KeyboardAvoidingView behavior="padding" />
          ) : null}
        </View>
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
        {Platform.OS === "ios" ? (
          <KeyboardAvoidingView behavior="padding" />
        ) : null}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  image: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    color: "#fff",
    fontSize: 50,
    fontWeight: "600",
    marginTop: 60,
  },

  inputBox: {
    backgroundColor: "#fff",
    marginBottom: 15,
    height: "44%",
    width: "88%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
  },

  nameBox: {
    height: 50,
    width: "88%",
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 2,
    color: "#757083",
    opacity: 50,
    fontSize: 16,
    fontWeight: "300",
    paddingLeft: 10,
  },

  colorSelector: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    opacity: 100,
  },

  colorWrapper: {
    flexDirection: "row",
  },

  color: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 10,
  },

  chatBox: {
    backgroundColor: "#757083",
    justifyContent: "center",
  },

  chatBoxText: {
    color: "#fff",
    fontWeight: "300",
  },

  colorSelected: {
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "#5f5f5f",
  },
});
