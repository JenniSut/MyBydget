import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CalcHistory from './components/CalcHistory';

const Stack = createStackNavigator();

function Calculator({ navigation }) {
  const [text, setText] = useState('');
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [DATA, setData] = useState([]);


  const minus = () => {
    let result = parseInt(text1) - parseInt(text2);
    if (result) {
      setData([(text1 + '-' + text2 + '=' + result), ...DATA]);
      setText('Result: ' + result.toString());
    } else if (!result) {
      setText('please give all inputs')
    }

    setText1('');
    setText2('');
  };

  const plus = () => {
    let result = parseInt(text1) + parseInt(text2);
    if (result) {
      setData([(text1 + '+' + text2 + '=' + result) , ...DATA]);
      setText('Result ' + result.toString());
    } else if (!result) {
      setText('please give all inputs')
    }
    setText1('');
    setText2('');
  };


  return (
    <View style={styles.wrapper}>
      <View style={styles.inputWrapper}>
        <Text style={styles.text}>{text}</Text>
      </View>
      <View style={styles.inputWrapper}>
        <TextInput style={styles.input} onChangeText={text1 => setText1(text1)} value={text1} keyboardType='numeric' />
        <TextInput style={styles.input} onChangeText={text2 => setText2(text2)} value={text2} keyboardType='numeric' />
      </View>

      <View style={styles.buttonWrapper}>
        <Button style={styles.button} onPress={minus} title="-" />
        <Button style={styles.button} onPress={plus} title='+' />
        <Button title="History" onPress={() => navigation.navigate('History', { DATA })} />
      </View>
    </View>

  );
};


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Calculator" component={Calculator} />
        <Stack.Screen name="History" component={CalcHistory} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
    wrapper: {
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 50,
    },
    inputWrapper: {

      width: 200,
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'center',

    },
    input: {
      width: 200,
      borderColor: 'gray',
      borderWidth: 1
    },
    buttonWrapper: {
      padding: 5,
      width: 200,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    text: {
      fontSize: 12,
    },
  });