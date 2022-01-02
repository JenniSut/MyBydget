import React, { useEffect, useState } from 'react';
import { Text, FlatList, View, StyleSheet, Keyboard, ScrollView, Image } from 'react-native';
import Firebase from '../FirebaseOwn';
import { getDatabase, push, ref, onValue, get, remove, on } from "firebase/database";
import { Input, Button, ListItem, Icon, Header } from 'react-native-elements';
import { getAuth } from "firebase/auth";

import DateTimePicker from '@react-native-community/datetimepicker';

import { SafeAreaView } from 'react-native-safe-area-context';

//get userinformation and database
const auth = getAuth();
const database = getDatabase(Firebase);

export default function Month({ route, navigation }) {

    const [monthlies, setMonthlies] = useState(0);
    const [income, setIncome] = useState('');
    const [cost, setCost] = useState('');
    const [data, setData] = useState([]);
    const [explanation, setExplanation] = useState('');
    const [equals, setEquals] = useState(0);

    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [showDate, setShowDate] = useState('');

    //get userId
    const userId = auth.currentUser.uid;

    //Gets this ongoing months costs and incomes and the saved equals from every month
    useEffect(() => {

        const itemsRef = ref(database, `${userId}/month/${FormatMe(date.getMonth() + 1)}${date.getFullYear()}`)
        //unsubscribes from the listener if this screen is not active
        const unsubscribe = onValue(itemsRef, (snapshot) => {
            const dbData = snapshot.val();
            const month = dbData ? Object.keys(dbData).map(key => ({ key, ...dbData[key] })) : [];
            setData(month)
        })
        getData()
        return unsubscribe

    }, []);

    //useEffect(() => {getData()}, []);

    //counts what's left to pay after everymonths equals and this ongoing-months equals
    useEffect(() => {
        var eq = parseFloat(monthlies)
        console.log(monthlies)
        data.forEach(function (item) {
            var x = parseFloat(item.amount)
            eq = eq + x
            setEquals(eq)
            console.log(eq)
        })
    }, [monthlies]);

    //sets the date to a more easily understandable form
    useEffect(() => { setShowDate(date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear()) }, [date]);

    //gets the monthly equals
    const getData = () => {
        const itemsRef = ref(database, `${userId}/monthly/`)
        get(itemsRef).then((snapshot) => {
            const dbData = snapshot.val();
            const monhtliesData = dbData ? Object.keys(dbData).map(key => ({ key, ...dbData[key] })) : [];
            setMonthlies(monhtliesData[0].equals);
        })
    }

    //date time picker controls
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    //formatting the month for the database
    const FormatMe = (n) => {
        var x= (n < 10) ? '0' + n : n;
        return (x)
    }

    //saves income to the ongoing-months user specific database collection
    const saveIncome = () => {

        push(ref(database, `${userId}/month/${FormatMe(date.getMonth() + 1)}${date.getFullYear()}`), {
            'amount': income, 'type': 'income', 'exp': explanation, 'date': showDate
        });
        setEquals(equals + parseFloat(income));
        setIncome('');
        setCost('')
        setExplanation('')
        Keyboard.dismiss()
    };

     //saves cost to the ongoing-months user specific database collection
    const saveCost = () => {
        setEquals(equals - parseFloat(cost))
        push(ref(database, `${userId}/month/${FormatMe(date.getMonth() + 1)}${date.getFullYear()}`), {
            'amount': '-' + cost, 'type': 'cost', 'exp': explanation, 'date': showDate
        });
        setIncome('');
        setCost('')
        setExplanation('');
        Keyboard.dismiss();
    };

    //deletes item from the ongoing-months user specific database collection
    const deleteItem = ({ item }) => {
        setEquals(equals - parseFloat(item.amount))
        let idRef = ref(database, `${userId}/month/${FormatMe(date.getMonth() + 1)}${date.getFullYear()}/${item.key}`);
        remove(idRef)
            .catch(function (error) { Alert.alert('remove failed') })
    }

    //conditional rendering, changes the texts color depending on the type
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
                            <ListItem.Subtitle>{item.exp} | {item.date}</ListItem.Subtitle>
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
                            <ListItem.Subtitle>{item.exp} | {item.date}</ListItem.Subtitle>
                        </ListItem.Content>
                        <ListItem.Chevron />
                    </ListItem.Swipeable>
                </View>
            )
        }
    }

    return (
        <SafeAreaView>
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
                            <Button buttonStyle={styles.button} title='Add' onPress={saveIncome} icon={<Icon name="add" color="#fFF" />} />
                        </View>
                        <View style={styles.input}>
                            <Input inputStyle={styles.inputStyle} placeholder='Add cost' onChangeText={(cost) => setCost(cost)} value={cost} keyboardType='numeric' />
                            <Button buttonStyle={styles.button} title='Add' onPress={saveCost} icon={<Icon name="remove" color="#fFF" />} />
                        </View>
                        <View style={styles.input}>
                            <Input inputStyle={styles.inputStyle} value={showDate} />
                            <Button buttonStyle={styles.button} onPress={showDatepicker} title="Pick a date" />
                        </View>
                    </View>

                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode={mode}
                            is24Hour={true}
                            display="default"
                            onChange={onChange}
                        />
                    )}
                    <View>
                        <ListItem
                            bottomDivider
                            topDivider
                        >
                            <ListItem.Content>
                                <ListItem.Title>
                                    After monthlies to spend
                                </ListItem.Title>
                                <ListItem.Subtitle>{monthlies.toFixed(2)} €</ListItem.Subtitle>
                                <ListItem.Title>
                                    Now
                                </ListItem.Title>
                                <ListItem.Subtitle>{equals.toFixed(2)} €</ListItem.Subtitle>
                            </ListItem.Content>

                        </ListItem>
                        <FlatList
                            style={{ width: '100%', padding: 10, backgroundColor: '#e1fce6' }}
                            data={data}
                            renderItem={renderItem}
                            keyExtractor={item => item.key}
                        />
                        <ListItem
                            bottomDivider
                            topDivider
                        >
                            <ListItem.Content>
                                <ListItem.Title style={{ color: 'green' }}>
                                    Left to spend
                                </ListItem.Title>
                                <ListItem.Subtitle>{equals.toFixed(2)} €</ListItem.Subtitle>
                            </ListItem.Content>
                        </ListItem>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        borderColor: 'white',
        borderWidth: 1,
        marginLeft: 10,
        marginRight: 10,
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