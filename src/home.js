import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, Button } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import * as MediaLibrary from 'expo-media-library';
import HomeHeader from './HomeHeader';

export default function Home({ navigation }) {
  const [images, setImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [deletedCount, setDeletedCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        loadPhotos();
      } else {
        console.log('Permissions not granted');
      }
    })();
  }, []);

  const loadPhotos = async (after = null) => {
    const { assets, hasNextPage, endCursor } = await MediaLibrary.getAssetsAsync({
      first: 20,
      after,
      mediaType: 'photo',
      sortBy: [MediaLibrary.SortBy.creationTime],
      descending: true,
    });

    setImages(prev => [...prev, ...assets]);
    setHasMore(hasNextPage);

    if (hasNextPage) {
      loadPhotos(endCursor); // Recursively load photos if there are more
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => <HomeHeader
      count={deletedCount}
      onNavigate={() => navigation.navigate('Delete', { deletedImages })}
    />
    
    });
  }, [navigation, deletedCount]);

  const handleSwipe = (cardIndex, direction) => {
    const removedImage = images[cardIndex];
    if (direction === 'left') {
      setDeletedImages(prev => [...prev, removedImage]);
      setDeletedCount(prev => prev + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {images.length > 0 ? (
        <Swiper
          cards={images}
          renderCard={(card) => (
            <View style={styles.slide}>
              <Image source={{ uri: card.uri }} style={styles.image} resizeMode="cover" />
            </View>
          )}
          onSwipedLeft={(cardIndex) => handleSwipe(cardIndex, 'left')}
          onSwipedRight={(cardIndex) => handleSwipe(cardIndex, 'right')}
          backgroundColor={'black'}
          stackSize={3}
          infinite={false}
          verticalSwipe={false}
          horizontalSwipe={true}
          disableTopSwipe
          disableBottomSwipe
          cardVerticalMargin={0}
          cardHorizontalMargin={0}
        />
      ) : (
        <Text>No images found.</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    backgroundColor: 'black'
  },
});
