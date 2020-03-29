import React, { Component, useState, useEffect } from 'react';
import { View, TextInput, Button, Image, BackHandler, Text, SafeAreaView, ScrollView, 
        ImageBackground, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {url} from './Configuration.js';
import NavigationBar from 'react-native-navbar';

export default function Awards({navigation: { goBack }, navigation, route}) {
  const [token, setToken] = useState("");
  const [awards, setAwards] = useState([]);

  const getToken = async () => {
    try {
      let tok = await AsyncStorage.getItem('@token');
      setToken(tok);
      if(!tok) navigation.navigate('Login');
    } catch (e) {
      console.log('Storage issue');
    }
  }

  const getAwards = () => {
    let data = {};
    if(!token) return;
    data['method'] = "GET";
    data['headers'] = {};
    data['headers']['Accept'] = 'application/json';
    data['headers']['Content-Type'] = 'application/json';
    data['headers']['Authorization'] = 'Bearer '+ token;

    let promise = fetch(url+'/api/awards/', data)
      .then((response) => {
        if(response.status == 401){
          navigation.navigate('Login');
          return [];
        }
        else return response.json();
      })
      .then((responseJson) => {
      	console.log(responseJson);
        setAwards(responseJson);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    getToken(); 
  }, []);

  useEffect(() => {
  	getAwards();
  }, [token]);

  return (
    <SafeAreaView>
      <NavigationBar leftButton={{title: 'Back',handler: () => navigation.navigate('Main')}} title={{title: 'GoGuideMe'}}/>
      <ScrollView>
      	<View>
        	<Text style={{ textAlign: 'center', fontSize: 40 }}>Awards</Text>
      	</View>
      	<View style={{ borderBottomColor: 'black', borderBottomWidth: 1 }} />
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
          {awards.map((award)=>(
	          <View key={award.id} style={{ display: 'flex', flexDirection: 'column' }} >
	            <Text style = {{ fontWeight: 'bold', textAlign: 'center' }}>{award.name}</Text>
	            <Image source={{uri: `${url}/${award.icon_path}`}} style={{ width: 100, height: 100 }} />
	          </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 
 
