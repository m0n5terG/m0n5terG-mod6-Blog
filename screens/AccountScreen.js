import React, { useState, useEffect } from "react";
import { ActivityIndicator, TouchableOpacity, Text, View, Switch, Animated, TouchableWithoutFeedback } from "react-native";
import { commonStyles, lightStyles } from "../styles/commonStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from "axios";
import { API, API_WHOAMI } from "../constants/API";

export default function AccountScreen({ navigation }) {

  const [username, setUsername] = useState(null);

  const styles = { ...commonStyles, ...lightStyles };
/*
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={navigation.navigate("Camera")}>
          <MaterialCommunityIcons name="camera-wireless-outline" size={24} style={{ color: styles.headerTint, marginRight: 15 }} />
        </TouchableOpacity>
      ),
      headerLeft: () => {
        <TouchableOpacity onPress={addPost}>
          <FontAwesome name="plus-square-o" size={30} style={{ color: styles.headerTint, marginRight: 15 }} />
        </TouchableOpacity>
      }
    });
  });
*/
  async function getUsername() {
    console.log("---- Getting user name ----");
    const token = await AsyncStorage.getItem("token");
    console.log(`Token is ${token}`);
    try {
      const response = await axios.get(API + API_WHOAMI, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log("Got user name!");
      setUsername(response.data.username);
    } catch (error) {
      console.log("Error getting user name");
      if (error.response) {
        console.log(error.response.data);
        if (error.response.data.status_code === 401) {
          signOut();
          navigation.navigate("SignInSignUp")
        }
      } else {
        console.log(error);
      }
      // We should probably go back to the login screen???
    }
  }

  function signOut() {
    AsyncStorage.removeItem("token");
    navigation.navigate("SignInSignUp");
  }

  useEffect(() => {
    console.log("Setting up nav listener");
    // Check for when we come back to this screen
    const removeListener = navigation.addListener("focus", () => {
      console.log("Running nav listener");
      setUsername(<ActivityIndicator />);
      getUsername();
    });
    getUsername();
    return removeListener;
  }, []);

  return (
    <View style={[styles.container, { alignItems: "center" }]}>
      <Text style={{marginTop: 20}}>
        Account Screen
      </Text>
      <Text>
        {username}
      </Text>
    </View>
  );
}
