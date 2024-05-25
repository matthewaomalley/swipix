import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, FlatList, Dimensions, Alert } from 'react-native';
import SelectDeleteHeader from './SelectDeleteHeader';
import DeleteFooter from './DeleteFooter';
import * as MediaLibrary from 'expo-media-library';

const { width } = Dimensions.get('window');
const numColumns = 3;
const imageSize = width / numColumns;

const SelectDelete = ({ route, navigation }) => {
    const { deletedImages } = route.params;
    const [permissionGranted, setPermissionGranted] = useState(false);

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
    }, []);

    const handleDelete = async () => {
        if (!permissionGranted) {
            Alert.alert('Permission Denied', 'You need to grant permission to access the media library.');
            return;
        }

        try {
            const assetIds = deletedImages.map(image => image.id);
            await MediaLibrary.deleteAssetsAsync(assetIds);
            Alert.alert("Success", "Photos have been deleted.");
            navigation.goBack();
        } catch (error) {
            console.error("Error deleting photos: ", error);
            Alert.alert("Error", "There was an error deleting the photos.");
        }
    };

    return (
        <>
            <SelectDeleteHeader
                title={`To Be Deleted (${deletedImages.length})`}
                onBackPress={() => navigation.goBack()}
            />
            <FlatList
                data={deletedImages}
                keyExtractor={item => item.id}
                numColumns={numColumns}
                renderItem={({ item }) => (
                    <Image source={{ uri: item.uri }} style={styles.image} />
                )}
                contentContainerStyle={styles.container}
            />
            <DeleteFooter 
                photoCount={deletedImages.length}
                onDelete={handleDelete}  />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    image: {
        width: imageSize - 6,
        height: imageSize - 6,
        margin: 2
    }
});

export default SelectDelete;
