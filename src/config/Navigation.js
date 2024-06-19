import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../home/Home';
import SelectDelete from '../delete/SelectDelete';
import Recover from '../delete/Recover';
import Done from '../delete/Done.js';

const Stack = createNativeStackNavigator();

function HomeScreenWrapper(props) {
  return (
    <View style={{ flex: 1 }}>
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
        <Stack.Screen
          name="Recover"
          component={Recover}
        />
        <Stack.Screen
          name="Done"
          component={Done}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
