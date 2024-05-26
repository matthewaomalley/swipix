import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';

const DeleteFooter = ({ photoCount, onDelete }) => {
    const [footerPhotoWord, setFooterPhotoWord] = useState('');

    useEffect(() => {
        if (photoCount == 1) {
            setFooterPhotoWord('Photo')
        } else { setFooterPhotoWord('Photos') }
    }, [photoCount]);

    const handleDeletePress = () => {
        Alert.alert(
            "Confirm Deletion",
            "Are you sure you want to delete these photos?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: onDelete,
                    style: "destructive"
                }
            ]
        );
    };

    return (
        <View style={styles.footer}>
            <TouchableOpacity
                style={styles.button}
                onPress={handleDeletePress}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Text style={styles.buttonText}>Delete {photoCount} {footerPhotoWord}</Text>
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

export default DeleteFooter;
