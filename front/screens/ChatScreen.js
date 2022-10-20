import React, { useEffect, useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { ListItem, Button } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";

import { connect } from "react-redux";
import socketIOClient from "socket.io-client";
var socket = socketIOClient("https://localhost:3000/");
// var myRegex = /pattern/options;
import AsyncStorage from "@react-native-async-storage/async-storage";

function ChatScreen(props) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [listMessage, setListMessage] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    socket.on("messageFromBack", (message) => {
      let messageToEmoji = message.message;
      messageToEmoji = messageToEmoji.replace(/:\)/g, "\u263A");
      messageToEmoji = messageToEmoji.replace(/:\(/g, "\u2639");
      messageToEmoji = messageToEmoji.replace(/:p/g, "\uD83D\uDE1B");
      messageToEmoji = messageToEmoji.replace(
        /fuck[a-z]*/i,
        "\u2022\u2022\u2022"
      );
      setListMessage([
        ...listMessage,
        { message: messageToEmoji, username: message.username },
      ]);
      setCurrentMessage("");
      setMounted(true);
    });
  }, [listMessage]);

  function logout() {
    AsyncStorage.clear();
    props.navigation.navigate("HomeScreen");
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.logout}>
        <Button
          buttonStyle={{
            height: 40,
            width: 80,
            borderRadius: 100,
            marginVertical: 10,
            marginHorizontal: 5,
            backgroundColor: "#8C8C8C",
          }}
          title="logout"
          titleStyle={{ fontSize: 12 }}
          onPress={() => logout()}
        />
      </View>
      <ScrollView>
        {listMessage.map((element, i) => (
          <ListItem key={i} bottomDivider>
            <ListItem.Content>
              <ListItem.Title>{element.message}</ListItem.Title>
              <ListItem.Subtitle>{element.username}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        ))}
      </ScrollView>

      <TextInput
        style={styles.TextInput}
        placeholder="What do you want to tell them ?"
        onChangeText={(value) => setCurrentMessage(value)}
        value={currentMessage}
      ></TextInput>

      <Button
        icon={<Icon name="envelope" size={24} color="#000000" />}
        buttonStyle={{backgroundColor: "#F3D292"}}
        title="send"
        titleStyle={{ color: "#2d3436", paddingHorizontal: 20 }}
        onPress={() =>
          socket.emit("sendMessage", {
            message: currentMessage,
            username: props.userInfo.name,
          })
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  logout: {
    alignItems: "flex-end",
    // backgroundColor: "#DEFFE7",
  },
  TextInput: {
    margin: 5,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonView: {
    width: "100%",
    alignItems: "center",
    // backgroundColor: "#DEFFE7",
  },
});

function mapStateToProps(state) {
  return { userInfo: state.username };
}

export default connect(mapStateToProps, null)(ChatScreen);
