import React from 'react';
import { Image, View, StyleSheet, Alert, } from 'react-native';
import Firebase from '../FirebaseOwn';
import { getDatabase, push, ref, onValue } from "firebase/database";
import { Header, Icon, Button } from "react-native-elements";
import { getAuth, signOut } from "firebase/auth";

//get database and authorization
const database = getDatabase(Firebase);
const auth = getAuth();

export default function Home({ route, navigation }) {

    //Singin out 
    const handleSignout = () => {
        signOut(auth).then(() => {
            navigation.replace("Login")
        }).catch((error) => {
            Alert.alert(error.message)
        });
    }

    return (
        <View styles={styles.container}>
            <Header
                barStyle="default"
                backgroundColor="#00b52d"
                centerComponent={{
                    text: "MyBudget",
                    style: {
                        color: "#fff",
                        fontWeight: '700',
                        fontSize: 16,
                    }
                }}
                centerContainerStyle={{}}
                containerStyle={{ width: '100%' }}
                leftComponent={{ icon: "logout", color: "#fff", onPress: (handleSignout) }}
                placement="center"
                rightComponent={{ icon: "search", color: "#fff", onPress: (() => navigation.navigate('Search')) }}
            />

            <Image
                style={[styles.stretch, styles.pictures]}
                source={require('../Pictures/logo.png')} />

            <View style={styles.buttons}>
                <Button buttonStyle={styles.button} title='Monthly expences' onPress={() => navigation.navigate('Monthlies')} />
                <Button buttonStyle={styles.button} title='Month' onPress={() => navigation.navigate('Month')} />
                <Button buttonStyle={styles.button} title='Receipts' onPress={() => navigation.navigate('Receipts')} />

            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        color: "#fff",
        fontWeight: '700',
        fontSize: 16,
    },
    stretch: {
        width: '100%',
        height: 150,
        resizeMode: 'contain',
    },
    pictures: {
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: '#fff'
    },
    button: {
        backgroundColor: '#00b52d',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        textAlign: 'center'
    },
    buttons: {
        backgroundColor: '#fff',
        justifyContent: 'center',
        //alignItems: 'center',

    }
});