import React, { Component, useState, useEffect } from 'react';
import { View, TextInput, Button, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {url} from './Configuration.js';

const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem('@token', token)
  } catch (e) {
    console.log('saving issue');
  }
}

export default function LoginPage({navigation}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const getToken = async () => {
    try {
      let tok = await AsyncStorage.getItem('@token');
      if(tok) navigation.navigate('Main');
    } catch (e) {
      console.log('Storage issue');
    }
  }

  useEffect(() => {
    getToken();
  }, []);

  const login = (email, password) => { 
    let data = {};
    data['method'] = "POST";
    data['headers'] = {};
    data['headers']['Accept'] = 'application/json';
    data['headers']['Content-Type'] = 'application/json';
    data['body'] = {};
    data['body']['email'] = email;
    data['body']['password'] = password;
    data['body'] = JSON.stringify(data['body']);

    let promise = fetch(url+'/api/login', data)
      .then((response) => {
        if(response.status != 200){
          throw response;
        }
        return response.json();
      })
      .then((responseJson) => {
        let token = responseJson['success']['token'];
        storeToken(token);
        navigation.navigate('Main');
      })
      .catch((error) => {
        alert('Unauthorized');
      });
  }

  return (
    <View>
      <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Image style = {{}} source={require('../images/pokemon-go-logo.png')} />
      </View>
      <TextInput onChangeText={(text) => setEmail(text)} placeholder="Email" value={email}/>
      <TextInput onChangeText={(text) => setPassword(text)} secureTextEntry={true} placeholder="Password" value={password}/>
      <View style={{display: 'flex', justifyContent: 'center', flexDirection: 'row', alignItems: 'flex-end'}}>
          <Button title="Login" onPress={() => login(email, password)}/>
          <Button color="red" title="Register" onPress={() => navigation.navigate('Register')}/>
      </View>
    </View>
  );
}