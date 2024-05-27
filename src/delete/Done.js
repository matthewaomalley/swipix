import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import SubmitFooter from '../components/SubmitFooter';

const Done = ({ route, navigation }) => {
    const { deletionSuccessful, deletedImagesCount, totalPhotoCount, deletedAlbumCounts } = route.params;
    const percentageDeleted = ((deletedImagesCount / totalPhotoCount) * 100).toFixed(2);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.messageContainer}>
                <Text style={styles.bigText}>{deletedImagesCount}</Text>
                <Text style={styles.smallText}>photos deleted</Text>
                <Text style={styles.bigText}>{percentageDeleted}%</Text>
                <Text style={styles.smallText}>of storage freed</Text>
            </View>
            <SubmitFooter 
                actionType="Done" 
                deletedImagesCount={deletedImagesCount} 
                totalPhotoCount={totalPhotoCount} 
                deletionSuccessful={deletionSuccessful}
                deletedAlbumCounts={deletedAlbumCounts}
                />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f7f7f7',
    },
    messageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bigText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    smallText: {
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
});

export default Done;
