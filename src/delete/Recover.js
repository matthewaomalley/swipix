import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Animated } from 'react-native';
import RecoverHeader from './RecoverHeader';

const { width, height } = Dimensions.get('window');

const Recover = ({ route, navigation }) => {
    const { image, deletedImages } = route.params;
    const [imageMode, setImageMode] = useState('contain');
    const headerOpacity = useRef(new Animated.Value(1)).current;
    const [headerVisible, setHeaderVisible] = useState(true);
    const [buttonColor, setButtonColor] = useState('#ed6135');

    useEffect(() => {
        const windowAspectRatio = width / height;
        const imageAspectRatio = image.width / image.height;

        const widthMultiplier = 1.5;
        const heightMultiplier = 1.5;

        if ((image.width < width * widthMultiplier && image.height < height * heightMultiplier) ||
            Math.abs(imageAspectRatio - windowAspectRatio) < 0.1) {
            setImageMode('cover');
        } else {
            setImageMode('contain');
        }
    }, [image]);

    const handleRecover = () => {
        if (deletedImages.length === 1) {
            navigation.navigate('Home', { fromRecoverScreen: true, recoveredImages: [image] });
        } else {
            navigation.navigate('Delete', { recoveredImage: image });
        }
    };

    const toggleVisibility = () => {
        const toValue = headerVisible ? 0 : 1;
        Animated.timing(headerOpacity, {
            toValue,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setHeaderVisible(!headerVisible);
            setButtonColor(headerVisible ? 'white' : '#ed6135');
        });
    };

    return (
        <View style={styles.container}>
          <Animated.View style={[styles.headerContainer, { opacity: headerOpacity }]}>
            <RecoverHeader
              onBackPress={() => navigation.goBack()}
              onRecoverPress={handleRecover}
              buttonColor={buttonColor}
            />
          </Animated.View>
          <View style={styles.imageContainer}>
            <Image source={{ uri: image.uri }} style={styles.image} resizeMode={imageMode} />
          </View>
        </View>
      );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    headerContainer: {
        position: 'absolute',
        top: 0,
        width: '100%',
        zIndex: 1,
    },
    imageContainer: {
        flex: 1,
    },
    image: {
        width: '100%',
        height: '100%',
    },
});

export default Recover;
