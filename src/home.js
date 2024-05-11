import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, Button } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import * as MediaLibrary from 'expo-media-library';
import HomeHeader from './HomeHeader';

// main picture swipe screen
export default function Home({ navigation }) {
  const [images, setImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [deletedCount, setDeletedCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // default request permissions modal when the user opens app (change later)
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

  // load more photos if user hits a specified index
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
      loadPhotos(endCursor);
    }
  };

  // set navigation options and show the header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => <HomeHeader
        count={deletedCount}
        onNavigate={() => navigation.navigate('Delete', { deletedImages })}
      />

    });
  }, [navigation, deletedCount]);

  // when a user swipes, if left, add to deleted imaged array and increment count
  const handleSwipe = useCallback((cardIndex, direction) => {
    const removedImage = images[cardIndex];
    if (direction === 'left') {
      setDeletedImages(prev => [...prev, removedImage]);
      setDeletedCount(prev => prev + 1);
    }
  }, [images]);  

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
