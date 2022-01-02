import React, { useState, useEffect, useRef } from 'react'
import { Alert, StyleSheet, Text, View, Image, ScrollView, ToastAndroid } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from "firebase/auth";
import { getDatabase, push, ref, onValue, remove } from "firebase/database";

import { Input, Button, Card, SearchBar } from 'react-native-elements';

import Firebase from '../FirebaseOwn';
import { TouchableOpacity } from 'react-native-gesture-handler';

//get userinformation and database
const auth = getAuth();
const database = getDatabase(Firebase);

export default function Receipts({ navigation }) {

    //get userid
    const userId = auth.currentUser.uid;

    const [name, setName] = useState('')
    const [hasStoragePermission, setStoragePermission] = useState(null);
    const [image, setImage] = useState(null);
    const [receipts, setReceipts] = useState([]);
    const date = new Date()
    const [search, setSearch] = useState('')
    const [filteredDataSource, setFilteredDataSource] = useState([]);

    //ask storagepermission and get receipts from database
    useEffect(() => {
        askStoragePermission();
        getData();
    }, []);

    const askStoragePermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('We need permission to use storage!')
        }
        setStoragePermission(status == 'granted');
    }

    //gets the saved receipts from user specific database collection
    const getData = () => {
        const itemsRef = ref(database, `${userId}/receipts`)
        //unsubscribes from the listener if screen is not active
        const unsubscribe =
            onValue(itemsRef, (snapshot) => {
                const dbData = snapshot.val();
                const receipts = dbData ? Object.keys(dbData).map(key => ({ key, ...dbData[key] })) : [];
                setReceipts(receipts)
                setFilteredDataSource(receipts)
            })
        return unsubscribe
    };

    //handeling imagepicker
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true,
        });

        if (!result.cancelled) {
            setImage(result.base64);
        }
    };

    //handeling uploading image to user specific database collection, adds a date automatically with the image
    //saves the image as base64-string
    const uploadImage = async () => {
        const nowdate = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear()

        const unsubscribe = push(ref(database, `${userId}/receipts`), {
            'image': image, 'name': name, 'date': nowdate
        })
        ToastAndroid.show('saved successfully!', ToastAndroid.SHORT)
        setName('')
        setImage(null)
        return unsubscribe
    };

    //search bar handeling
    const searchFilterFunction = (text) => {
        // Check if searched text is not blank
        if (text) {
            // Inserted text is not blank
            // Filter the masterDataSource
            // Update FilteredDataSource
            const newData = receipts.filter(function (item) {
                const itemData = item.name
                    ? item.name.toUpperCase()
                    : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilteredDataSource(newData);
            setSearch(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setFilteredDataSource(receipts);
            setSearch(text);
        }
    };

    //deletes item from database cllection
    const deleteItem = ({ item }) => {
        let idRef = ref(database, `${userId}/receipts/${item.key}`);
        remove(idRef)
            .catch(function (error) { Alert.alert('remove failed') })
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                {!hasStoragePermission ? <Text>Please give permisson to storage</Text> : <Button buttonStyle={styles.button} title="Pick an image from camera roll" onPress={pickImage} />}
                <View style={styles.imagePreview}>
                    <Image
                        style={{ width: 100, height: 100, }}
                        resizeMode="cover"
                        source={{ uri: `data:image/gif;base64,${image}` }}
                    />
                </View>
                <Input placeholder='Name' onChangeText={(name) => setName(name)} value={name} />
                <Button buttonStyle={styles.button} title="Upload" onPress={uploadImage} />
            </View>

            <SearchBar
                round
                searchIcon={{ size: 24 }}
                lightTheme
                onChangeText={(text) => searchFilterFunction(text)}
                onClear={(text) => searchFilterFunction('')}
                placeholder="Type to search"
                value={search}
            />

            <View style={styles.container}>
                <Card>
                    <Card.Title h3>Receipts</Card.Title>
                    {
                        filteredDataSource.map((item) => {
                            return (
                                <View key={item.key} style={styles.item}>
                                    <TouchableOpacity onPress={() => navigation.navigate('Receipt', { item })}>
                                        <Image
                                            style={{ width: 100, height: 100, }}
                                            resizeMode="cover"
                                            source={{ uri: `data:image/gif;base64,${item.image}` }}
                                        />
                                    </TouchableOpacity>
                                    <Text style={styles.text}>{item.name} {"\n"}{item.date} </Text>
                                    <TouchableOpacity onPress={() => deleteItem({ item })}>
                                        <Text style={{ color: 'red' }}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        })
                    }
                </Card>

            </View>
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    imagePreview: {
        alignItems: 'center',
    },
    item: {
        flexDirection: 'row',
        padding: 10,
        position: "relative",
        alignItems: "center"
    },
    text: {
        fontSize: 20,
    },
    button: {
        backgroundColor: '#00b52d',
    },

})
