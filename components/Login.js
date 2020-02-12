import React, { Component } from 'react';
import { View, TextInput, Button } from 'react-native';


export default function LoginPage({navigation}) {
  return (
    <View>
      <TextInput placeholder="Username"/>
      <TextInput placeholder="Password"/>
      <Button title="Login"/>
    </View>
  );
}
