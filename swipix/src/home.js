import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Image, ActivityIndicator, Text, Button } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import SwipeDeck from 'react-native-deck-swiper';

import Footer from './Footer';

export default function Home( ) {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const swipeDeckRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      } else {
        try {
          const { assets } = await MediaLibrary.getAssetsAsync({
            first: 10,
            mediaType: 'photo',
            sortBy: [MediaLibrary.SortBy.creationTime],
            descending: true,
          });
          setImages(assets);
        } catch (error) {
          console.error('Error fetching assets:', error);
        }
      }
    })();
  }, []);

  const handleSwiped = (direction) => {
    console.log(direction)
    if (direction === 'left' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === 'right' && currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <View style={styles.container}>
      {images.length > 0 ? (
        <View style={styles.imageContainer}>
          <SwipeDeck
            ref={swipeDeckRef}
            cards={images}
            renderCard={(card, index) => (
              <Image
                key={index}
                source={{ uri: card.uri }}
                style={styles.image}
 
              />
            )}
            onSwiped={(index, direction) => handleSwiped(index, direction)}
            stackSize={1}
            cardStyle={styles.card}
            verticalSwipe={false}
          />
        </View>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text>Loading images bruh...</Text>
        </View>
      )}
      <Footer style={styles.footerStyle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red'
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerStyle: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});
