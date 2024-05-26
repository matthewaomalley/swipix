import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Navigation from './src/config/Navigation';
import * as NavigationBar from 'expo-navigation-bar';

export default function App() {
  useEffect(() => {
    NavigationBar.setBackgroundColorAsync('black');
  }, []);

  return (
    <View style={styles.container}>
      <Navigation />
      <StatusBar style="light" backgroundColor='black'/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
