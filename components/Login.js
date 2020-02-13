import React, { Component } from 'react';
import { View, TextInput, Button, Image } from 'react-native';
import url from './Configuration.js';

const login = () => {
  fetch(url);
}

export default function LoginPage({navigation}) {
  return (
    <View>
      <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Image style = {{}} source={require('../images/pokemon-go-logo.png')} />
      </View>
      <TextInput placeholder="Email"/>
      <TextInput secureTextEntry={true} placeholder="Password"/>
      <View style={{display: 'flex', justifyContent: 'center', flexDirection: 'row', alignItems: 'flex-end'}}>
          <Button title="Login"/>
          <Button color="red" title="Register"/>
      </View>
    </View>
  );
}