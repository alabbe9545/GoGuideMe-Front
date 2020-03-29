import React, { Component, useState, useEffect } from 'react';
import { View, TextInput, Button, Image, BackHandler, Text, SafeAreaView, ScrollView, 
        ImageBackground, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {url} from './Configuration.js';
import MapboxGL from "@react-native-mapbox-gl/maps"
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
    height: 300,
    width: Dimensions.get('window').width,
  },
  map: {
    flex: 1
  }
});

export default function ZoneDescription({navigation: { goBack }, route, navigation}) {
  const [token, setToken] = useState("");
  const [attractions, setAttractions] = useState([]);
  const [center, setCenter] = useState([]);
  const [zoom, setZoom] = useState(7);
  const [attractionIcon, setAttractionIcon] = useState("");
  const [attractionPoint, setAttractionPoint] = useState("");
  const zone = route.params.zone;
  let backHandler = '';

  let polygon = {
        "type": "Polygon",
        "coordinates": [JSON.parse(zone.polygon)]
      }

  const layerStyles = {
	    fillAntialias: true,
	    fillColor: 'rgba(0, 0, 0, 0.5)',
	    fillOutlineColor: 'rgba(0, 0, 0, 0.2)',
	  }

  const calculateCentroid = (polygon) => {
	    let A = 0;
	    let cx = 0;
	    let cy = 0;
	    let xi = 0;
	    let xi1 = 0;
	    let yi = 0;
	    let yi1 = 0;

	    for (var i = 0; i < polygon.length - 1; i++) {
	        xi = polygon[i][0];
	        xi1 = polygon[i+1][0];
	        yi = polygon[i][1];
	        yi1 = polygon[i+1][1];

	        A += (xi * yi1) - (xi1 * yi);
	        cx += (xi + xi1) * ((xi*yi1) - (xi1 * yi));
	        cy += (yi + yi1) * ((xi*yi1) - (xi1 * yi));
	    }
	    A *= 0.5;
	    cx *= 1/(6*A);
	    cy *= 1/(6*A);

	    return [cx,cy];
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

  const getAttractions = () => {
    let data = {};
    if(!token) return;
    data['method'] = "GET";
    data['headers'] = {};
    data['headers']['Accept'] = 'application/json';
    data['headers']['Content-Type'] = 'application/json';
    data['headers']['Authorization'] = 'Bearer '+ token;

    let promise = fetch(url+'/api/attractions/'+zone.id, data)
      .then((response) => {
        if(response.status == 401){
          navigation.navigate('Login');
          return [];
        }
        else return response.json();
      })
      .then((responseJson) => {
        setAttractions(responseJson);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    getToken();
   	setCenter(calculateCentroid(JSON.parse(zone.polygon)));
    backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      goBack();
      return true;
    });

    return function cleanUp(){backHandler.remove();}; 
  }, []);

  useEffect(() => {
    getAttractions();
  }, [token]);

  const renderAttraction = () => {
  	if(attractionPoint != ""){
        return (<MapboxGL.ShapeSource id='markers_shapesource' shape={attractionPoint}>
			<MapboxGL.SymbolLayer id="markers_symbollayer" style={{iconImage: attractionIcon, iconSize: 0.2}}/>
		</MapboxGL.ShapeSource>)
	}
  }

  return (
    <ImageBackground source={{uri: `${url}/${zone.foto_path}`}} style={{width: '100%', height: '100%'}}>
      <View style={{ backgroundColor:'rgba(0,0,0, 0.8)', width: '100%', height: '100%' }}>
        <SafeAreaView>
          <NavigationBar leftButton={{title: 'Back',handler: () => goBack()}} title={{title: 'GoGuideMe'}}/>
          <ScrollView>
            <View >
              <View>
                <Text style={{ textAlign: 'center', fontSize: 40, color: 'white' }}>{zone.name}</Text>
                <Text style={{ textAlign: 'center', color: 'white' }}>{zone.description}</Text>
              </View>
              <View style={{ borderBottomColor: 'white', borderBottomWidth: 1 }} />
              <Text style={{ textAlign: 'center', fontSize: 24, color: 'white' }}>Attractions</Text>
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
                {attractions.map((attraction)=>(
                  <TouchableOpacity key={attraction.name+attraction.id} 
                  	onPress={()=>{setAttractionPoint(attraction.location);setAttractionIcon(`${url}/${attraction.icon_path}`); setZoom(15); setCenter(attraction.location.coordinates) }}>
                    <View style={{ display: 'flex', flexDirection: 'column' }} >
                      <Text style = {{ fontWeight: 'bold', textAlign: 'center', color: 'white' }}>{attraction.name}</Text>
                      <Image source={{uri: `${url}/${attraction.foto_path}`}} style={{ width: 50, height: 50, borderRadius: 50 }} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.page}>
		        <View style={styles.container}>
		        	<MapboxGL.MapView style={styles.map}>
		        		<MapboxGL.Camera zoomLevel={zoom} centerCoordinate={center} />
			            <MapboxGL.ShapeSource id='polygonSource' shape={polygon}>
			              <MapboxGL.FillLayer id='polygonSourceFill' style={layerStyles} />
			            </MapboxGL.ShapeSource> 
			            {
			            	renderAttraction()
      					}
		        	</MapboxGL.MapView>
		        </View>
		    </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
} 
