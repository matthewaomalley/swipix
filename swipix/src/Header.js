import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Import the icon component

const Header = ({ title, leftComponent, rightComponent, count }) => {
  return (
    <SafeAreaView style={[styles.safeArea, {
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.button}>
          <MaterialIcons name="delete" size={24} color="white" />
          <Text style={styles.countText}>{count}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity style={styles.textButton}>
          <Text style={styles.buttonText}>Album dropdown</Text>{rightComponent}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
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
