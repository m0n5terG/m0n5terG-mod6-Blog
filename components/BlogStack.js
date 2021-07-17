import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import IndexScreen from '../screens/IndexScreen';
import CreateScreen from '../screens/CreateScreen';
import EditScreen from '../screens/EditScreen';
import ShowScreen from '../screens/DetailsScreen';
import { commonStyles, lightStyles, darkStyles } from '../styles/commonStyles';
import { useSelector } from 'react-redux';

const InnerStack = createStackNavigator();

export default function BlogStack() {

  const isDark = useSelector((state) => state.accountPref.isDark);
  const styles = { ...commonStyles, ...isDark ? darkStyles : lightStyles };
  
  const headerOptions = {
    headerStyle: styles.header,
    headerTitleStyle: styles.headerTitle,
    headerTintColor: styles.headerTint
  }

  return (
    <InnerStack.Navigator mode='modal'>
      <InnerStack.Screen name="Index" component={IndexScreen} options={{ title: "Blog", ...headerOptions, }} />
      <InnerStack.Screen name="Add" component={CreateScreen} options={{ title: "Add Post", ...headerOptions }} />
      <InnerStack.Screen name="Details" component={ShowScreen} options={headerOptions} />
      <InnerStack.Screen name="Edit" component={EditScreen} options={{ title: "Edit Post", ...headerOptions }} />
    </InnerStack.Navigator>
  )
}