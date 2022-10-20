import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import MapView from "react-native-maps";
import { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";

import { connect } from "react-redux";
import socketIOClient from "socket.io-client";
var socket = socketIOClient("https://localhost:3000/");

function MapScreen(props) {
  const [currentLatitude, setCurrentLatitude] = useState(0);
  const [currentLongitude, setCurrentLongitude] = useState(0);
  const [usersList, setUsersList] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    async function requestPermissions() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        Location.watchPositionAsync({ distanceInterval: 2 }, (location) => {
          // setCurrentLatitude(location.coords.latitude);
          // setCurrentLongitude(location.coords.longitude);
          socket.emit("sendUserInfo", {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            username: props.userInfo.name,
            description: props.userInfo.desc,
          });
        });
      }
    }
    requestPermissions();
  }, []);

  // get all users location from sockets //
  useEffect(() => {
    socket.on("userInfoFromBack", (info) => {
      setUsersList([...usersList, info]);
    });
  }, []);

  let userMarkers = usersList.map(function (marker, i) {
    return (
      <Marker
        key={i}
        coordinate={{
          latitude: marker.latitude,
          longitude: marker.longitude,
        }}
        title={marker.username}
        // color of other users //
        pinColor="#F17978"
      >
        <Callout tooltip>
          <ScrollView style={styles.bubble}>
            <Text>{marker.description}</Text>
          </ScrollView>
        </Callout>
      </Marker>
    );
  });

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <MapView style={styles.map}>
        <Marker
          coordinate={{
            latitude: currentLatitude,
            longitude: currentLongitude,
          }}
          title={props.userInfo.name}
          // color of current user //
          pinColor="#46DDAD"
        >
          <Callout tooltip>
            <ScrollView style={styles.myBubble}>
              <Text>{props.userInfo.desc}</Text>
            </ScrollView>
          </Callout>
        </Marker>
        {userMarkers}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    height: 200,
    width: 250,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#FFBDBD",
    margin: 10,
    padding: 10,
    backgroundColor: "#FFFFFF",
  },
  myBubble: {
    height: 200,
    width: 250,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#000000",
    margin: 10,
    padding: 10,
    backgroundColor: "#FFFFFF",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  overlayMainView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DEFFE7",
  },
  overlayScrowllview: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#E27878",
  },
  inputsView: {
    width: "100%",
  },
});

function mapStateToProps(state) {
  return { poi: state.list, userInfo: state.username };
}

function mapDispatchToProps(dispatch) {
  return {
    addToList: function (listPOI) {
      dispatch({ type: "addToList", poiToAdd: listPOI });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
