import React, { Component, useState, useEffect } from 'react';
import { View, TextInput, Button, Image, BackHandler, Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {url} from './Configuration.js';

export default function Main({navigation}) {
  const [token, setToken] = useState("");
  const [countries, setCountries] = useState([]);
  let backHandler = '';

  const getToken = async () => {
    try {
      let tok = await AsyncStorage.getItem('@token');
      setToken(tok);
      if(!tok) navigation.navigate('Login');
    } catch (e) {
      console.log('Storage issue');
    }
  }

  const getCountries = () => {
    let data = {};
    if(!token) return;
    data['method'] = "GET";
    data['headers'] = {};
    data['headers']['Accept'] = 'application/json';
    data['headers']['Content-Type'] = 'application/json';
    data['headers']['Authorization'] = 'Bearer '+ token;

    let promise = fetch(url+'/api/countries', data).then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        setCountries(responseJson);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    getToken();
    backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.navigate('Main');
      return true;
    });

    return function cleanUp(){backHandler.remove();}; 
  }, []);

  useEffect(() => {
    getCountries();
  }, [token]);

  return (
    <View>
        {countries.map((country)=>(
          <View key={country.name}>
            <Text>{country.name}</Text>
            <Image source={{uri: `${url}/${country.foto_path}`}} style={{ width: 200, height: 200 }} />
            <Text>{country.description}</Text>
          </View>))}
    </View>
  );
}