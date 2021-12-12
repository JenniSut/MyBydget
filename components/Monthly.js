import React, { useState, useEffect } from 'react';
import { Text, FlatList, View, StyleSheet, Keyboard, Image, ScrollView, List, ToastAndroid } from 'react-native';
import Firebase from '../FirebaseOwn';
import { Input, Button, ListItem, Icon } from 'react-native-elements';
import { getDatabase, push, ref, onValue, remove, get, update, set } from "firebase/database";
import { getAuth } from "firebase/auth";

//get user information and database 
const auth = getAuth();
const database = getDatabase(Firebase);

export default function Home({ route, navigation }) {

    const [income, setIncome] = useState('');
    const [cost, setCost] = useState('');
    const [data, setData] = useState([]);
    const [explanation, setExplanation] = useState('');
    const [equals, setEquals] = useState(0);
    const userId = auth.currentUser.uid;

    //get already saved monthly expenses from monthlies collection
    useEffect(() => {
        const itemsRef = ref(database, `${userId}/monthlies/`)
        //unsubscribes from this listener if screen is not active
        const unsubscribe = onValue(itemsRef, (snapshot) => {
            const dbData = snapshot.val();
            console.log(dbData);

            const monhtlies = dbData ? Object.keys(dbData).map(key => ({ key, ...dbData[key] })) : [];
            setData(monhtlies);
        })
        return unsubscribe
    }, []);

    //setting the equals from monthly collection
    useEffect(() => {
        const itemsRef = ref(database, `${userId}/monthly/`)
        const unsubscribe = onValue(itemsRef, (snapshot) => {
            const dbData = snapshot.val();
            if (dbData) {
                const monhtlies = dbData ? Object.keys(dbData).map(key => ({ key, ...dbData[key] })) : [];
                setEquals(monhtlies[0].equals);
            }

        })
        return unsubscribe
    }, []);

    //saves income to a user specific collection in the database
    const saveIncome = () => {
        Keyboard.dismiss();
        push(ref(database, `${userId}/monthlies/`), {
            'amount': income, 'type': 'income', 'exp': explanation
        });
        setEquals(equals + parseFloat(income));
        setIncome('');
        setCost('')
        setExplanation('');
    };

    //saves cost to a user specific collection in the database
    const saveCost = () => {
        Keyboard.dismiss();
        setEquals(equals - parseFloat(cost))
        push(ref(database, `${userId}/monthlies/`), {
            'amount': '-' + cost, 'type': 'cost', 'exp': explanation
        });
        setIncome('');
        setCost('')
        setExplanation('');
    };

    //deleting an item from database
    const deleteItem = ({ item }) => {
        setEquals(equals - parseFloat(item.amount))
        let idRef = ref(database, `${userId}/monthlies/${item.key}`);
        remove(idRef)
            .catch(function (error) { Alert.alert('remove failed') })

    }

    //saves the 'equals' to the database in monthly collection, if the 'equals' already excists in database, updates it
    const saveAll = () => {
        const itemsRef = ref(database, `${userId}/monthly/`)
        var dbData
        get(itemsRef).then((snapshot) => {
            dbData = snapshot.val();
            if (dbData === null) {
                push(ref(database, `${userId}/monthly/`), {
                    'equals': equals
                });
                ToastAndroid.show('saved successfully!', ToastAndroid.SHORT)
            } else {
                let key = Object.keys(dbData)[0]
                console.log(key)
                set(ref(database, `${userId}/monthly/${key}`), { equals: equals })
                ToastAndroid.show('saved successfully!', ToastAndroid.SHORT)
            }
        })
    };


    //conditional rendering; changes the color of the text depending on it's type
    const renderItem = ({ item }) => {
        if (item.type == 'cost') {
            return (
                <View>

                    <ListItem.Swipeable
                        bottomDivider
                        topDivider
                        rightContent={
                            <Button
                                title="Delete"
                                icon={{ name: 'delete', color: 'white' }}
                                buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
                                onPress={() => deleteItem({ item })}
                            />
                        }
                    >
                        <ListItem.Content>
                            <ListItem.Title style={{ color: 'red' }}>
                                {item.amount} €
                            </ListItem.Title>
                            <ListItem.Subtitle>{item.exp} </ListItem.Subtitle>
                        </ListItem.Content>
                        <ListItem.Chevron />
                    </ListItem.Swipeable>
                </View>
            )
        } else {
            return (
                <View>
                    <ListItem.Swipeable
                        bottomDivider
                        topDivider
                        rightContent={
                            <Button
                                title="Delete"
                                icon={{ name: 'delete', color: 'white' }}
                                buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
                                onPress={() => deleteItem({ item })}
                            />
                        }
                    >
                        <ListItem.Content>
                            <ListItem.Title style={{ color: 'green' }}>
                                {item.amount} €
                            </ListItem.Title>
                            <ListItem.Subtitle>{item.exp} </ListItem.Subtitle>
                        </ListItem.Content>
                        <ListItem.Chevron />
                    </ListItem.Swipeable>
                </View>
            )
        }
    }

    return (

        <ScrollView>
            <View style={styles.container}>
                <Image
                    style={[styles.stretch, styles.pictures]}
                    source={require('../Pictures/month.png')} />
                <View style={styles.explanation} >
                    <Input inputStyle={styles.inputStyle} placeholder='Explanation' onChangeText={(explanation) => setExplanation(explanation)} value={explanation} />
                </View>
                <View style={styles.inputcontainer}>

                    <View style={styles.input} >
                        <Input inputStyle={styles.inputStyle} placeholder='Add income' onChangeText={(income) => setIncome(income)} value={income} keyboardType='numeric' />
                        <Button buttonStyle={styles.button} title='Add income' onPress={saveIncome} icon={<Icon name="add" color="#fFF" />} />
                    </View>
                    <View style={styles.input}>
                        <Input inputStyle={styles.inputStyle} placeholder='Add cost' onChangeText={(cost) => setCost(cost)} value={cost} keyboardType='numeric' />
                        <Button buttonStyle={styles.button} title='Add cost' onPress={saveCost} icon={<Icon name="remove" color="#fFF" />} />
                    </View>
                </View>
                <View>

                    <FlatList
                        style={{ width: '100%', padding: 10, backgroundColor: '#e1fce6' }}
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={item => item.key}
                    />

                </View>
                <ListItem
                    bottomDivider
                    topDivider
                >
                    <ListItem.Content>
                        <ListItem.Title style={{ color: 'green' }}>
                            Equals
                        </ListItem.Title>
                        <ListItem.Subtitle>{equals.toFixed(2)} €</ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
                <Button buttonStyle={styles.button} title='Save monthlies' onPress={saveAll} icon={<Icon name="save" color="#fFF" />} />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white'
    },
    input: {
        width: 150,
    },
    inputStyle: {
        backgroundColor: '#e1fce6',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    inputcontainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    explanation: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    button: {
        backgroundColor: '#00b52d',
        marginTop: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    stretch: {
        width: '100%',
        height: 150,
        resizeMode: 'contain',
    },
    pictures: {
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: 'white'
    },

})