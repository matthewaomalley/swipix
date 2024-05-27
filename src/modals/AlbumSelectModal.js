import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const AlbumSelectModal = ({ isVisible, onClose, albums, onAlbumSelect, photoCount, selectedAlbum, albumCounts }) => {

  const renderAlbumItem = ({ item }) => {
    const isSelected = selectedAlbum && selectedAlbum.id === item.id;
    return (
      <TouchableOpacity
        style={[
          styles.albumItem,
          isSelected && styles.selectedAlbumItem
        ]}
        onPress={() => {
          onAlbumSelect(item);
          onClose();
        }}
      >
        <Text style={styles.albumText}>{item.title}</Text>
        <Text style={styles.albumCount}>{albumCounts[item.id] || 0}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Photos ({photoCount})</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={albums}
            renderItem={renderAlbumItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#f7f7f7',
    padding: 15,
    paddingBottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '65%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  albumItem: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: 3,
    marginBottom: 3,
    borderRadius: 10
  },
  selectedAlbumItem: {
    borderColor: '#ed6135',
    borderWidth: 2,
    backgroundColor: '#FFEFD5', // Light orange background
  },
  albumText: {
    fontSize: 18,
  },
  albumCount: {
    fontSize: 18,
    color: '#888',
  },
});

export default AlbumSelectModal;
