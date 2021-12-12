import React, {useState, useEffect} from 'react'
import { Alert, StyleSheet, Image, View } from 'react-native'
import Firebase from '../FirebaseOwn';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { Input, Button } from 'react-native-elements';
import { getDatabase, push, ref, onValue, remove, get, update, set } from "firebase/database";

//create ref to the database created in FirebaseOwn
const database = getDatabase(Firebase);



export default function Login({navigation}) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    //get Auth from firebase/auth
    const auth = getAuth();

    //check if user is signed in already
    useEffect(() => {
        //unsubscribes from the listener if we're not on this screen
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                navigation.replace("Home")
            }
        })

        return unsubscribe
    }, [])

    //Handeling Register
    const handleSignup = () => {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log('registered with: ' , user.email)
        })
        .catch((error) => {
            Alert.alert(error.message)
        });
    }

    //Handeling Sing in
    const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log('Logged in with:', user.email);
        })
        .catch((error) => {
            Alert.alert(error.message)
        });
    }


    return (
        <View style={styles.container}>
            <Image 
            style={styles.stretch}
            source={require('../Pictures/logo.png')}/>
            <View style={styles.inputContainer}>
                <Input placeholder='Email' onChangeText={(email) => setEmail(email)} value={email} />
                <Input secureTextEntry placeholder='Password' onChangeText={(password) => setPassword(password)} value={password} />
            </View>
            <View style={styles.buttonContainer}>
                <Button buttonStyle={styles.button} title='Log in' onPress={handleSignIn}/>
                <Button buttonStyle={styles.button} title='Register' onPress={handleSignup}/>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    inputContainer: {
        width: '80%'
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    stretch: {
        width: 350,
        height: 200,
        resizeMode: 'stretch',
    },
    button: {
        backgroundColor: '#00b52d',
        marginTop: 10,
        /*padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'*/
    },
    
})
