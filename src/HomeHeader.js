import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform, StatusBar, Animated, FlatList, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const HomeHeader = ({ onNavigate, count, visible, albums, onAlbumSelect, selectedAlbum }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const renderAlbumItem = ({ item }) => (
    <TouchableOpacity
      style={styles.albumItem}
      onPress={() => {
        if (selectedAlbum && selectedAlbum.id === item.id) {
          setShowDropdown(false); // Close the dropdown if the selected album is the same as the current album
        } else {
          setShowDropdown(false);
          onAlbumSelect(item);
        }
      }}
    >
      <Text style={styles.albumText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[
        styles.header,
        {
          opacity: visible ? 1 : 0,
          backgroundColor: visible ? 'rgba(0, 0, 0, 0.4)' : 'transparent',
        },
      ]}>
        <View style={styles.trashButtonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: visible ? '#ed6135' : 'gray',
              },
            ]}
            onPress={onNavigate}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="delete" size={24} color="white" />
            <Text style={styles.countText}>{count}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ opacity: visible ? 1 : 0 }}>
          <TouchableOpacity style={styles.textButton} onPress={() => setShowDropdown(!showDropdown)}>
            <Text style={styles.buttonText}>
              {selectedAlbum ? selectedAlbum.title : 'Recent'}
            </Text>
          </TouchableOpacity>
          {showDropdown && (
            <Modal
              transparent={true}
              animationType="fade"
              visible={showDropdown}
              onRequestClose={() => setShowDropdown(false)}
            >
              <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowDropdown(false)}>
                <View style={styles.dropdownContainer}>
                  <FlatList
                    data={albums}
                    renderItem={renderAlbumItem}
                    keyExtractor={(item) => item.id}
                  />
                </View>
              </TouchableOpacity>
            </Modal>
          )}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'transparent',
    width: '100%',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  trashButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    width: 80,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: {
    marginLeft: 10,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  countText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
  albumItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  albumText: {
    fontSize: 16,
  },
});

export default HomeHeader;
