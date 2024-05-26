import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../home/Home';
import SelectDelete from '../delete/SelectDelete';

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
