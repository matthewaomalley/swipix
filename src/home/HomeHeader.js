import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, SafeAreaView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AlbumSelectModal from '../modals/AlbumSelectModal';
import InfoModal from '../modals/InfoModal';

const HomeHeader = ({ onNavigate, count, isVisible, albums, onAlbumSelect, selectedAlbum, photoCount, albumCounts }) => {
  const [albumModalVisible, setAlbumModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [animatedOpacity] = useState(new Animated.Value(isVisible ? 1 : 0));

  useEffect(() => {
    Animated.timing(animatedOpacity, {
      toValue: isVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  useEffect(() => { 
    console.log(albumCounts)
})

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[
        styles.header,
        {
          backgroundColor: animatedOpacity.interpolate({
            inputRange: [0, 1],
            outputRange: ['transparent', 'rgba(0, 0, 0, 0.4)'],
          }),
        },
      ]}>
        <View style={styles.trashButtonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: animatedOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['rgba(0, 0, 0, 0.4)', '#ed6135'],
                }),
              },
            ]}
            onPress={onNavigate}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="delete" size={24} color="white" />
            <Text style={styles.countText}>{count}</Text>
          </TouchableOpacity>
        </View>
        <Animated.View style={{ opacity: animatedOpacity, pointerEvents: isVisible ? 'auto' : 'none', flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity 
            style={[
              styles.textButton
            ]}
            onPress={() => setAlbumModalVisible(true)} 
          >
            <Text style={styles.buttonText}>
              {selectedAlbum ? selectedAlbum.title : 'Recents'}
            </Text>
            <MaterialIcons name="keyboard-arrow-down" size={22} style={{paddingTop: 2, paddingLeft: 2}} color={albumModalVisible ? '#ed6135' : 'white'} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.infoButton} 
            onPress={() => setInfoModalVisible(true)}
          >
            <MaterialIcons name="info-outline" size={22} color="white" />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
      <AlbumSelectModal
        isVisible={albumModalVisible}
        onClose={() => setAlbumModalVisible(false)}
        albums={albums}
        onAlbumSelect={onAlbumSelect}
        photoCount={photoCount}
        selectedAlbum={selectedAlbum}
        albumCounts={albumCounts}
      />
      <InfoModal
        isVisible={infoModalVisible}
        onClose={() => setInfoModalVisible(false)}
      />
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
    paddingVertical: 8,
    paddingHorizontal: 10,
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
    backgroundColor: '#ed6135',
  },
  textButton: {
    flexDirection: 'row',
    alignItems: 'center',
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
  infoButton: {
    marginLeft: 12,
    marginRight: 2,
    marginTop: 1,
  },
});

export default HomeHeader;
