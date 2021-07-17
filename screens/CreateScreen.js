import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import axios from "axios";
import { API, API_CREATE } from "../constants/API";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightStyles, commonStyles, darkStyles } from "../styles/commonStyles";
import { useSelector } from "react-redux";

export default function CreateScreen({ navigation }) {

  const token = useSelector((state) => state.auth);
  const isDark = useSelector((state) => state.accountPref.isDark);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errorText, setErrorText] = useState("");

  const styles = { ...commonStyles, ...isDark ? darkStyles : lightStyles };

  async function savePost() { 
    console.log("--- Post ---")
    const post = {
      "title": title,
      "content": content,
    }

    if (title == "" || content == "") {
      setErrorText("Input cannot be blank");
    }
    else {
      console.log(token);
      //const token = await AsyncStorage.getItem("token");
        try {
          const response = await axios.post(API + API_CREATE, post,
            {
            headers: { Authorization: `JWT ${token}` },
            }
          );
          console.log("Post success!");
          console.log(response.data);
 
          navigation.navigate('Index', { post: post });
      } 
      catch (error) {
        console.log(error.response);
        setErrorText(error.response.data.content);
      }
    }
  }


  return (
    <View style={styles.container}>
      <View style={{ margin: 20 }}>
        <Text style={[additionalStyles.label, styles.text]}>Enter Title:</Text>
        <TextInput
          style={additionalStyles.input}
          value={title}
          onChangeText={text => setTitle(text)}
        />
        <Text style={[additionalStyles.label, styles.text]}>Enter Content:</Text>
        <TextInput
          style={additionalStyles.input}
          value={content}
          onChangeText={text => setContent(text)}
        />
      <TouchableOpacity style={[styles.button, {marginTop: 20}]} onPress={savePost}>
        <Text style={styles.buttonText}>
          Save
        </Text>
        </TouchableOpacity>
        <Text style={styles.errorText}>{errorText}</Text>
      </View>
    </View>
  )
}

const additionalStyles = StyleSheet.create({
  input: {
    fontSize: 24,
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 15,
  },
  label: {
    fontSize: 28,
    marginBottom: 10,
    marginLeft: 5
  },
  errorText: {
    marginTop: 20,
    color: "red",
    alignSelf: "center",
    marginTop: 20
  },
});