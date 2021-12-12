import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './components/Home';
import Monthly from './components/Monthly';
import Month from './components/Month';
import Search from './components/Search'
import Login from './components/Login';
import Receipts from './components/Receipts';
import Receipt from './components/Receipt';

//create navigator
const Stack = createStackNavigator();

export default function App() {
  return (

    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
        <Stack.Screen options={{ headerShown: false }} name="Home" component={Home} />
        <Stack.Screen name="Monthlies" component={Monthly} />
        <Stack.Screen name="Month" component={Month} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Receipts" component={Receipts} />
        <Stack.Screen name="Receipt" component={Receipt} />
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
});