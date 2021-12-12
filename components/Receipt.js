import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'

export default function Receipt({ route, navigation }) {

    //gets the location of the image as a parameter from parent
    const { item } = route.params
    
    return (
        <View style={styles.container}>
            <Image
                style={{
                    width: '100%',
                    height: 300,
                    resizeMode: 'contain',
                }}
                resizeMode="cover"
                source={{ uri: item.image }}
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
    }
})
