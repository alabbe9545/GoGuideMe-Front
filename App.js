import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import LoginPage from './components/Login';
import Register from './components/Register';
import Main from './components/Main';
import Description from './components/Description';
import ZoneDescription from './components/ZoneDescription';
import Map from './components/Map';
import Awards from './components/Awards';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Login" component={LoginPage}/>
          <Stack.Screen name="Register" component={Register}/>
          <Stack.Screen name="Main" component={Main}/>
          <Stack.Screen name="Description" component={Description}/>
          <Stack.Screen name="ZoneDescription" component={ZoneDescription}/>
          <Stack.Screen name="Map" component={Map}/>
          <Stack.Screen name="Awards" component={Awards}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}