// Navigation.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './home'; // Make sure to match the filename case
import SelectDelete from './SelectDelete';

const Stack = createNativeStackNavigator();

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
          component={Home}
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
