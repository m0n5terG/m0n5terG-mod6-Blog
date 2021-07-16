import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AccountStack from '../components/AccountStack';
import BlogStack from './BlogStack';
import { FontAwesome5 } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function LoggedInStack() {

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    if (route.name === 'Blog') {
                        iconName = "blog"
                    } else if (route.name === 'Setting') {
                        iconName = "house-user"
                    }
                    return <FontAwesome5 name={iconName} size={size} color={color} />;
                }
            })}
            tabBarOptions={{
                activeTintColor: 'tomato',
                inactiveTintColor: 'gray',
                style: { backgroundColor: "white" }
            }}>
              <Tab.Screen name='Blog' component={BlogStack} />
              <Tab.Screen name='Setting' component={AccountStack} />
        </Tab.Navigator>       
    )
}