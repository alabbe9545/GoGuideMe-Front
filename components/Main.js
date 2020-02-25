import React, { Component, useState, useEffect } from 'react';
import { View, TextInput, Button, Image, BackHandler, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
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

    let promise = fetch(url+'/api/countries', data)
      .then((response) => {
        if(response.status == 401){
          navigation.navigate('Login');
          return [];
        }
        else return response.json();
      })
      .then((responseJson) => {
        setCountries(responseJson);
      })
      .catch((error) => {
        console.log(error);
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
    <SafeAreaView>
      <ScrollView>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
          {countries.map((country)=>(
            <TouchableOpacity key={country.name+country.id} onPress={()=>navigation.navigate('Description', {country: country})}>
              <View style={{ display: 'flex', flexDirection: 'column' }} >
                <Text style = {{ fontWeight: 'bold', textAlign: 'center' }}>{country.name}</Text>
                <Image source={{uri: `${url}/${country.foto_path}`}} style={{ width: 100, height: 100, borderRadius: 60 }} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}