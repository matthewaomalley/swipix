// HomeFooter.js
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';

const HomeFooter = ({ onSwipe, visible }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onSwipe('left')}
          disabled={!visible}  // Disable the button when the footer is not visible
        >
          <Text style={styles.buttonText}>DELETE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onSwipe('right')}
          disabled={!visible}  // Disable the button when the footer is not visible
        >
          <Text style={styles.buttonText}>KEEP</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Add styles if not already defined
const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'transparent',
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 5,
  },
  button: {
    flex: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
});

export default HomeFooter;
