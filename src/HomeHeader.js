import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const Header = ({ onNavigate, count }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="transparent" translucent={true} />
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'transparent', // Ensure this is also transparent
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
    backgroundColor: '#ed6135', // This will not be transparent
    justifyContent: 'center',
    alignItems: 'center',
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
