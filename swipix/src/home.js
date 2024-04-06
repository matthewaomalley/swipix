// src/Home.js
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Delete Screen"
        onPress={() => navigation.navigate('delete')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
