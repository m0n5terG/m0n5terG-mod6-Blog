import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList, RefreshControl} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { FAB } from 'react-native-paper';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API, API_POSTS, } from "../constants/API";
import { commonStyles, lightStyles, darkStyles } from "../styles/commonStyles";
import { useSelector } from "react-redux";

export default function IndexScreen({ navigation, route }) {

  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const isDark = useSelector((state) => state.accountPref.isDark);
  const token = useSelector((state) => state.auth.token);
  
  const styles = { ...commonStyles, ...isDark ? darkStyles : lightStyles };

  // This is to set up the top right button
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={addPost}>
          <FontAwesome name="plus-square-o" size={30} style={{ color: styles.headerTint, marginRight: 15 }} />
        </TouchableOpacity>
      ),
    });
  });

  useEffect(() => {
    console.log("Setting up nav listener");
    // Check for when we come back to this screen
    const removeListener = navigation.addListener("focus", () => {
      console.log("Running nav listener");
      getPosts();
    });
    getPosts();
    return removeListener;
  }, []);

  async function getPosts() {
    //const token = await AsyncStorage.getItem("token");
    console.log(`Token is ${token}`);
    try {
      const response = await axios.get(API + API_POSTS, {
        headers: { Authorization: `JWT ${token}` },
      })
      console.log(response.data);
      setPosts(response.data);
      return "completed"
    } catch (error) {
      console.log(error.response.data);
      if (error.response.data.error = "Invalid token") {
        navigation.navigate("SignInSignUp");
      }
    }
  }

  function addPost() {
    navigation.navigate("Add")
  }

  async function deletePost(id) {
    
    //const token = await AsyncStorage.getItem("token");
    console.log("Deleting " + id);

    try {
      
      const response = await axios.delete(API + API_POSTS + `/${id}`, { 
        headers: { Authorization: `JWT ${token}` }, });

      console.log(response)
      setPosts(posts.filter((item) => item.id !== id));
     
    } catch (error) {
      console.log(error)
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    const response = await getPosts()
    console.log(response.data);
    setRefreshing(false);
  }


  // The function to render each row in our FlatList
  function renderItem({ item }) {
    return (
      <TouchableOpacity onPress={() => navigation.navigate("Details", {id: item.id})}>
        <View
          style={{
            padding: 10,
            paddingTop: 20,
            paddingBottom: 20,
            borderBottomColor: "#ccc",
            borderBottomWidth: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}>
          <Text style={styles.text}>{item.title}</Text>
          <TouchableOpacity onPress={() => deletePost(item.id)}>
            <FontAwesome name="trash" size={20} color="#a80000" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        style={{ width: "100%" }}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
      {/*<FAB
        style={styles.fab}
        small
        icon="plus"
        onPress={() => navigation.navigate("Post")} 
      />*/}
    </View>
  );
}

/*const styles = StyleSheet.create({
 
  fab: {
    height: 50,
    width: 50,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 50,
    right: 30
  },
})  */
