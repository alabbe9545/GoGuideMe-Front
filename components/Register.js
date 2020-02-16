import React, { Component, useState } from 'react';
import { View, TextInput, Button, Image } from 'react-native';
import {url} from './Configuration.js';
import AsyncStorage from '@react-native-community/async-storage';

export default function Register({navigation}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [c_password, setC_password] = useState("");
  const [name, setName] = useState("");

  const storeToken = async (token) => {
    try {
      await AsyncStorage.setItem('@token', token)
    } catch (e) {
      console.log('saving issue');
    }
  }

  const register = (name, email, password, c_password) => {
    let data = {};
    data['method'] = "POST";
    data['headers'] = {};
    data['headers']['Accept'] = 'application/json';
    data['headers']['Content-Type'] = 'application/json';
    data['body'] = {};
    data['body']['email'] = email;
    data['body']['password'] = password;
    data['body']['name'] = name;
    data['body']['c_password'] = c_password;
    data['body'] = JSON.stringify(data['body']);

    let promise = fetch(url+'/api/register', data).then((response) => response.json())
      .then((responseJson) => {
        let token = responseJson['success']['token'];
        storeToken(token);
        navigation.navigate('Main');
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <View>
      <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Image style = {{}} source={require('../images/pokemon-go-logo.png')} />
      </View>
      <TextInput onChangeText={(text) => setName(text)} placeholder="Name" value={name}/>
      <TextInput onChangeText={(text) => setEmail(text)} placeholder="Email" value={email}/>
      <TextInput onChangeText={(text) => setPassword(text)} secureTextEntry={true} placeholder="Password" value={password}/>
      <TextInput onChangeText={(text) => setC_password(text)} secureTextEntry={true} 
                        placeholder="Repeat Password" value={c_password}/>
      <Button color="red" title="Register" onPress={() => register(name, email, password, c_password)}/>
    </View>
  );
}