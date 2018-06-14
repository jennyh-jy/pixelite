/* eslint-disable */
import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, StatusBar } from 'react-native';
import { Icon, Button, FormLabel, FormInput } from 'react-native-elements';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { GOOGLE_PLACES_API_KEY } from '../../apis';

const windowWidth = Dimensions.get('window').width;

export default class SearchStoryModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationValue: '',
      tagValue: '',
    };
  }

  cancelSearch() {
    this.setState({ locationValue: '', tagValue: '' })
    this.props.navigation.goBack();
  }

  finishSearch() {
    this.props.navigation.state.params.returnData(this.state.locationValue, this.state.tagValue);
    this.props.navigation.goBack();
  }

  render() {
    return (
      <View style={{ flex: 1, paddingTop: 25, backgroundColor: 'white' }}>
        <StatusBar
          barStyle='dark-content'
        />
        <View style={{ position: 'relative', width: windowWidth, height: 30 }}>
          <View style={{ position: 'absolute', left: 8, justifyContent: 'center', alignItems: 'flex-start', width: 25, height: 25, zIndex: 10 }}>
            <Icon
              type="material-community"
              name="close"
              color="grey"
              size={23}
              onPress={() => this.cancelSearch()}
            />
          </View>
          <TouchableOpacity
            style={{ position: 'absolute', right: 15, justifyContent: 'center', alignItems: 'flex-end', width: 55, height: 24 }}
            onPress={() => this.finishSearch()}
          >
            <Text style={{ fontFamily: 'Avenir', fontSize: 17, fontWeight: 'bold', color: '#2d2d2d' }}>
              Search
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ position: 'relative', width: windowWidth }}>
          <Text style={{
            fontFamily: 'Avenir', fontSize: 15, color: '#373535', marginTop: 15, marginBottom: 3,
            marginLeft: 20, marginRight: 20
          }}>
            Where?
          </Text>

          <GooglePlacesAutocomplete
            placeholder='Search cities, countries or any specific place'
            minLength={2} // minimum length of text to search
            autoFocus={false}
            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            listViewDisplayed='auto'    // true/false/undefined
            fetchDetails={true}
            renderDescription={(row) => row.description} // custom description render
            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
              // console.log(data);
              // console.log(details);
              this.setState({ locationValue: data.description.split(', ')[0] });
            }}
            getDefaultValue={() => {
              return ''; // text input default value
            }}
            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: GOOGLE_PLACES_API_KEY,
              language: 'en', // language of the results
              types: 'establishment|geocode', // default: 'geocode'
            }}
            styles={{
              container: {
                flex: 0,
                marginTop: 2,
                marginLeft: 20,
                marginRight: 20,
                zIndex: 2,
                backgroundColor: 'white'
              },
              description: {
                fontWeight: 'bold',
                fontFamily: 'Avenir',
              },
              textInputContainer: {
                height: 30,
                borderTopWidth: 0,
                borderBottomWidth: 0.8,
                backgroundColor: 'transparent',
              },
              textInput: {
                fontFamily: 'Avenir',
                borderRadius: 0,
                paddingLeft: 5,
                paddingRight: 5,
                marginTop: 0,
                marginLeft: 0,
                marginRight: 0,
              },
            }}
            nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
            debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
          />
          <View style={{ position: 'absolute', top: 75 }}>
            <FormLabel
              fontFamily='Avenir'
              labelStyle={{ fontSize: 15, color: '#373535', fontWeight: 'normal' }}
            >
              What are you interested in?
            </FormLabel>
            <FormInput
              containerStyle={{ borderBottomWidth: 0.8, borderBottomColor: '#b5b5b5', width: 335, height: 33 }}
              inputStyle={{ fontFamily: 'Avenir', fontSize: 15, color: 'black', paddingLeft: 5, paddingRight: 5, paddingTop: 4.5, paddingBottom: 9 }}
              placeholder='e.g. sports, mountains, food...'
              placeholderTextColor='#A8A8A8'
              value={this.state.tagValue}
              onChangeText={(tagValue) => this.setState({tagValue})}
              maxLength={35}
              selectionColor={'#4286f4'}
            />
          </View>
        </View>
        <View style={{ position: 'absolute', top: 255, width: windowWidth, marginLeft: 20, marginRight: 20, zIndex: -1 }}>
          <Text style={{
            fontFamily: 'Avenir', fontSize: 15, fontWeight: 'bold', color: '#373535'
          }}>
            Trending locations
          </Text>
          <View style={{ marginLeft: 10, marginTop: 10 }}>
            <View style={{ flexDirection: 'row', marginBottom: 7 }}>
              <Icon
                type="simple-line-icon"
                name="location-pin"
                color="#373535"
                size={16}
              />
              <Text style={{
                fontFamily: 'Avenir', fontSize: 15, color: '#373535', marginLeft: 5
              }}>
                Rome, Italy
              </Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 7 }}>
              <Icon
                type="simple-line-icon"
                name="location-pin"
                color="#373535"
                size={16}
              />
              <Text style={{
                fontFamily: 'Avenir', fontSize: 15, color: '#373535', marginLeft: 5
              }}>
                San Francisco, USA
              </Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 7 }}>
              <Icon
                type="simple-line-icon"
                name="location-pin"
                color="#373535"
                size={16}
              />
              <Text style={{
                fontFamily: 'Avenir', fontSize: 15, color: '#373535', marginLeft: 5
              }}>
                Ko Samui, Thailand
              </Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 7 }}>
              <Icon
                type="simple-line-icon"
                name="location-pin"
                color="#373535"
                size={16}
              />
              <Text style={{
                fontFamily: 'Avenir', fontSize: 15, color: '#373535', marginLeft: 5
              }}>
                Queenstown, New Zealand
              </Text>
            </View>
          </View>

          <Text style={{
            fontFamily: 'Avenir', fontSize: 15, fontWeight: 'bold', color: '#373535', marginTop: 40
          }}>
            Trending keywords
          </Text>
          <View style={{ marginLeft: 10, marginTop: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 7 }}>
              <Icon
                type="material-community"
                name="beach"
                color="#373535"
                size={22}
              />
              <Text style={{
                fontFamily: 'Avenir', fontSize: 15, color: '#373535', marginLeft: 7.5
              }}>
                Beach
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 7, marginLeft: 4 }}>
              <Icon
                type="ionicon"
                name="ios-baseball-outline"
                color="#373535"
                size={20}
              />
              <Text style={{
                fontFamily: 'Avenir', fontSize: 15, color: '#373535', marginLeft: 9
              }}>
                Baseball
              </Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 7, marginLeft: 5 }}>
              <Icon
                type="ionicon"
                name="ios-snow-outline"
                color="#373535"
                size={22}
              />
              <Text style={{
                fontFamily: 'Avenir', fontSize: 15, color: '#373535', marginLeft: 10, marginTop: 1.5
              }}>
                Skiing
              </Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 7, marginLeft: 8 }}>
              <Icon
                type="ionicon"
                name="ios-wine"
                color="#373535"
                size={24}
              />
              <Text style={{
                fontFamily: 'Avenir', fontSize: 15, color: '#373535', marginLeft: 14
              }}>
                Wine
              </Text>
            </View>
          </View>

        </View>
      </View>
    );
  }
}
