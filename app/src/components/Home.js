/* eslint-disable */
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  Image,
  ImageBackground,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Modal,
  StatusBar
} from 'react-native';

import { Icon, SearchBar, Divider } from "react-native-elements";
import axios from 'react-native-axios';

import EachStory from './EachStory';

const sampleStories1 = [{
  title: "Honeymoon in Africa",
  city: "Cape Town",
  country: "South Africa",
  coordinates: {
    latitude: -33.9248685,
    longitude: 18.4240553,
  },
  travelPeriod: "24-30 Sep 2013",
  coverPhotoUrl: "https://images.fineartamerica.com/images-medium-large/lions-head-sunset-johaar-bassier.jpg",
}, {
  title: "Backpacking in Straya",
  city: "Melbourne",
  country: "Australia",
  coordinates: {
    latitude: -37.81361100000001,
    longitude: 144.963056,
  },
  travelPeriod: "20-27 Dec 2016",
  coverPhotoUrl: "https://www.realestate.com.au/neighbourhoods/content/suburb/editorial/vic/melbourne-3000/intro01-2.jpg",
}, {
  title: "Japan with besties",
  city: "Tokyo",
  country: "Japan",
  coordinates: {
    latitude: 35.7090259,
    longitude: 139.7319925,
  },
  travelPeriod: "30 Jul - 15 Aug 2017",
  coverPhotoUrl: "https://shoutem.github.io/static/getting-started/restaurant-3.jpg",
}, {
  title: "Hola como estas",
  city: "Rio de Janeiro",
  country: "Brazil",
  coordinates: {
    latitude: -22.9068467,
    longitude: -43.17289650000001,
  },
  travelPeriod: "2 Feb - 4 Mar 2014",
  coverPhotoUrl: "https://cache-graphicslib.viator.com/graphicslib/thumbs360x240/2484/SITours/corcovado-mountain-and-christ-redeemer-statue-half-day-tour-in-rio-de-janeiro-128058.jpg",
}, {
  title: "First time in Spain",
  city: "Madrid",
  country: "Spain",
  coordinates: {
    latitude: 40.4167754,
    longitude: -3.7037902,
  },
  travelPeriod: "15-28 Jan 2016",
  coverPhotoUrl: "https://www.amawaterways.com/Assets/CruiseGallery/Large/provencespain_barcelona_parcguell_ss_407568172_gallery.jpg",
}, {
  title: "Back home",
  city: "Seoul",
  country: "South Korea",
  coordinates: {
    latitude: 37.566535,
    longitude: 126.9779692,
  },
  travelPeriod: "17 Jul - 14 Oct 2017",
  coverPhotoUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Seoul-Namdaemun-at.night-02.jpg",
}];

const sampleStories2 = [{
  title: "First time in Spain",
  city: "Madrid",
  country: "Spain",
  coordinates: {
    latitude: 40.4167754,
    longitude: -3.7037902,
  },
  travelPeriod: "15-28 Jan 2016",
  coverPhotoUrl: "https://www.amawaterways.com/Assets/CruiseGallery/Large/provencespain_barcelona_parcguell_ss_407568172_gallery.jpg",
}, {
  title: "Hola como estas",
  city: "Rio de Janeiro",
  country: "Brazil",
  coordinates: {
    latitude: -22.9068467,
    longitude: -43.17289650000001,
  },
  travelPeriod: "2 Feb - 4 Mar 2014",
  coverPhotoUrl: "https://cache-graphicslib.viator.com/graphicslib/thumbs360x240/2484/SITours/corcovado-mountain-and-christ-redeemer-statue-half-day-tour-in-rio-de-janeiro-128058.jpg",
}, {
  title: "Honeymoon in Africa",
  city: "Cape Town",
  country: "South Africa",
  coordinates: {
    latitude: -33.9248685,
    longitude: 18.4240553,
  },
  travelPeriod: "24-30 Sep 2013",
  coverPhotoUrl: "https://images.fineartamerica.com/images-medium-large/lions-head-sunset-johaar-bassier.jpg",
}, {
  title: "Back home",
  city: "Seoul",
  country: "South Korea",
  coordinates: {
    latitude: 37.566535,
    longitude: 126.9779692,
  },
  travelPeriod: "17 Jul - 14 Oct 2017",
  coverPhotoUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Seoul-Namdaemun-at.night-02.jpg",
}, {
  title: "Japan with besties",
  city: "Tokyo",
  country: "Japan",
  coordinates: {
    latitude: 35.7090259,
    longitude: 139.7319925,
  },
  travelPeriod: "30 Jul - 15 Aug 2017",
  coverPhotoUrl: "https://shoutem.github.io/static/getting-started/restaurant-3.jpg",
}, {
  title: "Backpacking in Straya",
  city: "Melbourne",
  country: "Australia",
  coordinates: {
    latitude: -37.81361100000001,
    longitude: 144.963056,
  },
  travelPeriod: "20-27 Dec 2016",
  coverPhotoUrl: "https://www.realestate.com.au/neighbourhoods/content/suburb/editorial/vic/melbourne-3000/intro01-2.jpg",
}, ];

const sampleKeywords = [{
  keyword: "Hiking",
  imgUrl: "https://media.deseretdigital.com/file/3ae0ba3723?type=jpeg&quality=55&c=15&a=4379240d",
}, {
  keyword: "Paragliding",
  imgUrl: "https://s3.us-east-2.amazonaws.com/pixelite-s3/Paragliding.png",
}, {
  keyword: "Mountain Biking",
  imgUrl: "https://coresites-cdn.factorymedia.com/dirt_new/wp-content/uploads/2016/12/Bikes-2.jpg",
}, {
  keyword: "Surfing",
  imgUrl: "https://s3.us-east-2.amazonaws.com/pixelite-s3/Surfing.png",
}, {
  keyword: "Beach",
  imgUrl: "https://s3.us-east-2.amazonaws.com/pixelite-s3/beach.jpeg",
}, {
  keyword: "Spa",
  imgUrl: "https://static1.squarespace.com/static/537e219be4b09a8e64d98900/54337e7fe4b0b2ef9c4fc56e/54377983e4b0e78dea9153e3/1412921745441/image+4.jpg?format=500w",
}, {
  keyword: "Bar",
  imgUrl: "https://s3.us-east-2.amazonaws.com/pixelite-s3/bar1.png",
}];

const sampleLocations = [{
  location: "Sydney",
  imgUrl: "https://s3.us-east-2.amazonaws.com/pixelite-s3/Sydney.png",
}, {
  location: "London",
  imgUrl: "https://i.pinimg.com/originals/2c/3e/30/2c3e3003fe88674494d275cceb924b1e.jpg",
}, {
  location: "New York",
  imgUrl: "https://s3.us-east-2.amazonaws.com/pixelite-s3/New+York.png",
}, {
  location: "Tokyo",
  imgUrl: "https://i.pinimg.com/474x/9a/27/97/9a279707fc54fdb714cf95d8acc59eba--places-to-go-best-places-to-visit.jpg",
}, {
  location: "Maldives",
  imgUrl: "https://s3.us-east-2.amazonaws.com/pixelite-s3/Maldives.jpg",
}, {
  location: "India",
  imgUrl: "https://s3.us-east-2.amazonaws.com/pixelite-s3/India.png",
}, {
  location: "Turkey",
  imgUrl: "https://s3.us-east-2.amazonaws.com/pixelite-s3/Turkey+air+balloons.jpg",
}];

const windowWidth = Dimensions.get('window').width;

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEachStoryClicked: false,
      stories1: sampleStories1,
      stories2: sampleStories2,
      searchedStories: [],
      keywords: sampleKeywords,
      locations: sampleLocations,
      locationValue: '',
      tagValue: '',
      clickedStoryIndex: null,
    }
  }

  returnData(location, tag) {
    const sendInfo = {
      tag,
      location,
    }

    axios.post('http://localhost:5000/searchQuery', sendInfo)
    .then(res => {
      console.log(res);
      this.setState({
        searchedStories: res.data,
      })
    })
    .catch(err => console.log(err))

    this.setState({ locationValue: location, tagValue: tag });
  }

  clearSearchResults() {
    this.setState({ locationValue: '', tagValue: '' });
  }

  toggleSearchModal() {
    this.props.navigation.navigate('SearchStoryModal', {returnData: this.returnData.bind(this)});
  }

  toggleEachStoryModal() {
    this.setState({ isEachStoryClicked: !this.state.isEachStoryClicked });
  }

  render() {
    const { locationValue, tagValue } = this.state;
    console.log('location:', this.state.locationValue);
    console.log('tag:', this.state.tagValue);
    console.log('clickedStoryIndex: ', this.state.clickedStoryIndex)
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <StatusBar
          barStyle='dark-content'
        />
        <Modal
          animationType="fade"
          transparent={false}
          onRequestClose={() => { }}
          visible={this.state.isEachStoryClicked}
        >
          <EachStory
            selectedStory={this.state.searchedStories[this.state.clickedStoryIndex]}
            toggleModal={() => this.toggleEachStoryModal()}
          />
        </Modal>
        <View style={{ paddingTop: 22 }}>
        {locationValue !== '' || tagValue !== ''
          ? // AT LEAST ONE OF THE TWO HAS BEEN SELECTED
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
              <View style={{ position: 'absolute', left: 8, justifyContent: 'center', alignItems: 'flex-start', width: 30, height: 30, zIndex: 10 }}>
                <Icon
                  type="simple-line-icon"
                  name="arrow-left"
                  color="#373535"
                  size={24}
                  onPress={() => this.clearSearchResults()}
                />
              </View>
              <Text style={{ fontFamily: 'Avenir', fontSize: 20, color: '#373535', fontWeight: 'bold', marginLeft: 45 }}>
                Stories about...
              </Text>
            </View>
            <View style={{ marginLeft: 30, marginTop: 15, marginBottom: 15 }}>
            {locationValue !== ''
              ?
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <Icon
                  type="simple-line-icon"
                  name="location-pin"
                  color="#757373"
                  size={22}
                />
                <Text style={{
                  fontFamily: 'Avenir', fontSize: 14, color: '#757373', marginLeft: 12
                }}>
                  {locationValue}
                </Text>
              </View>
              : null}

            {tagValue !== ''
              ?
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                <Icon
                  type="simple-line-icon"
                  name="picture"
                  color="#757373"
                  size={22}
                />
                <Text style={{
                  fontFamily: 'Avenir', fontSize: 14, color: '#757373', marginLeft: 13
                }}>
                  {tagValue}
                </Text>
              </View>
              : null}
            </View>
          </View>
          : // WHEN NONE OF LOCATIONS AND TAGS HAS BEEN SELECTED
          <SearchBar
            lightTheme
            round
            containerStyle={{ backgroundColor: 'white', borderTopWidth: 0, borderBottomWidth: 0, zIndex: 1 }}
            inputStyle={{ height: 33, borderRadius: 16.5, backgroundColor: 'white', borderWidth: 1, borderColor: '#b5b5b5', fontFamily: 'Avenir', fontSize: 15, color: 'black' }}
            placeholder='Search stories'
            placeholderTextColor='#A8A8A8'
            onFocus={() => this.toggleSearchModal()}
            // onSubmitEditing={this.searchText.bind(this)}
          />
        }
        </View>

        <ScrollView>
        {locationValue !== '' || tagValue !== ''
          ? // search results
          <View>
            <FlatList
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index}
              data={this.state.searchedStories}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity onPress={() => {this.toggleEachStoryModal(); this.setState({clickedStoryIndex: index})}}>
                    <ImageBackground
                      style={{ marginTop: windowWidth * 0.03, marginHorizontal: windowWidth * 0.03, width: windowWidth * 0.94, height: 150, zIndex: -1}}
                      source={{uri: item.coverPhotoUrl}}
                    >
                      <View style={{width: windowWidth * 0.94, height: 150, backgroundColor: 'rgba(0,0,0,.4)', zIndex: 1}}/>
                      <View style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        paddingTop: 15,
                        paddingHorizontal: 10,
                        backgroundColor: 'transparent',
                        alignItems: 'flex-start',
                        width: windowWidth * 0.94,
                        height: 150,
                        flexDirection: 'column',
                        zIndex: 5
                      }}>
                        <Text style={{
                          color: 'white',
                          fontSize: 10,
                          fontWeight: 'bold',
                          fontFamily: 'Avenir',
                          backgroundColor: 'transparent',
                        }}>
                          {item.city === item.country
                            ? item.city.toUpperCase()
                            : item.city.toUpperCase().concat(', ').concat(item.country.toUpperCase())}
                        </Text>
                        <Text style={{
                          position: 'absolute',
                          bottom: 32,
                          left: 10,
                          color: 'white',
                          fontSize: 16,
                          fontWeight: 'bold',
                          fontFamily: 'Avenir',
                          backgroundColor: 'transparent',
                          textAlign: 'left',
                          flexWrap: 'wrap'
                        }}>
                          {item.title.toUpperCase()}
                        </Text>
                        <Divider style={{ width: 20, height: 1, marginTop: 3, marginLeft: 1, backgroundColor: 'white' }} />
                        <Text style={{
                          position: 'absolute',
                          bottom: 12,
                          left: 10,
                          color: 'white',
                          fontSize: 11,
                          fontFamily: 'AvenirNext-Italic',
                          backgroundColor: 'transparent',
                        }}>
                          {item.travelPeriod}
                        </Text>
                      </View>
                    </ImageBackground>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
          : // default page
          <View style={{ marginBottom: 30 }}>
            <View>
              <View style={{ marginLeft: 15, marginTop: 15, marginBottom: 10 }}>
                <Text style={{ fontFamily: 'Avenir', fontSize: 18, color: '#373535', fontWeight: 'bold' }}>
                  Stories for you
                </Text>
                <Text style={{
                  fontFamily: 'Avenir', fontSize: 14, color: '#757373'
                }}>
                  Because you searched for Skydiving
                </Text>
              </View>
              <View style={{ marginHorizontal: 10, marginBottom: 10 }}>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => index}
                  data={this.state.stories1}
                  renderItem={({ item }) => {
                    return (
                      <ImageBackground
                        style={{ marginHorizontal: windowWidth * 0.015, width: windowWidth * 0.455, height: 150, zIndex: -1}}
                        source={{uri: item.coverPhotoUrl}}
                      >
                        <View style={{width: windowWidth * 0.455, height: 150, backgroundColor: 'rgba(0,0,0,.4)', zIndex: 1}}/>
                        <View style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          paddingTop: 15,
                          paddingHorizontal: 10,
                          backgroundColor: 'transparent',
                          alignItems: 'flex-start',
                          width: windowWidth * 0.455,
                          height: 150,
                          flexDirection: 'column',
                          zIndex: 5
                        }}>
                          <Text style={{
                            color: 'white',
                            fontSize: 10,
                            fontWeight: 'bold',
                            fontFamily: 'Avenir',
                            backgroundColor: 'transparent',
                          }}>
                            {item.city === item.country
                              ? item.city.toUpperCase()
                              : item.city.toUpperCase().concat(', ').concat(item.country.toUpperCase())}
                          </Text>
                          <Text style={{
                            position: 'absolute',
                            bottom: 32,
                            left: 10,
                            color: 'white',
                            fontSize: 16,
                            fontWeight: 'bold',
                            fontFamily: 'Avenir',
                            backgroundColor: 'transparent',
                            textAlign: 'left',
                            flexWrap: 'wrap'
                          }}>
                            {item.title.toUpperCase()}
                          </Text>
                          <Divider style={{ width: 20, height: 1, marginTop: 3, marginLeft: 1, backgroundColor: 'white' }} />
                          <Text style={{
                            position: 'absolute',
                            bottom: 12,
                            left: 10,
                            color: 'white',
                            fontSize: 11,
                            fontFamily: 'AvenirNext-Italic',
                            backgroundColor: 'transparent',
                          }}>
                            {item.travelPeriod}
                          </Text>
                        </View>
                      </ImageBackground>
                    );
                  }}
                />
              </View>

              <View style={{ marginLeft: 15, marginTop: 15, marginBottom: 10 }}>
                <Text style={{
                  fontFamily: 'Avenir', fontSize: 14, color: '#757373'
                }}>
                  Because you saved stories about Spain
                </Text>
              </View>
              <View style={{ marginHorizontal: 10, marginBottom: 10 }}>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => index}
                  data={this.state.stories2}
                  renderItem={({ item }) => {
                    return (
                      <ImageBackground
                        style={{ marginHorizontal: windowWidth * 0.015, width: windowWidth * 0.455, height: 150, zIndex: -1}}
                        source={{uri: item.coverPhotoUrl}}
                      >
                        <View style={{width: windowWidth * 0.455, height: 150, backgroundColor: 'rgba(0,0,0,.4)', zIndex: 1}}/>
                        <View style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          paddingTop: 15,
                          paddingHorizontal: 10,
                          backgroundColor: 'transparent',
                          alignItems: 'flex-start',
                          width: windowWidth * 0.455,
                          height: 150,
                          flexDirection: 'column',
                          zIndex: 5
                        }}>
                          <Text style={{
                            color: 'white',
                            fontSize: 10,
                            fontWeight: 'bold',
                            fontFamily: 'Avenir',
                            backgroundColor: 'transparent',
                          }}>
                            {item.city === item.country
                              ? item.city.toUpperCase()
                              : item.city.toUpperCase().concat(', ').concat(item.country.toUpperCase())}
                          </Text>
                          <Text style={{
                            position: 'absolute',
                            bottom: 32,
                            left: 10,
                            color: 'white',
                            fontSize: 16,
                            fontWeight: 'bold',
                            fontFamily: 'Avenir',
                            backgroundColor: 'transparent',
                            textAlign: 'left',
                            flexWrap: 'wrap'
                          }}>
                            {item.title.toUpperCase()}
                          </Text>
                          <Divider style={{ width: 20, height: 1, marginTop: 3, marginLeft: 1, backgroundColor: 'white' }} />
                          <Text style={{
                            position: 'absolute',
                            bottom: 12,
                            left: 10,
                            color: 'white',
                            fontSize: 11,
                            fontFamily: 'AvenirNext-Italic',
                            backgroundColor: 'transparent',
                          }}>
                            {item.travelPeriod}
                          </Text>
                        </View>
                      </ImageBackground>
                    );
                  }}
                />
              </View>
            </View>
{/* stories for you view closed */}

            <View>
              <View style={{ marginLeft: 15, marginTop: 35, marginBottom: 10 }}>
                <Text style={{ fontFamily: 'Avenir', fontSize: 18, color: '#373535', fontWeight: 'bold' }}>
                  Popular keywords
                </Text>
              </View>
              <View style={{ marginHorizontal: 15 }}>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => index}
                  data={this.state.keywords}
                  renderItem={({ item }) => {
                    return (
                      <View style={{ width: 150 }}>
                        <Image
                          style={{ width: 150 * 0.91, height: 120, borderRadius: 5 }}
                          source={{uri: item.imgUrl}}
                        />
                        <Text style={{ fontFamily: 'Avenir', marginTop: 4, marginLeft: 3 }}>{item.keyword}</Text>
                      </View>
                    );
                  }}
                />
              </View>
            </View>
{/* popular keywords view closed */}

            <View>
              <View style={{ marginLeft: 15, marginTop: 45, marginBottom: 10 }}>
                <Text style={{ fontFamily: 'Avenir', fontSize: 18, color: '#373535', fontWeight: 'bold' }}>
                  Popular locations
                </Text>
              </View>
              <View style={{ marginHorizontal: 15 }}>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => index}
                  data={this.state.locations}
                  renderItem={({ item }) => {
                    return (
                      <View style={{ width: 140 }}>
                        <Image
                          style={{ width: 140 * 0.91, height: 150 }}
                          source={{uri: item.imgUrl}}
                        />
                        <Text style={{ fontFamily: 'Avenir', marginTop: 4, marginLeft: 3 }}>{item.location}</Text>
                      </View>
                    );
                  }}
                />
              </View>
            </View>
{/* popular locations view closed */}

          </View> // default page view closed
        }
        </ScrollView>
      </View>
    )
  }
}
