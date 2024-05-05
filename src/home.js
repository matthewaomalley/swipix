import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, Image, Dimensions, StyleSheet, SafeAreaView } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import * as MediaLibrary from 'expo-media-library';
import HomeHeader from './HomeHeader';
import HomeFooter from './HomeFooter';

const { width: screenWidth } = Dimensions.get('window');

export default function Home({ navigation }) {
  const [images, setImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [deletedCount, setDeletedCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        const { assets } = await MediaLibrary.getAssetsAsync({
          first: 20,
          mediaType: 'photo',
          sortBy: [MediaLibrary.SortBy.creationTime],
          descending: true,
        });
        setImages(assets);
      } else {
        console.log('Permissions not granted');
      }
    })();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => <HomeHeader count={deletedCount} />
    });
  }, [navigation, deletedCount]);

  const handleSwipe = (newIndex) => {
    const direction = newIndex > currentIndex ? 'right' : 'left';
    const removedImage = images[currentIndex]; // Get the current image

    if (direction === 'right') {
      console.log('swiped left')
      setDeletedImages(prev => [...prev, removedImage]); // Add to deleted images
      setDeletedCount(prev => prev + 1); // Increment deleted count
    }

    const newImages = images.filter((_, index) => index !== currentIndex);
    setImages(newImages);  // Update the images array without the removed image

    // If we are at the last index and swipe right, we should not increase the index
    setCurrentIndex(newIndex >= newImages.length ? newImages.length - 1 : newIndex); 
  };

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <Image source={{ uri: item.uri }} style={styles.image} resizeMode="contain" />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {images.length > 0 ? (
        <Carousel
          data={images}
          renderItem={renderItem}
          sliderWidth={screenWidth}
          itemWidth={screenWidth}
          layout={'default'}
          loop={false}
          decelerationRate="fast"
          disableIntervalMomentum={true}
          onScrollIndexChanged={(newIndex) => {
            if (currentIndex !== newIndex) {
              handleSwipe(newIndex);
            }
          }} // Check if the new index is different from the current index
        />
      ) : (
        <Text>No images found.</Text>
      )}
      <HomeFooter />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  slide: {
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
