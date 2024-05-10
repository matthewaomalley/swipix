import React from 'react';
import { View, Image, StyleSheet, FlatList, Dimensions } from 'react-native';
import SelectDeleteHeader from './SelectDeleteHeader'; // Import the new header component

const { width } = Dimensions.get('window');
const numColumns = 3;
const imageSize = width / numColumns;

const SelectDelete = ({ route, navigation }) => {
    const { deletedImages } = route.params;

    return (
        <>
            <SelectDeleteHeader
                title={`To Be Deleted (${deletedImages.length})`} // Dynamic count of images
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
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    image: {
        width: imageSize - 6, // Subtract some value for margin/padding if necessary
        height: imageSize - 6, // Subtract the same value to maintain aspect ratio
        margin: 2
    }
});

export default SelectDelete;
