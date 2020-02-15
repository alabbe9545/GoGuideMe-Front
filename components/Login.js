import React, { Component, useState } from 'react';
import { View, TextInput, Button, Image } from 'react-native';
import url from './Configuration.js';

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

  let promise = fetch(url+'/api/login', data).then((response) => response.json())
    .then((responseJson) => {
      let token = responseJson['success']['token'];
      console.log(token);
    })
    .catch((error) => {
      console.error(error);
    });
}

export default function LoginPage({navigation}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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