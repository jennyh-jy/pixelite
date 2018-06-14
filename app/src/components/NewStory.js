/* eslint-disable no-whitespace-before-property, arrow-parens, react/jsx-filename-extension, max-len */
// REACT NATIVE IMPORTS
import React, { Component } from 'react';
import { Platform, View, Text, TextInput, ImageBackground, NativeModules, CameraRoll, Modal, StatusBar, Dimensions, Alert } from 'react-native';
import { Icon, Button, FormLabel, FormInput, Divider } from 'react-native-elements';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import ParallaxScrollView from 'react-native-parallax-scroll-view';

import PhotoGrid from './PhotoGrid';
import StoryMapModal from './StoryMapModal';
import { GOOGLE_PLACES_API_KEY } from '../../apis';

// REDUX IMPORTS & AUTH
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as NewStoryActions from '../actions';
import * as firebase from 'firebase';


const ImagePicker = NativeModules.ImageCropPicker;
const windowWidth = Dimensions.get('window').width;

class NewStory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      cityEntered: false,
    };
  }

  componentDidMount() {
    const userFirebase = firebase.auth().currentUser;
    const user = { uid: userFirebase.uid, email: userFirebase.email };
    this.setState({ user: user });
    console.log('user information from Firebase: ', user);
  }

  formattedDate(timestamp) {
    const day = timestamp.getDate().toString();
    const month = timestamp.toString().split(' ')[1];
    const year = timestamp.getFullYear().toString();
    return `${day} ${month} ${year}`;
  }

  pickMultiple() {
    const firstAdd = this.props.dates.length === 0 ? true : false; // Is it the first time?
    if ((this.state.cityEntered === false && firstAdd)) {
      Alert.alert(
        'Waaaaiiittt a moment',
        'Have you forgot to select a city? \nTell others wonders of your location!'
      );
      return;
    }
    if (Platform.OS === 'android') {
      ImagePicker.openPicker({
        multiple: true,
        maxFiles: 20,
        waitAnimationEnd: false,
        includeExif: true,
      }).then(res => {
        const selectedPhotos = res;
        console.log('this is the res : ', res);
        const redefinedPhotos = selectedPhotos.map(photo => {
          const datetime = photo.exif.DateTime.split(' ')[0].split(':').map((e,i) => { return i === 1 ? Number(e) - 1 : Number(e) });
          console.log(datetime);
          return {
            url: photo.path,
            width: photo.width,
            height: photo.height,
            date: this.formattedDate(new Date((new Date()).setFullYear(...datetime))),
            location: null,
          };
        })

        const nextSelectedPhotos = Object.assign({}, this.props.selectedPhotos);

        redefinedPhotos.forEach((photo) => {
          const androidFunc = (element) => element.url === photo.url;
          if (!Object.prototype.hasOwnProperty.call(nextSelectedPhotos, photo.date)) {
            nextSelectedPhotos[photo.date] = [];
          }
          if (!nextSelectedPhotos[photo.date].find(androidFunc)) {
            nextSelectedPhotos[photo.date].push(photo);
          }
        });

        console.log('From android : ',  nextSelectedPhotos);
        this.props.newStoryGetPhotos(nextSelectedPhotos, firstAdd);
      }).catch(err => console.log(err));
    } else {
      //WHEN PLATFORM IS IOS
      Promise.all([
        CameraRoll.getPhotos({
          first: 1000,
        }),
        ImagePicker.openPicker({
          multiple: true,
          maxFiles: 20,
          waitAnimationEnd: false,
          includeExif: true,
        }),
      ]).then(res => {
        const allPhotos = res[0].edges;
        const selectedPhotos = res[1];
        const redefinedPhotos = selectedPhotos.map((photo) => {
          const { timestamp } = allPhotos.find((item) => {
            return item.node.image.filename === photo.filename;
          }).node;

          return {
            filename: photo.filename,
            url: photo.path,
            width: photo.width,
            height: photo.height,
            date: this.formattedDate(new Date(timestamp * 1000)),
            location: null,
          };
        });

        const nextSelectedPhotos = Object.assign({}, this.props.selectedPhotos);

        redefinedPhotos.forEach((photo) => {
          const iosFunc = (element) => element.filename === photo.filename;
          if (!Object.prototype.hasOwnProperty.call(nextSelectedPhotos, photo.date)) {
            nextSelectedPhotos[photo.date] = [];
          }
          if (!nextSelectedPhotos[photo.date].find(iosFunc)) {
            nextSelectedPhotos[photo.date].push(photo);
          }
        });

        this.props.newStoryGetPhotos(nextSelectedPhotos, firstAdd);
      }).catch(err => console.log(err));
    }
  }

  toggleStoryMap() {
    this.props.newStoryToggleStoryMap(this.props.isStoryMapClicked);
  }

  toggleEditable() {
    this.props.newStoryToggleEditable(this.props.isTextEditable);
  }

  toggleStory() {
    this.props.newStoryToggleStory();
  }

  cancelNewStory() {
    this.props.navigation.goBack();
    this.props.clearEverything();
  }

  cancelCityEntered() {
    this.setState({
      cityEntered: false,
    })
  }

  render() {
    const { dates, isStoryMapClicked, arePhotosSelected, isTextEditable, selectedPhotos, coverPhotoUrl, selectedCity, selectedCountry, travelPeriod, titleValue, textValue } = this.props;
    return (
      <View style={{ flex: 1, paddingTop: 25, backgroundColor: 'white' }}>
{/*FIRST PAGE HEADING*/}
        <View style={{ position: 'relative', width: windowWidth, height: 40 }}>
          <View style={{ position: 'absolute', left: 8, justifyContent: 'center', alignItems: 'flex-start', width: 25, height: 25, zIndex: 10 }}>
            <Icon
              type="material-community"
              name="close"
              color="grey"
              size={23}
              onPress={() => this.cancelNewStory()}
            />
          </View>
          <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center', width: windowWidth, height: 40 }}>
            <Text style={{ fontFamily: 'Avenir', fontSize: 20, color: '#2d2d2d' }}>
              Create Story
            </Text>
          </View>
        </View>
 {/*FIRST PAGE INPUTS*/}
        <View style={{ position: 'relative', width: windowWidth }}>
          <FormLabel
            fontFamily='Avenir'
            labelStyle={{ fontSize: 15, color: '#373535', fontWeight: 'normal' }}
          >
            Story Title
          </FormLabel>
          <FormInput
            containerStyle={{ borderBottomWidth: 0.8, borderBottomColor: '#b5b5b5', height: 33 }}
            inputStyle={{ fontFamily: 'Avenir', fontSize: 15, color: 'black', paddingLeft: 5, paddingRight: 5, paddingTop: 4.5, paddingBottom: 9 }}
            placeholder='e.g. Summer escapades in Australia'
            placeholderTextColor='#A8A8A8'
            value={titleValue}
            onChangeText={(titleValue) => this.props.newStoryChangeTitleInput(titleValue)}
            maxLength={35}
            selectionColor={'#4286f4'}
          />
          <Text style={{
            fontFamily: 'Avenir', fontSize: 15, color: '#373535', marginTop: 15, marginBottom: 3,
            marginLeft: 20, marginRight: 20
          }}>
            Where did you travel to?
          </Text>
          {/* FIRST PAGE GOOGLE autocomplete */}
          <GooglePlacesAutocomplete
            ref={(googleAuto) => this.googleAuto = googleAuto }
            cancelCityEntered={this.cancelCityEntered.bind(this)}
            placeholder='Search cities'
            minLength={2} // minimum length of text to search
            autoFocus={false}
            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            listViewDisplayed='auto'    // true/false/undefined
            fetchDetails={true}
            renderDescription={(row) => row.description} // custom description render
            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
              const locationInfo = {
                selectedCity: data.description.split(', ')[0],
                selectedCountry: data.description.split(', ')[data.description.split(', ').length - 1],
                selectedCoordinates: {
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                }
              };
              this.props.newStoryGooglePlacesAtuocomplete(locationInfo);
              this.setState({ cityEntered: true });
            }}
            getDefaultValue={() => {
              return ''; // text input default value
            }}
            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: GOOGLE_PLACES_API_KEY,
              language: 'en', // language of the results
              types: '(cities)', // default: 'geocode'
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
{/*First Page ImageClick BTN*/}
          <View style={{ position: 'absolute', top: 200, alignSelf: 'center' }}>
            <Button
              icon={{ name: 'ios-images-outline', size: 45, color: '#5b5959', type: 'ionicon', style: { marginRight: 0 } }}
              buttonStyle={{ alignItems: 'center', width: 300, height: 75, flexDirection: 'column', padding: 0, margin: 0, zIndex: -1 }}
              color='#5b5959'
              backgroundColor="white"
              fontFamily="Avenir"
              fontSize={15}
              title="Add photos, and you'll see magic!"
              onPress={() => this.pickMultiple()}
            />
          </View>
        </View>
{/*MODAL STARTS*/}
        <Modal
          animationType="fade"
          transparent={false}
          onRequestClose={() => { }}
          visible={arePhotosSelected}
        >
{/*ParallaxScrollView STARTS*/}
          <ParallaxScrollView
            headerBackgroundColor="#333"
            stickyHeaderHeight={63}
            parallaxHeaderHeight={350}
            backgroundSpeed={3}
            renderBackground={() => (
              <View key="background">
                <ImageBackground
                  source={{uri: coverPhotoUrl }}
                  style={{ width: windowWidth, height: 350, zIndex: -1}}
                >
                  <View style={{position: 'absolute',
                                top: 0,
                                width: windowWidth,
                                backgroundColor: 'rgba(0,0,0,.4)',
                                height: 350,
                                zIndex: 1}}/>

                  <View key="parallax-header" style={{
                    alignItems: 'center',
                    flex: 1,
                    flexDirection: 'column',
                    paddingTop: 110,
                    zIndex: 10
                  }}>
                  <Text style={{
                    color: 'white',
                    fontSize: 11,
                    fontWeight: 'bold',
                    paddingBottom: 7,
                    fontFamily: 'Avenir',
                    backgroundColor: 'transparent',
                  }}>
                    {selectedCity === selectedCountry
                      ? selectedCity.toUpperCase()
                      : selectedCity.toUpperCase().concat(', ').concat(selectedCountry.toUpperCase())}
                  </Text>
                  <View style={{ justifyContent: 'center', paddingVertical: 7 }}>
                    <Text style={{
                      color: 'white',
                      fontSize: 23,
                      fontWeight: 'bold',
                      paddingVertical: 5,
                      fontFamily: 'Avenir',
                      backgroundColor: 'transparent',
                      textAlign: 'center',
                      width: 300, flexWrap: 'wrap'
                    }}>
                      {titleValue.toUpperCase()}
                    </Text>
                  </View>
                    <Text style={{
                      color: 'white',
                      fontSize: 12,
                      paddingTop: 5,
                      fontFamily: 'AvenirNext-Italic',
                      backgroundColor: 'transparent',
                    }}>
                      {travelPeriod}
                    </Text>
                  </View>
                </ImageBackground>
              </View>
            )}

            renderForeground={() => (
//THREE ICONS TOP
              <View style={{ flexDirection: 'row', justifyContent: 'center', position: 'absolute', top: 295, width: '100%' }}>
                <View style={{ alignItems: 'center', marginHorizontal: 7,
                  backgroundColor: 'transparent' }}>
                  <Icon
                    type="simple-line-icon"
                    name="map"
                    size={18}
                    color="white"
                    iconStyle={{ textAlign: 'center', paddingTop: 11, paddingBottom: 8, paddingHorizontal: 11, borderRadius: 20.5, borderWidth: 1, borderColor: '#b3adad' }}
                    onPress={() => this.toggleStoryMap()}
                  />
                </View>
                <View style={{ alignItems: 'center', marginHorizontal: 7,
                  backgroundColor: 'transparent' }}>
                  <Icon
                    type="simple-line-icon"
                    name="picture"
                    size={18}
                    color="white"
                    iconStyle={{ textAlign: 'center', paddingTop: 11, paddingBottom: 8, paddingHorizontal: 11, borderRadius: 20.5, borderWidth: 1, borderColor: '#b3adad' }}
                    onPress={() => this.pickMultiple()}
                  />
                </View>
                <View style={{ alignItems: 'center', marginHorizontal: 7,
                  backgroundColor: 'transparent' }}>
                  <Icon
                    type="material-community"
                    name="format-text"
                    size={18}
                    color="white"
                    iconStyle={{ textAlign: 'center', paddingTop: 11, paddingBottom: 8, paddingHorizontal: 11, borderRadius: 20.5, borderWidth: 1, borderColor: '#b3adad' }}
                    onPress={() => this.toggleEditable()}
                  />
                </View>
              </View>
            )}

            renderStickyHeader={() => (
              <View key="sticky-header" style={{
                width: windowWidth - 70,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                paddingTop: 27
              }}>
                <Text style={{
                  color: 'white',
                  fontSize: 18,
                  fontFamily: 'Avenir'
                }}>{titleValue}</Text>
              </View>
            )}

            renderFixedHeader={() => (
              <View style={{ position: 'absolute', top: 0, flexDirection: 'row' }}>
                <StatusBar
                  barStyle='light-content'
                />
                <View style={{ flex: 1, alignItems: 'flex-start', top: 25, left: 8 }}>
                  <Icon
                    type="material-community"
                    name="arrow-left"
                    color="white"
                    size={26}
                    onPress={() => this.toggleStory()}
                  />
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end', top: 25, right: 12 }}>
                  <Icon
                    type="material-community"
                    name="check"
                    color="white"
                    size={28}
                    onPress={() => Alert.alert(
                      'Upload story',
                      'Are you sure you want to upload this story?', [{
                        text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'
                      }, {
                        text: 'Yes', onPress: () => {
                          this.props.newStoryCreateStory(this.props);
                          this.props.clearEverything();
                          this.props.navigation.navigate('Profile');
                          console.log('uploaded!');
                        }
                      }]
                    )}
                  />
                </View>
              </View>
            )}>
{/* Actual Content starts */}
            <View style={{ marginVertical: 20 }}>
{/* Map Modal */}
              <Modal
                animationType="fade"
                transparent={false}
                onRequestClose={() => { }}
                visible={isStoryMapClicked}
              >
                <StoryMapModal
                  toggleStoryMap={this.toggleStoryMap.bind(this)}
                  locations={this.props.locations}
                  regionCoordinates={this.props.selectedCoordinates}
                />
              </Modal>
{/* isTextEditable */}
              {!isTextEditable
                ? <View style={{ alignItems: 'center', alignSelf: 'center', width: windowWidth - 50 }}>
                    <Text style={{ color: '#282626', fontFamily: 'Avenir', fontSize: 14, textAlign: 'center' }}>
                      {textValue}
                    </Text>
                    {textValue === ''
                      ? null
                      : <Divider style={{ width: 20, height: 3, backgroundColor: '#f7d074', marginTop: 15, marginBottom: 25 }} />
                    }
                  </View>
                : <View style={{ justifyContent: 'flex-start', alignSelf: 'center', width: windowWidth - 30, height: 120, marginTop: 5, marginLeft: 20 }}>
                    <TextInput
                      style={{ width: windowWidth - 50, height: 100, borderColor: '#b5b5b5', borderWidth: 1, fontSize: 14,
                              fontFamily: 'Avenir', padding: 10 }}
                      placeholder='Add text...'
                      onChangeText={(textValue) => this.props.newStoryChangeTextEditableInput(textValue)}
                      value={textValue}
                      editable={isTextEditable}
                      multiline={true}
                      maxLength={300}
                    />
                    <View style={{ justifyContent: 'center', position: 'absolute', backgroundColor: 'white', top: 85, right: 10, width: 30, height: 30 }}>
                      <Icon
                        type="material-community"
                        name="check"
                        color="#53bc78"
                        size={23}
                        onPress={() => this.toggleEditable()}
                      />
                    </View>
                  </View>
                }
{/*PHOTO CONTENTS */}
                {
                  dates.map(date => (
                    <View key={`entireView-${date}`} style={{ marginBottom: 18 }}>
                      <View key={`dateTextView-${date}`} style={{ flexDirection: 'column' }}>
                        <Text style={{ color: '#595757', fontWeight: 'bold', fontFamily: 'AvenirNext-Italic', fontSize: 13, marginLeft: 20, marginBottom: 4 }}>{date}</Text>
                        <Divider style={{ width: 15, height: 2, backgroundColor: '#595757', marginLeft: 20, marginBottom: 20 }} />
                      </View>
                      <PhotoGrid
                        allPhotosla={selectedPhotos}
                        photosList={selectedPhotos[date]}
                        datesFromNewStory={dates}
                      />
                    </View>
                  ))
                }

            </View>
          </ParallaxScrollView>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = ({ auth, newStory, PhotoGrid }) => {
  const { user } = auth;
  return { user, ...newStory, ...PhotoGrid };
}

const matchDispatchToProps = dispatch => bindActionCreators(NewStoryActions, dispatch);

export default connect(mapStateToProps, matchDispatchToProps)(NewStory);
