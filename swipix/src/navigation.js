import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './home';
import Header from './Header';

const Stack = createNativeStackNavigator();

function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={({ navigation, route }) => ({
            headerTitle: () => <Header title={route.name} />,
            // Add other header options as needed
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
