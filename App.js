import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider, useSelector } from "react-redux";
import store from "./redux/configureStore";
import SignInSignUpScreen from "./screens/SignInSignUpScreen";
import LoggedInStack from "./components/LoggedInStack";

const Stack = createStackNavigator();

function App() {
  
  const token = useSelector((state) => state.auth.token);

  return (
    <NavigationContainer>
      <Stack.Navigator
        mode="modal"
        headerMode="none"
        initialRouteName={token != null ? "Logged In" : "SignInSignUp"}
        animationEnabled={false}>
        <Stack.Screen component={SignInSignUpScreen} name="SignInSignUp" />
        <Stack.Screen component={LoggedInStack} name="Logged In" /> 
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default function AppWrapper() {
  return (
    <Provider store={store}>
      <App/>
    </Provider>
  )
}
