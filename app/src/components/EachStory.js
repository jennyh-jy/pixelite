/* eslint-disable no-whitespace-before-property, arrow-parens */
// REACT NATIVE IMPORTS
import React, { Component } from 'react';
import { Platform, StyleSheet, View, ScrollView, Text, TextInput, Image, ImageBackground, TouchableOpacity, NativeModules, CameraRoll, Modal, StatusBar, Dimensions, Alert } from 'react-native';
import { Icon, Button, FormLabel, FormInput, Divider } from 'react-native-elements';
// import { RNS3 } from 'react-native-aws3';
// import { GOOGLE_PLACES_API_KEY, AWS_ACCESS_KEY, AWS_SECRET_KEY } from '../../apis';
// import { API_KEY, API_SECRET } from 'react-native-dotenv';


// REDUX IMPORTS & AUTH
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as NewStoryActions from '../actions';
// import * as firebase from 'firebase';


// FOLLOWING ARE IMPORTS FROM JENNY
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import EachPhotoGrid from './EachPhotoGrid';
import StoryMapModal from './StoryMapModal';


// const ImagePicker = NativeModules.ImageCropPicker;
const windowWidth = Dimensions.get('window').width;
// const options = {
//   keyPrefix: "uploads/",
//   bucket: "pixelite-s3-oregon",
//   region: "us-west-2",
//   accessKey: AWS_ACCESS_KEY,
//   secretKey: AWS_SECRET_KEY,
//   successActionStatus: 201
// }


class EachStory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      image: null,
      images: null,
      user: null,
      sendData: null,

    }
  }

  makeSelectedPhotos(items) {
    const result = {};
    items.forEach( item => {
      const date = item.date;
      if(result.hasOwnProperty(item.date)) {
        result[date].push(item);
      } else {
        result[date] = [item];
      }
    })
    return result;
  }

  // renderImage(image) {
  //   return <Image style={{width: 300, height: 300, resizeMode: 'contain'}} source={image} />
  // }
  //
  // renderAsset(image) {
  //   return this.renderImage(image);
  // }

  toggleStoryMap() {
    this.props.newStoryToggleStoryMap(this.props.isStoryMapClicked);
  }

  toggleEditable() {
    this.props.newStoryToggleEditable(this.props.isTextEditable);
  }

  toggleStory() {
    this.props.toggleModal();
    // this.props.newstoryToggleStory();
  }

  // cancelNewStory() {
  //   this.props.navigation.goBack();
  // }

  render() {
    const { isStoryMapClicked } = this.props;
    const { title, description, city, country, travelPeriod, coverPhotoUrl, dates, items, maplocations, coordinates } = this.props.selectedStory;
    console.log(this.props.selectedStory);
    return (
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
                {city === country
                  ? city.toUpperCase()
                  : city.toUpperCase().concat(', ').concat(country.toUpperCase())}
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
                  {title.toUpperCase()}
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
            {/* <View style={{ alignItems: 'center', marginHorizontal: 7,
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
            </View> */}
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
            }}>{title}</Text>
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
                name="close"
                color="white"
                size={26}
                onPress={() => this.toggleStory()}
              />
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end', top: 25, right: 12 }}>
              <Icon
                type="simple-line-icon"
                name="heart"
                color="white"
                size={25}
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
              locations={maplocations}
              regionCoordinates={coordinates}
            />
            {console.log('maplocations: ', maplocations, ', coordinates: ', coordinates)}
          </Modal>
{/* isTextEditable */}
          <View style={{ alignItems: 'center', alignSelf: 'center', width: windowWidth - 50 }}>
            <Text style={{ color: '#282626', fontFamily: 'Avenir', fontSize: 14, textAlign: 'center' }}>
              {description}
            </Text>
            {description === ''
              ? null
              : <Divider style={{ width: 20, height: 3, backgroundColor: '#f7d074', marginTop: 15, marginBottom: 25 }} />
            }
          </View>

{/*PHOTO CONTENTS */}
            {
              dates.map(date => (
                <View key={`entireView-${date}`} style={{ marginBottom: 18 }}>
                  <View key={`dateTextView-${date}`} style={{ flexDirection: 'column' }}>
                    <Text style={{ color: '#595757', fontWeight: 'bold', fontFamily: 'AvenirNext-Italic', fontSize: 13, marginLeft: 20, marginBottom: 4 }}>{date}</Text>
                    <Divider style={{ width: 15, height: 2, backgroundColor: '#595757', marginLeft: 20, marginBottom: 20 }} />
                  </View>
                  <EachPhotoGrid
                    allPhotosla={this.makeSelectedPhotos(items)}
                    photosList={this.makeSelectedPhotos(items)[date]}
                    eachPhotogridDates={dates}
                  />
                </View>
              ))
            }

        </View>
      </ParallaxScrollView>
    );
  }
}

const mapStateToProps = ({ auth, newStory, PhotoGrid }) => {
  const { user } = auth;
  return { user, ...newStory, ...PhotoGrid };
}

const matchDispatchToProps = dispatch => bindActionCreators(NewStoryActions, dispatch);

export default connect(mapStateToProps, matchDispatchToProps)(EachStory);
