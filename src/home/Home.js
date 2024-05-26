import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, Animated, StatusBar, Platform } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import * as MediaLibrary from 'expo-media-library';
import HomeHeader from './HomeHeader';
import HomeFooter from './HomeFooter';

export default function Home({ navigation }) {
  const [images, setImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [deletedCount, setDeletedCount] = useState(0);
  const [footerVisible, setFooterVisible] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [photoCount, setPhotoCount] = useState(0);
  const swiperRef = useRef(null);
  const footerOpacity = useRef(new Animated.Value(1)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        loadAlbums();
        getTotalPhotoCount();
        loadPhotos();
      } else {
        console.log('Permissions not granted');
      }
    })();
  }, [selectedAlbum]);

  const loadAlbums = async () => {
    try {
      const albums = await MediaLibrary.getAlbumsAsync({ includeSmartAlbums: true });
      const filteredAlbums = [];

      for (const album of albums) {
        const { totalCount } = await MediaLibrary.getAssetsAsync({
          album: album.id,
          first: 1,
          mediaType: 'photo'
        });

        if (totalCount > 0) {
          filteredAlbums.push(album);
        }
      }

      setAlbums([{ id: 'recent', title: 'Recent' }, ...filteredAlbums]);
    } catch (error) {
      console.log('Error loading albums:', error);
    }
  };

  const getTotalPhotoCount = async () => {
    try {
      const { totalCount } = await MediaLibrary.getAssetsAsync({
        first: 1,
        mediaType: 'photo',
      });
      setPhotoCount(totalCount);
    } catch (error) {
      console.log('Error getting total photo count:', error);
    }
  };

  const loadPhotos = async (after = null) => {
    const { assets, hasNextPage, endCursor } = await MediaLibrary.getAssetsAsync({
      first: 20,
      after,
      mediaType: 'photo',
      album: selectedAlbum && selectedAlbum.id !== 'recent' ? selectedAlbum.id : null,
      sortBy: [MediaLibrary.SortBy.creationTime],
      descending: true,
    });
    setImages(prev => after ? [...prev, ...assets] : assets);
    if (hasNextPage) {
      loadPhotos(endCursor);
    }
  };

  const handleAlbumSelect = (album) => {
    setSelectedAlbum(album);
    setImages([]);
    setPhotoCount(0); // Reset the photo count when a new album is selected
  };

  const handleSwipe = useCallback((cardIndex, direction) => {
    const removedImage = images[cardIndex];
    if (direction === 'left') {
      setDeletedImages(prev => [...prev, removedImage]);
      setDeletedCount(prev => prev + 1);
    }
  }, [images]);

  const animateOpacity = (opacity, toValue) => {
    Animated.timing(opacity, {
      toValue: toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  
  const toggleVisibility = () => {
    const toValue = footerVisible ? 0 : 1;
  
    animateOpacity(footerOpacity, toValue);
    animateOpacity(headerOpacity, toValue);
  
    setFooterVisible(!footerVisible);
    setHeaderVisible(!headerVisible);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={styles.headerContainer}>
          <HomeHeader
            count={deletedCount}
            onNavigate={() => navigation.navigate('Delete', { deletedImages })}
            visible={headerVisible}
            albums={albums}
            onAlbumSelect={handleAlbumSelect}
            selectedAlbum={selectedAlbum ? selectedAlbum : { id: 'recent', title: 'Recent' }}
            photoCount={photoCount}
            headerOpacity={headerOpacity}
            isVisible={headerVisible}
          />
        </Animated.View>
        <TouchableOpacity style={styles.content} activeOpacity={1} onPress={toggleVisibility}>
          {images.length > 0 ? (
            <Swiper
              cards={images}
              renderCard={(card) => (
                <View style={styles.slide}>
                  <Image source={{ uri: card.uri }} style={styles.image} resizeMode="cover" />
                </View>
              )}
              ref={swiperRef}
              onSwipedLeft={(cardIndex) => handleSwipe(cardIndex, 'left')}
              onSwipedRight={(cardIndex) => handleSwipe(cardIndex, 'right')}
              onTapCard={toggleVisibility}
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
        </TouchableOpacity>
        <Animated.View style={{ ...styles.footer, opacity: footerOpacity }}>
          <HomeFooter
            onSwipe={(direction) => {
              if (direction === 'left' && swiperRef.current) {
                swiperRef.current.swipeLeft();
              } else if (direction === 'right' && swiperRef.current) {
                swiperRef.current.swipeRight();
              }
            }}
            visible={footerVisible}
          />
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 1,
  },
  content: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  slide: {
    flex: 1,
    backgroundColor: 'black', // Ensure each slide has a black background
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});
