import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, FlatList, Dimensions, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import SelectDeleteHeader from './SelectDeleteHeader';
import SubmitFooter from '../components/SubmitFooter';
import * as MediaLibrary from 'expo-media-library';

const { width } = Dimensions.get('window');
const numColumns = 3;
const imageSize = width / numColumns;

const SelectDelete = ({ route, navigation }) => {
    const { deletedImages: initialDeletedImages, totalPhotoCount: initialTotalPhotoCount } = route.params;
    const [deletedImages, setDeletedImages] = useState(initialDeletedImages || []);
    const [recoveredImages, setRecoveredImages] = useState([]);
    const deletedImagesCount = deletedImages.length;
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [deletedAlbumCounts, setDeletedAlbumCounts] = useState({});
    const { recoveredImage: newRecoveredImage } = route.params || {};
    const [recoveredImage, setRecoveredImage] = useState();
    const [totalPhotoCount, setTotalPhotoCount] = useState(initialTotalPhotoCount);

    useEffect(() => {
        setTotalPhotoCount(totalPhotoCount - deletedImages.length);
    }, [deletedImages]);

    useEffect(() => {
        if (newRecoveredImage && (!recoveredImage || newRecoveredImage.id !== recoveredImage.id)) {
            setRecoveredImage(newRecoveredImage);
            setRecoveredImages(prevImages => [...prevImages, newRecoveredImage]);
    
            // remove the recovered image from the deletedImages array
            setDeletedImages(prevDeletedImages => {
                return prevDeletedImages.filter(img => img.id !== newRecoveredImage.id);
            });
        }
    }, [newRecoveredImage]);

    // request permission to delete images
    useEffect(() => {
        const requestPermissions = async () => {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status === 'granted') {
                setPermissionGranted(true);
            } else {
                Alert.alert('Permission Denied', 'You need to grant permission to access the media library.');
                navigation.goBack();
            }
        };
        requestPermissions();
    }, [navigation]);

    useEffect(() => {
        const albumCounts = {};
        deletedImages.forEach(image => {
            const albumId = image.albumId || 'recent';
            if (!albumCounts[albumId]) {
                albumCounts[albumId] = 0;
            }
            albumCounts[albumId]++;
        });
        setDeletedAlbumCounts(albumCounts);
    }, [deletedImages]);

    const handleDelete = async () => {
        if (!permissionGranted) {
            Alert.alert('Permission Denied', 'You need to grant permission to access the media library.');
            return;
        }

        setLoading(true);

        try {
            const assetIds = deletedImages.map(image => image.id);
            if (assetIds.length > 0) {
                await MediaLibrary.deleteAssetsAsync(assetIds);
                setLoading(false);
                navigation.navigate('Done', {
                    deletionSuccessful: true,
                    deletedImagesCount: deletedImages.length,
                    totalPhotoCount: totalPhotoCount,
                    deletedAlbumCounts: deletedAlbumCounts
                });
            } else {
                throw new Error("No valid asset IDs found.");
            }
        } catch (error) {
            console.error("Error deleting photos:", error);
            setLoading(false);
            Alert.alert("Error", "There was an error deleting the photos.");
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <>
            <SelectDeleteHeader
                title={`To Be Deleted (${deletedImagesCount})`}
                onBackPress={() => {
                    navigation.navigate('Home', { recoveredImages })
                }}
            />
            <FlatList
                data={deletedImages}
                keyExtractor={item => item.id}
                numColumns={numColumns}
                renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate('Recover', {
                    image: item,
                    navigateBackScreen: 'SelectDelete',
                    deletedImages: deletedImages,
                })}>
                    <Image source={{ uri: item.uri }} style={styles.image} />
                </TouchableOpacity>
                )}
                contentContainerStyle={styles.container}
            />
            <SubmitFooter
                actionType="Delete"
                photoCount={deletedImagesCount}
                totalPhotoCount={totalPhotoCount}
                deletedAlbumCounts={deletedAlbumCounts}
                onSubmit={handleDelete}
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    image: {
        width: imageSize - 6,
        height: imageSize - 6,
        margin: 2,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SelectDelete;
