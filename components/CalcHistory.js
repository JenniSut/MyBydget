import React from 'react';
import { Text, FlatList, View } from 'react-native';

export default function History({ route, navigation }) {

    const {DATA} =route.params;
    

    return (
        <View>
            <FlatList
            data={DATA}
            keyExtractor={item => item}
            renderItem={({ item }) => <Text>{item}</Text>}
        />
        </View>
        
    )

}