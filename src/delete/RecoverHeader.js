import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const RecoverHeader = ({ onBackPress, onRecoverPress }) => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backContainer} onPress={onBackPress}>
                    <MaterialIcons style={styles.goBackIcon} name="arrow-back-ios" size={16} color="#ed6135" />
                    <Text style={styles.goBackText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.recoverContainer} onPress={onRecoverPress}>
                    <MaterialIcons style={styles.goBackIcon} name="support" size={22} color="ed6135" />
                    <Text style={styles.recoverText}>Recover</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#f8f8f8',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        height: 56,
    },
    backContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
    },
    recoverContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
    },
    recoverText: {
        color: '#ed6135',
        fontSize: 18,
        marginLeft: 5,
        marginBottom: 1,
    },
    goBackIcon: {
        marginLeft: 5,
    },
    goBackText: {
        marginBottom: 1,
        fontSize: 18,
        color: '#ed6135',
    },
});

export default RecoverHeader;
