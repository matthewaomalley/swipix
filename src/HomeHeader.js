// Header.js
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const Header = ({ onNavigate, count }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.button}
          onPress={onNavigate}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons name="delete" size={24} color="white" />
          <Text style={styles.countText}>{count}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.textButton}>
          <Text style={styles.buttonText}>Album dropdown</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#f8f8f8',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    color: 'black',
    fontSize: 20,
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    width: 80,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#ed6135',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    marginLeft: 10,
  },
  countText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8
  }
});

export default Header;
