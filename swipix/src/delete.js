import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

function Delete({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Delete Screen</Text>
      <Button
        title="Go to Home Screen"
        onPress={() => navigation.navigate('home')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Delete;
