import React, { useEffect, useState } from "react";
import { Input, Button } from "react-native-elements";
import {StyleSheet, ImageBackground, View, Text, TextInput} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/FontAwesome';

import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import socketIOClient from "socket.io-client";
var socket = socketIOClient("https://localhost:3000/");

function HomeScreen(props) {

  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [login, setLogin] = useState(false);

  useEffect(() => {
        AsyncStorage.getItem("user", function (error, data) {
          console.log("data: ", data);
          if (data != null) {
            setUsername(data);
            setLogin(true);
          }
        });
  }, []);

  function goToHome() {
    if (username.length > 3 && description.length < 300) {
      AsyncStorage.setItem("user", username);
      props.getUserInfo({name: username, desc: description });
      props.navigation.navigate("AppCore", { screen: "MapScreen" });
      setUsername("");
      setUsernameError("");
      setDescriptionError("");
    } else if (username.length < 3 && description.length > 300) {
      setUsernameError("your username should at lease be 3 characters long");
      setDescriptionError(
        "your description should not be longer than 300 characters"
      );
    } else if (username.length < 3) {
      setUsernameError("your username should at lease be 3 characters long");
    } else if (description.length > 300) {
      setDescriptionError(
        "your description should not be longer than 300 characters"
      );
    }
  }

  let joinView;
  let loggedInView;
  if (login === false) {
    joinView = (
      <>
        <View style={styles.mainView}>
          <View style={styles.usernameInputView}>
            <Input
              placeholder="username"
              containerStyle={{
                width: 250,
              }}
              leftIcon={
                <Icon
                  name='user'
                  size={24}
                  color="#eb4d4b"
                />
              }
              onChangeText={(value) => setUsername(value)}
              value={username}
            ></Input>
            <Text>{usernameError}</Text>
          </View>

          <View style={styles.inputView}>
            <TextInput
              placeholder="feel free to describe yourself"
              placeholderTextColor="#8C8C8C"
              multiline={true}
              onChangeText={(value) => setDescription(value)}
              value={description}
              style={styles.description}
            ></TextInput>
            <Text>{descriptionError}</Text>
          </View>

          <Button
            title="here we go"
            titleStyle={{ color: "#2d3436" }}
            buttonStyle={{
              backgroundColor: "#FFFFFF",
              borderRadius: 30,
              borderWidth: 1,
              borderColor: "#000000",
              width: 200,
            }}
            onPress={() => goToHome(username, description)}
          />
        </View>
      </>
    );
  } else if (login === true) {
    loggedInView = (
      <>
        <Text style={styles.welcome}> Welcome {username}</Text>
        <Button
          buttonStyle={{
            backgroundColor: "#FFFFFF",
            borderColor: "#000000",
            borderWidth: 1,
            borderRadius: 30,
            marginTop: 400,
            width: 150,
          }}
          title="enter"
          titleStyle={{
            color: "#000000",
          }}
          onPress={() => goToHome()}
        />
      </>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/frame.png")}
      resizeMode="cover"
      style={styles.imageBackground}
    >
      {joinView}
      {loggedInView}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainView: {
    justifyContent: "space-around",
    alignItems: "center",
    // backgroundColor: "#DEFFE7",
  },
  welcome: {
    fontSize: 30,
  },
  usernameInputView: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    // backgroundColor: "#FFBDBD",
  },
  inputView: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 100,
    // backgroundColor: "#FFFCBE",
  },
  description: {
    width: 250,
    height: 200,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#C4C4C4",
    backgroundColor: "#FFFFFF",
  },
});

function mapDispatchToProps(dispatch) {
  return {
    getUserInfo: function (info) {
      dispatch({
        type: "user",
        userInfo: info,
      });
    },
  };
}

export default connect(null, mapDispatchToProps)(HomeScreen);