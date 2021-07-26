import React, { useState, useEffect } from "react";
import { ActivityIndicator, TouchableOpacity, Text, View, Switch, Animated, TouchableWithoutFeedback } from "react-native";
import { commonStyles, lightStyles, darkStyles } from "../styles/commonStyles";
import axios from "axios";
import { API, API_WHOAMI } from "../constants/API";
import { logOutAction } from "../redux/ducks/blogAuth";
import { changeModeAction, deletePicAction } from '../redux/ducks/accountPref';
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function AccountScreen({ navigation }) {

  const [username, setUsername] = useState(null);
  
  const token = useSelector((state) => state.auth.token);
  const isDark = useSelector((state) => state.accountPref.isDark);
  const profilePicture = useSelector((state) => state.accountPref.profilePicture);
  const dispatch = useDispatch();

  const styles = { ...commonStyles, ...isDark ? darkStyles : lightStyles };

  const picSize = new Animated.Value(0);
  const sizeInterpolation = {
    inputRange: [0, 0.5, 1],
    outputRange: [200, 300, 200]
  }  

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={signOut}>
          <MaterialCommunityIcons name="logout" size={30} style={{ color: styles.headerTint, marginRight: 15 }} />
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

  function changePicSize() {
    Animated.loop(
      Animated.timing(picSize, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: false
      }),
    ).start()
  }

  function deletePhoto() {
    dispatch(deletePicAction())
    navigation.navigate("Camera")
  }

  useEffect(() => {
    console.log("Setting up nav listener");
    // Check for when we come back to this screen
    const removeListener = navigation.addListener("focus", () => {
      console.log("Running nav listener");
      setUsername(<ActivityIndicator color="#0000ff" />);
      getUsername();
    });
    getUsername();
    return removeListener;
  }, []);

  return (
    <View style={[styles.container, { alignItems: "center" }]}>
      <Text style={[styles.title, styles.text, { margin: 30 }]}>Welcome</Text>
      <Text style={[styles.title, styles.text, { margin: 5 }]}> {username} </Text>
      <View style={{height: profilePicture == null ? 0 : 320, justifyContent: "center"}}>
        {profilePicture == null ? <View /> :
          <TouchableWithoutFeedback onPress={changePicSize}>
            <Animated.Image
              style={{
                width: picSize.interpolate(sizeInterpolation),
                height: picSize.interpolate(sizeInterpolation),
                borderRadius: 200
              }}
              source={{ uri: profilePicture?.uri }} />
          </TouchableWithoutFeedback>}
      </View>
        <TouchableOpacity onPress={() => profilePicture == null ? navigation.navigate("Camera") : deletePhoto()}>
          <Text style={{ marginTop: 10, fontSize: 20, color: "#0000EE" }}>
            { profilePicture == null ? "No profile picture. Click to take one." : "Delete this photo and take another one."} 
          </Text>
        </TouchableOpacity>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", margin: 20}}>
        <Text style={[styles.content, styles.text]}> Dark Mode? </Text>
        <Switch
          value={isDark}
          onChange={switchMode}/>
      </View>
    </View>
  );
}
