import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import RecoverHeader from './RecoverHeader';

const { width, height } = Dimensions.get('window');

const Recover = ({ route, navigation }) => {
    const { image, deletedImages } = route.params;
    const [imageMode, setImageMode] = useState('contain');

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
            navigation.navigate('Home', { recoveredImages: [image] });
        } else {
            navigation.navigate('Delete', { recoveredImage: image });
        }
    };

    return (
        <View style={styles.container}>
            <RecoverHeader
                onBackPress={() => navigation.goBack()}
                onRecoverPress={handleRecover}
            />
            <Image source={{ uri: image.uri }} style={styles.image} resizeMode={imageMode} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    image: {
        width: width,
        height: height,
    },
});

export default Recover;
