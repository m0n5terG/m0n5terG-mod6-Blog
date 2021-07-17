import React, { useState, useEffect } from "react";
import { ActivityIndicator, TouchableOpacity, Text, View, Switch, Image } from "react-native";
import { commonStyles, lightStyles, darkStyles } from "../styles/commonStyles";
import axios from "axios";
import { API, API_WHOAMI } from "../constants/API";
import { logOutAction } from "../redux/ducks/blogAuth";
import { changeModeAction } from '../redux/ducks/accountPref';
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function AccountScreen({ navigation }) {

  const [username, setUsername] = useState(null);
  
  const token = useSelector((state) => state.auth.token);
  const isDark = useSelector((state) => state.accountPref.isDark);
  const dispatch = useDispatch();

  const styles = { ...commonStyles, ...isDark ? darkStyles : lightStyles };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={navigation.navigate("Camera")}>
          <MaterialCommunityIcons name="camera-wireless-outline" size={24} style={{ color: styles.headerTint, marginRight: 15 }} />
        </TouchableOpacity>
      ),
     
    });
  });


  async function getUsername() {
    console.log("---- Getting user name ----");
  //  const token = await AsyncStorage.getItem("token");
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
    dispatch(logOutAction())
    navigation.navigate("SignInSignUp");
  }

  function switchMode() {
    dispatch(changeModeAction())
    console.log(isDark)
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
        Welcome {username}
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate("Camera")}>
        <Text style={{ marginTop: 10, fontSize: 20, color: "#0000EE" }}> 
          No profile picture. Click to take one. 
        </Text>
      </TouchableOpacity>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", margin: 20}}>
        <Text style={[styles.content, styles.text]}> Dark Mode? </Text>
        <Switch
          value={isDark}
          onChange={switchMode}/>
      </View>
      <TouchableOpacity style={[styles.button]} onPress={signOut}>
        <Text style={styles.buttonText}>
          Sign Out
        </Text>
        </TouchableOpacity>
    </View>
  );
}
