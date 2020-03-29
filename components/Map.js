import React, { Component, useState, useEffect } from 'react';
import { View, TextInput, Button, Image, BackHandler, Text, SafeAreaView, ScrollView, 
        ImageBackground, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-community/async-storage';
import {url} from './Configuration.js';
import MapboxGL from "@react-native-mapbox-gl/maps"
import useInterval from './UseInterval';
import SoundPlayer from 'react-native-sound-player'
import NavigationBar from 'react-native-navbar';

MapboxGL.setAccessToken('pk.eyJ1IjoiYWxhYmJlOTU0NSIsImEiOiJjazJnNXRzZXQwN3d4M2NwZmw1aGVkMjhyIn0.spxnZe5xKR3vSQ0VwSo1eA');

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  container: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  map: {
    flex: 1
  }
});


export default function Map({navigation: { goBack }, route, navigation}) {
	const [token, setToken] = useState("");
	const [position, setPosition] = useState([]);
	const [map, setMap] = useState({});
	const [nearAttractions, setNearAttractions] = useState([]);
	const [selectedAttraction, setSelectedAttraction] = useState(null);
	const [audioFinish, setAudioFinish] = useState(null);
	const [isPlaying, setIsPlaying] = useState(false);
	let backHandler = '';

	const updateFunction = () => {
		getGeolocation();
		getNearestsAttractions();
	}

	const getToken = async () => {
		try {
		  let tok = await AsyncStorage.getItem('@token');
		  setToken(tok);
		  if(!tok) navigation.navigate('Login');
		} catch (e) {
		  console.log('Storage issue');
		}
	}

	const getNearestsAttractions = () => {
		let data = {};
		if(position.length != 2) return;
	    data['method'] = "POST";
	    data['headers'] = {};
	    data['headers']['Accept'] = 'application/json';
	    data['headers']['Content-Type'] = 'application/json';
	    data['headers']['Content-Type'] = 'application/json';
    	data['headers']['Authorization'] = 'Bearer '+ token;
	    data['body'] = {};
	    data['body']['point'] = position[0] + ' ' + position[1];
	    data['body'] = JSON.stringify(data['body']);

	    let promise = fetch(url+'/api/getNearestsAttractions', data)
	      .then((response) => {
	        if(response.status == 401){
	          navigation.navigate('Login');
	          return [];
	        }
	        else return response.json();
	      })
	      .then((responseJson) => {
	        setNearAttractions(responseJson);
	      })
	      .catch((error) => {
	        console.log(error);
	      });
	}

	useInterval(() => {
		updateFunction();
	}, 3000);

	useEffect(() => {
    	getToken();
    	backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      		goBack();
      		return true;
    	});

    	getGeolocation();

    	return function cleanUp(){
    		backHandler.remove();
    		if(audioFinish) audioFinish.remove();
    	}; 
  	}, []);

  	const getGeolocation = () =>{
  		Geolocation.getCurrentPosition(
	      position => {
	        setPosition([position.coords.longitude, position.coords.latitude]);
	      },
	      error => Alert.alert('Error', JSON.stringify(error)),
	      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
	    );
  	}

  	let vv = null;

  	const setCurrentAttraction = (attraction) => {
  		setSelectedAttraction(attraction);
  		setIsPlaying(false);
  		SoundPlayer.loadUrl(`${url}/${attraction.audio_path}`);
  		setAudioFinish(SoundPlayer.addEventListener('FinishedPlaying', ({ success }) => {
  			setIsPlaying(false);
	    	SoundPlayer.loadUrl(`${url}/${attraction.audio_path}`);
	    }));
  	}

  	const playAudio = () => {
  		if(isPlaying){
  			SoundPlayer.pause();
  		}
  		else{
  			SoundPlayer.play();
  		}
  		setIsPlaying(!isPlaying)
  	}

  	const backFunction = () => {
  		if(selectedAttraction !== null){
  			setSelectedAttraction(null);
  		}
  		else{
  			navigation.navigate('Main');
  		}
  	}

  	return (
        <View style={styles.container}>
          <NavigationBar leftButton={{title: 'Back',handler: () => backFunction()}} title={{title: 'GoGuideMe'}}/>
        	{selectedAttraction !== null &&
        		<View style={{position: 'absolute', zIndex: 1, backgroundColor: 'white', width: '100%', height: '100%'}}>
        			<NavigationBar leftButton={{title: 'Back',handler: () => backFunction()}} title={{title: 'GoGuideMe'}}/>
        			<Image source={{uri: `${url}/${selectedAttraction.foto_path}`}} style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').width/3 }} />
        			<ScrollView>
        				<View>
							<Text style={{ textAlign: 'center', fontSize: 40 }}>{selectedAttraction.name}</Text>
							<Text style={{ textAlign: 'center' }}>{selectedAttraction.description}</Text>
						</View>
						<Button title="Play/Pause" onPress={playAudio} />
        			</ScrollView>
        		</View>
        	}
        	<MapboxGL.MapView style={styles.map} ref={(map) => {setMap(map)}} scrollEnabled={false} zoomEnabled={false}>
        		<MapboxGL.Camera zoomLevel={17} centerCoordinate={position} />
        		<MapboxGL.ShapeSource id='markers_shapesource' shape={{type:'Point', coordinates: position}}>
					<MapboxGL.SymbolLayer id="markers_symbollayer" style={{iconImage: require('../images/backpack.png'), iconSize: 0.1, iconAllowOverlap: true}}/>
				</MapboxGL.ShapeSource>
				{
					nearAttractions.map((attraction) => (
						<MapboxGL.ShapeSource key={attraction.id} id={attraction.name+attraction.id} shape={attraction.location} onPress={() => setCurrentAttraction(attraction)}>
							<MapboxGL.SymbolLayer id={attraction.name} style={{iconImage: `${url}/${attraction.icon_path}`, iconSize: 0.2, iconAllowOverlap: true}}/>
						</MapboxGL.ShapeSource>
					))
				}
        	</MapboxGL.MapView>
        </View>
  	);
}