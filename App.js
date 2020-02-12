import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import LoginPage from './components/Login';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Login" component={LoginPage}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}