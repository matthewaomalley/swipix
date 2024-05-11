import React, { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, Animated } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import * as MediaLibrary from 'expo-media-library';
import HomeHeader from './HomeHeader';
import HomeFooter from './HomeFooter';

// main picture swipe screen
export default function Home({ navigation }) {
  const [images, setImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [deletedCount, setDeletedCount] = useState(0);
  const [footerVisible, setFooterVisible] = useState(true);
  const swiperRef = useRef(null);
  const [hasMore, setHasMore] = useState(true);
  const footerOpacity = useRef(new Animated.Value(1)).current;  // Initial opacity

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
      loadPhotos(endCursor);
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

  const handleSwipe = useCallback((cardIndex, direction) => {
    const removedImage = images[cardIndex];
    if (direction === 'left') {
      setDeletedImages(prev => [...prev, removedImage]);
      setDeletedCount(prev => prev + 1);
    }
    if (!footerVisible) {
      setFooterVisible(true);
      Animated.timing(footerOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start();
    }
  }, [images, footerVisible, footerOpacity]);


  const toggleFooter = () => {
    console.log('tapped')
    const toValue = footerVisible ? 0 : 1;
    Animated.timing(footerOpacity, {
      toValue,
      duration: 300,
      useNativeDriver: true
    }).start();
    setFooterVisible(!footerVisible);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.content} activeOpacity={1} onPress={toggleFooter}>
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
            onTapCard={toggleFooter}  // Add this line to handle tap
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
          visible={footerVisible} // Add this line to pass the visibility state
        />

      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    backgroundColor: 'black'
  },
});