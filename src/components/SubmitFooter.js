import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SubmitFooter = ({ actionType, photoCount, deletedImagesCount, totalPhotoCount, deletionSuccessful, deletedAlbumCounts, onSubmit }) => {
    const [footerPhotoWord, setFooterPhotoWord] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        console.log('photo count:', photoCount)
        if (photoCount === 1) {
            setFooterPhotoWord('Photo');
        } else {
            setFooterPhotoWord('Photos');
        }
    }, [photoCount]);

    const handlePress = () => {
        if (actionType === 'Done') {
            navigation.navigate('Home', { 
                deletionSuccessful, 
                deletedImagesCount, 
                totalPhotoCount,
                deletedAlbumCounts
            });
        } else {
            Alert.alert(
                "Confirm Deletion",
                "Are you sure you want to delete?",
                [
                    {
                        text: "Cancel",
                        style: "cancel"
                    },
                    {
                        text: "Delete",
                        onPress: onSubmit,
                        style: "destructive"
                    }
                ]
            );
        }
    };

    return (
        <View style={styles.footer}>
            <TouchableOpacity
                style={styles.button}
                onPress={handlePress}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Text style={styles.buttonText}>{actionType === 'Done' ? 'Done' : `Delete ${photoCount} ${footerPhotoWord}`}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    button: {
        flexDirection: 'row',
        width: '100%',
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ed6135',
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
});

export default SubmitFooter;