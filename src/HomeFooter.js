// Footer.js
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';

const Footer = ({ count }) => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.footer}>
                <TouchableOpacity style={styles.button} onPress={() => console.log('Keep pressed')}>
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => console.log('Delete pressed')}>
                    <Text style={styles.buttonText}>Keep</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#f8f8f8',
        width: '100%',
        
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        padding: 5,

    },
    button: {
        flex: 1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        marginHorizontal: 5,
    },
    buttonText: {
        color: 'black',
        fontSize: 20,
    },
});

export default Footer;
