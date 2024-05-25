import React from 'react';
import { View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './home'; // Make sure to match the filename case
import SelectDelete from './SelectDelete';

const Stack = createNativeStackNavigator();

function HomeScreenWrapper(props) {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <Home {...props} />
    </View>
  );
}

function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreenWrapper}
        />
        <Stack.Screen
          name="Delete"
          component={SelectDelete}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
