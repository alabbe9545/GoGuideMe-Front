import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import LoginPage from './components/Login';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App(){
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={LoginPage}/>
        </Stack.Navigator> 
      </NavigationContainer>
    );
}