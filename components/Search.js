import React, { useState } from 'react';
import { FlatList, View, Button, StyleSheet, Alert, Text } from 'react-native';
import Firebase from '../FirebaseOwn';
import { getDatabase, ref, get } from "firebase/database";
import { Input, ListItem } from "react-native-elements";

import { getAuth } from "firebase/auth";

const database = getDatabase(Firebase);
const auth = getAuth();

export default function Home({ route, navigation }) {

    const [input, setInput] = useState('')
    const [data, setData] = useState([]);
    const userId = auth.currentUser.uid;

    const search = () => {
        if (input != ''){
            const itemsRef = ref(database, `${userId}/month/${input}`)
            get(itemsRef).then((snapshot) => {
                const dbData = snapshot.val();
                const DataWkeys = dbData ? Object.keys(dbData).map(key => ({ key, ...dbData[key] })) : [];
                setData(DataWkeys)
            })
        }else {
            Alert.alert('Please give a month')
        }
    }

    const renderItem = ({ item }) => {
        if (item.type == 'cost') {
            return (
                <View>
                    <ListItem
                        bottomDivider
                        topDivider
                        
                    >
                        <ListItem.Content>
                            <ListItem.Title style={{ color: 'red' }}>
                                {item.amount} €
                            </ListItem.Title>
                            <ListItem.Subtitle>{item.exp} | {item.date}</ListItem.Subtitle>
                        </ListItem.Content>
                        <ListItem.Chevron />
                    </ListItem>
                </View>
            )
        } else {
            return (
                <View>
                    <ListItem
                        bottomDivider
                        topDivider
                    >
                        <ListItem.Content>
                            <ListItem.Title style={{ color: 'green' }}>
                                {item.amount} €
                            </ListItem.Title>
                            <ListItem.Subtitle>{item.exp} | {item.date}</ListItem.Subtitle>
                        </ListItem.Content>
                        <ListItem.Chevron />
                    </ListItem>
                </View>
            )
        }
    }

    return (

        <View style={styles.container}>
            <Text style={styles.text}>Look for a sertain months expences here</Text>
            <Input placeholder='DDYYYY' onChangeText={(input) => setInput(input)} value={input} />
            <Button title='Search' onPress={search}/>
       
            <FlatList
                style={{ width: '100%', padding: 5 }}
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.key}
            />
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
    text: {
        fontSize:20,
        fontWeight: 'bold',
        padding: 10
    }
});