import React, { Component, useState, useEffect } from 'react';
import { View, TextInput, Button, Image, BackHandler, Text, SafeAreaView, ScrollView, 
        ImageBackground, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {url} from './Configuration.js';
import NavigationBar from 'react-native-navbar';

export default function Description({navigation: { goBack }, navigation, route}) {
  const [token, setToken] = useState("");
  const [zones, setZones] = useState([]);
  const country = route.params.country;

  const getToken = async () => {
    try {
      let tok = await AsyncStorage.getItem('@token');
      setToken(tok);
      if(!tok) navigation.navigate('Login');
    } catch (e) {
      console.log('Storage issue');
    }
  }

  const getZones = () => {
    let data = {};
    if(!token) return;
    data['method'] = "GET";
    data['headers'] = {};
    data['headers']['Accept'] = 'application/json';
    data['headers']['Content-Type'] = 'application/json';
    data['headers']['Authorization'] = 'Bearer '+ token;

    let promise = fetch(url+'/api/zones/'+country.id, data)
      .then((response) => {
        if(response.status == 401){
          navigation.navigate('Login');
          return [];
        }
        else return response.json();
      })
      .then((responseJson) => {
        setZones(responseJson);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    getToken(); 
  }, []);

  useEffect(() => {
    getZones();
  }, [token]);

  return (
    <ImageBackground source={{uri: `${url}/${country.foto_path}`}} style={{width: '100%', height: '100%'}}>
      <View style={{ backgroundColor:'rgba(0,0,0, 0.8)', width: '100%', height: '100%' }}>
        <SafeAreaView>
          <NavigationBar leftButton={{title: 'Back',handler: () => goBack()}} title={{title: 'GoGuideMe'}}/>
          <ScrollView>
            <View >
              <View>
                <Text style={{ textAlign: 'center', fontSize: 40, color: 'white' }}>{country.name}</Text>
                <Text style={{ textAlign: 'center', color: 'white' }}>{country.description}</Text>
              </View>
              <View style={{ borderBottomColor: 'white', borderBottomWidth: 1 }} />
              <Text style={{ textAlign: 'center', fontSize: 24, color: 'white' }}>Zones</Text>
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
                {zones.map((zone)=>(
                  <TouchableOpacity key={zone.name+zone.id} onPress={()=>navigation.navigate('ZoneDescription', {zone: zone})}>
                    <View style={{ display: 'flex', flexDirection: 'column' }} >
                      <Text style = {{ fontWeight: 'bold', textAlign: 'center', color: 'white' }}>{zone.name}</Text>
                      <Image source={{uri: `${url}/${zone.foto_path}`}} style={{ width: 50, height: 50, borderRadius: 50 }} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
} 
