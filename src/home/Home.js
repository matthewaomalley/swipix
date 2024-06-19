import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, Animated, StatusBar, Platform, Dimensions } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import * as MediaLibrary from 'expo-media-library';
import HomeHeader from './HomeHeader';
import HomeFooter from './HomeFooter';
import { useFocusEffect } from '@react-navigation/native';

export default function Home({ navigation, route }) {
  const [images, setImages] = useState([]);
  const [imageModes, setImageModes] = useState({});
  const [deletedImages, setDeletedImages] = useState([]);
  const [deletedCount, setDeletedCount] = useState(0);
  const [footerVisible, setFooterVisible] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [photoCount, setPhotoCount] = useState(0);
  const [albumCounts, setAlbumCounts] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const swiperRef = useRef(null);
  const footerOpacity = useRef(new Animated.Value(1)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;



  // handle recovered images
// handle recovered images
useEffect(() => {
  if (route.params?.recoveredImages) {
    // Remove recovered images from deletedImages
    const recoveredImageIds = route.params.recoveredImages.map(img => img.id);

    setDeletedImages(prevDeletedImages => {
      return prevDeletedImages.filter(image => !recoveredImageIds.includes(image.id));
    });

    // Decrement deletedCount by the number of recovered images
    setDeletedCount(prevDeletedCount => prevDeletedCount - route.params.recoveredImages.length);

    // Add recovered images back to the images array and remove duplicates
    setImages(prevImages => {
      const updatedImages = [...route.params.recoveredImages, ...prevImages];
      return updatedImages.filter((image, index, self) =>
        index === self.findIndex((img) => img.id === image.id)
      );
    });

    navigation.setParams({ recoveredImages: undefined });
  }

  // Reset count and deleted images when coming directly from recover screen
  if (route.params?.fromRecoverScreen) {
    setDeletedCount(0);
    setDeletedImages([]);
    navigation.setParams({ fromRecoverScreen: undefined }); // Clear the param after using it
  }
}, [route.params, navigation]);


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

  useFocusEffect(
    useCallback(() => {
      if (route.params?.deletedAlbumCounts) {
        const newCounts = { ...albumCounts };
        for (const [albumId, count] of Object.entries(route.params.deletedAlbumCounts)) {
          if (newCounts[albumId] !== undefined) {
            newCounts[albumId] -= count;
          }
        }
        setAlbumCounts(newCounts);
        navigation.setParams({ deletedAlbumCounts: undefined });
      }

      if (route.params?.deletionSuccessful) {
        console.log('Yes, successful deletion');
        setDeletedCount(0);
        setDeletedImages([]);
        console.log('Deleted count reset to 0');
        navigation.setParams({ deletionSuccessful: undefined });
      }
    }, [route.params, albumCounts, navigation])
  );

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
      fetchAlbumCounts([{ id: 'recent', title: 'Recent' }, ...filteredAlbums]);
    } catch (error) {
      console.log('Error loading albums:', error);
    }
  };

  const fetchAlbumCounts = async (albums) => {
    const counts = {};

    try {
      for (const album of albums) {
        if (album.id === 'recent') {
          const { totalCount } = await MediaLibrary.getAssetsAsync({
            mediaType: 'photo',
            first: 1,
          });
          counts[album.id] = totalCount;
        } else {
          const { totalCount } = await MediaLibrary.getAssetsAsync({
            album: album.id,
            mediaType: 'photo',
            first: 1,
          });
          counts[album.id] = totalCount;
        }
      }
      setAlbumCounts(counts);
    } catch (error) {
      console.error('Error fetching album counts:', error);
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
  
    const imageModes = {};
    const windowAspectRatio = windowWidth / windowHeight;
  
    for (const asset of assets) {
      const { width, height } = asset;
      const imageAspectRatio = width / height;

      const widthMultiplier = 1.5;
      const heightMultiplier = 1.5;
  
      if ((width < windowWidth * widthMultiplier && height < windowHeight * heightMultiplier) ||
          Math.abs(imageAspectRatio - windowAspectRatio) < 0.1) {
        imageModes[asset.id] = 'cover';
      } else {
        imageModes[asset.id] = 'contain';
      }
    }
  
    setImages(prev => after ? [...prev, ...assets] : assets);
    setImageModes(prev => ({ ...prev, ...imageModes }));
  
    if (hasNextPage) {
      loadPhotos(endCursor);
    }
  };
  

  const handleAlbumSelect = (album) => {
    setSelectedAlbum(album);
  };

  const handleSwipe = useCallback((cardIndex, direction) => {
    const removedImage = images[cardIndex];
    if (direction === 'left') {
      setDeletedImages(prev => [...prev, removedImage]);
      setDeletedCount(prev => prev + 1);
    }
    setCurrentImageIndex(cardIndex + 1);
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

  const handleNavigateToDelete = () => {
    navigation.navigate('Delete', { 
      deletedImages: deletedImages, 
      totalPhotoCount: photoCount
    });
  };

  const handleTapCard = (cardIndex) => {
    setCurrentImageIndex(cardIndex);
  };

  useEffect(() => {
    if (images.length > 0 && currentImageIndex < images.length) {
      const currentImage = images[currentImageIndex];
    }
  }, [currentImageIndex, images, imageModes, windowWidth, windowHeight]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={styles.headerContainer}>
          <HomeHeader
            count={deletedCount}
            onNavigate={handleNavigateToDelete}
            visible={headerVisible}
            albums={albums}
            onAlbumSelect={handleAlbumSelect}
            selectedAlbum={selectedAlbum ? selectedAlbum : { id: 'recent', title: 'Recent' }}
            photoCount={photoCount}
            headerOpacity={headerOpacity}
            isVisible={headerVisible}
            albumCounts={albumCounts}
            disabled={deletedCount === 0}
            
          />
        </Animated.View>
        <TouchableOpacity style={styles.content} activeOpacity={1} onPress={toggleVisibility}>
          {images.length > 0 ? (
            <Swiper
            cards={images}
            renderCard={(card) => (
              <View style={styles.slide}>
                <Image source={{ uri: card.uri }} style={styles.image} resizeMode={imageModes[card.id]} />
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
    backgroundColor: 'black',
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
