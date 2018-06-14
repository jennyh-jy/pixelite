/* eslint-disable react/jsx-filename-extension, max-len */
import React, { Component } from 'react';
import { Alert, View, Image, Dimensions, Modal, TouchableOpacity, Text, StatusBar } from 'react-native';
import { Icon } from 'react-native-elements';
import Gallery from 'react-native-image-gallery';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as _ from 'lodash';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as PhotoGridActions from '../actions';
import { GOOGLE_PLACES_API_KEY } from '../../apis';

const windowWidth = Dimensions.get('window').width;

const styles = {
  container: {
    flex: 1,
    paddingTop: 0,
    paddingBottom: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    width: View.width,
    height: 120,
    resizeMode: 'cover',
  },
  flexCol: {
    flexDirection: 'column',
    flex: 1,
  },
  alignCenter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidth,
  },
  photoView: {
    height: 120,
    flex: 2,
    backgroundColor: 'white',
    marginHorizontal: 1,
    marginVertical: 1,
    justifyContent: 'center',
  },
  expandedView: {
    height: 249,
    backgroundColor: 'white',
    marginHorizontal: 1,
    marginVertical: 1,
    flex: 2,
  },
  expandedImage: {
    height: 249,
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
};

class PhotoGrid extends Component {
  constructor(props) {
    super(props);
    console.log('THIS IS THE ALLPHOTOS FROM PROPS : ', this.props.allPhotosla);
    this.state = {
      // allPhotos: this.changeToSlide(this.props.allPhotosla, this.props.datesFromNewStory),
      currentPhotoUrl: '',
      currentPhotoIndex: 0,
      photoModalVisible: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    // this.setState({
    //   allPhotos: this.changeToSlide(nextProps.allPhotosla, nextProps.datesFromNewStory),
    // });
  }

  changeToSlide(object, dates) {
    console.log('THIS IS THE OBJECT :', object);
    console.log('THESE ARE THE DATES : ', dates)
    const result = [];
    dates.forEach(date => {
      object[date].forEach(({ url, location }) => {
        result.push({
          source: {
            uri: url,
            locationName: location && location.placeName,
          }
        })
      })
    })
    return result;
  }

  onPageChange(index) {
    const allPhotos = this.changeToSlide(this.props.allPhotosla, this.props.datesFromNewStory);
    const nextCurrentPhotoUrl = allPhotos[index].source.uri;
    const nextCurrentPhotoPlace = allPhotos[index].source.locationName;
    this.props.photoGridOnPageChange(nextCurrentPhotoUrl, nextCurrentPhotoPlace);
  }

  photoPopupToggle(currentPhotoUrl, currentPhotoLocation) {
    const allPhotos = this.changeToSlide(this.props.allPhotosla, this.props.datesFromNewStory);
    const getIndexFromSlide = (array) => {
      let index;
      array.find((element,i) => {
        if (element.source.uri === currentPhotoUrl) {
          index = i;
          return true;
        }
      })
      return index;
    }
    this.setState({
      currentPhotoUrl,
      currentPhotoIndex: getIndexFromSlide(allPhotos),
      photoModalVisible: !this.state.photoModalVisible,
    });
    this.props.photoGridTogglePhotoPopup(currentPhotoUrl, currentPhotoLocation, allPhotos);
  }

  searchPlacesPopupToggle() {
    this.props.photoGridToggleSearchPlaces();
  }

  deletePhoto(currentPhotoUrl) {
    const {dates, selectedPhotos} = this.props;
    if (dates.length === 1 && selectedPhotos[dates[0]].length === 1) {
      console.log('CANNOT DELETE');
      Alert.alert(
        'Cannot delete photo',
        'You should have at least one photo in your story',
        [{ text: 'OK', onPress: () => console.log('OK Pressed')}]
      );
      return false;
    } else {
      this.props.photoGridDeletePhoto(currentPhotoUrl);
    }
  }

  renderPhotoRow(rowItem, rowIndex) {
    if (rowIndex === 0) {
      return this.renderPhotoRow1(rowItem);
    }
    else if (rowIndex === 1) {
      return this.renderPhotoRow2(rowItem);
    }
    else if (rowIndex === 2) {
      return this.renderPhotoRow3(rowItem);
    }
  }

  renderPhotoRow1(row) {
    return (
      <View key={1} style={styles.alignCenter}>
        {
          row.map(
            (item, index) => {
              return (
                <View key={index} style={[styles.photoView, { borderRadius: this.props.borderRadius }]}>
                  <TouchableOpacity onPress={() => { this.photoPopupToggle(item.url, item.location) }}>
                    <Image source={{ uri: item.url }} style={[styles.imageStyle, { borderRadius: this.props.borderRadius }]} />
                  </TouchableOpacity>
                </View>
              )
            }
          )
        }
      </View>
    )
  }

  renderPhotoRow2(row) {
    if (row.length === 1) {
      return (
        <View key={row[0].url} style={styles.alignCenter}>
          <View key={row[0].url} style={[styles.expandedView, { borderRadius: this.props.borderRadius }]}>
            <TouchableOpacity onPress={() => { this.photoPopupToggle(row[0].url, row[0].location) }}>
              <Image source={{ uri: row[0].url }} style={[styles.imageStyle, styles.expandedImage, { borderRadius: this.props.borderRadius }]} />
            </TouchableOpacity>
          </View>
        </View>
      )
    } else if (row.length === 2) {
      return (
        <View key={row[0].url} style={styles.alignCenter}>
          <View key={row[0].url} style={[styles.expandedView, { borderRadius: this.props.borderRadius }]}>
            <TouchableOpacity onPress={() => { this.photoPopupToggle(row[0].url, row[0].location) }}>
              <Image source={{ uri: row[0].url }} style={[styles.imageStyle, styles.expandedImage, { borderRadius: this.props.borderRadius }]} />
            </TouchableOpacity>
          </View>
          <View key={row[1].url} style={styles.flexCol}>
            <View style={[styles.photoView, { borderRadius: this.props.borderRadius }]}>
              <TouchableOpacity onPress={() => { this.photoPopupToggle(row[1].url, row[1].location) }}>
                <Image source={{ uri: row[1].url }} style={[styles.imageStyle, { borderRadius: this.props.borderRadius }]} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    } else if (row.length === 3) {
      return (
        <View key={row[0].url} style={styles.alignCenter}>
          <View key={row[0].url} style={[styles.expandedView, { borderRadius: this.props.borderRadius }]}>
            <TouchableOpacity onPress={() => { this.photoPopupToggle(row[0].url, row[0].location) }}>
              <Image source={{ uri: row[0].url }} style={[styles.imageStyle, styles.expandedImage, { borderRadius: this.props.borderRadius }]} />
            </TouchableOpacity>
          </View>
          <View key={row[1].url} style={styles.flexCol}>
            <View style={[styles.photoView, { borderRadius: this.props.borderRadius }]}>
              <TouchableOpacity onPress={() => { this.photoPopupToggle(row[1].url, row[1].location) }}>
                <Image source={{ uri: row[1].url }} style={[styles.imageStyle, { borderRadius: this.props.borderRadius }]} />
              </TouchableOpacity>
            </View>
            <View style={[styles.photoView, { borderRadius: this.props.borderRadius }]}>
              <TouchableOpacity onPress={() => { this.photoPopupToggle(row[2].url, row[2].location) }}>
                <Image source={{ uri: row[2].url }} style={[styles.imageStyle, { borderRadius: this.props.borderRadius }]} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    }
  }

  renderPhotoRow3(row) {
    if (row.length === 1) {
      return (
        <View key={row[0].url} style={styles.alignCenter}>
          <View key={row[0].url} style={styles.flexCol}>
            <View style={[styles.photoView, { borderRadius: this.props.borderRadius }]}>
              <TouchableOpacity onPress={() => { this.photoPopupToggle(row[0].url, row[0].location) }}>
                <Image source={{ uri: row[0].url }} style={[styles.imageStyle, { borderRadius: this.props.borderRadius }]} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    } else if (row.length === 2) {
      return (
        <View key={row[0].url} style={styles.alignCenter}>
          <View key={row[0].url} style={styles.flexCol}>
            <View style={[styles.photoView, { borderRadius: this.props.borderRadius }]}>
              <TouchableOpacity onPress={() => { this.photoPopupToggle(row[0].url, row[0].location) }}>
                <Image source={{ uri: row[0].url }} style={[styles.imageStyle, { borderRadius: this.props.borderRadius }]} />
              </TouchableOpacity>
            </View>
            <View key={row[1].url} style={[styles.photoView, { borderRadius: this.props.borderRadius }]}>
              <TouchableOpacity onPress={() => { this.photoPopupToggle(row[1].url, row[1].location) }}>
                <Image source={{ uri: row[1].url }} style={[styles.imageStyle, { borderRadius: this.props.borderRadius }]} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    } else if (row.length === 3) {
      return (
        <View key={row[0].url} style={styles.alignCenter}>
          <View style={styles.flexCol}>
            <View style={[styles.photoView, { borderRadius: this.props.borderRadius }]}>
              <TouchableOpacity onPress={() => { this.photoPopupToggle(row[0].url, row[0].location) }}>
                <Image source={{ uri: row[0].url }} style={[styles.imageStyle, { borderRadius: this.props.borderRadius }]} />
              </TouchableOpacity>
            </View>
            <View style={[styles.photoView, { borderRadius: this.props.borderRadius }]}>
              <TouchableOpacity onPress={() => { this.photoPopupToggle(row[1].url, row[1].location) }}>
                <Image source={{ uri: row[1].url }} style={[styles.imageStyle, { borderRadius: this.props.borderRadius }]} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.expandedView, { borderRadius: this.props.borderRadius }]}>
            <TouchableOpacity onPress={() => { this.photoPopupToggle(row[2].url, row[2].location) }}>
              <Image source={{ uri: row[2].url }} style={[styles.imageStyle, styles.expandedImage, { borderRadius: this.props.borderRadius }]} />
            </TouchableOpacity>
          </View>
        </View>
      )
    }
  }

  renderChunk() {
    if (this.props.photosList.length === 1) {
      let width = windowWidth - 2;
      let height = (this.props.photosList[0].height) * (windowWidth - 2) / this.props.photosList[0].width;

      return (
        <View style={{ paddingBottom: 18, marginHorizontal: 1, marginVertical: 1,
          justifyContent: 'flex-start', alignItems: 'flex-start' }}>
          <TouchableOpacity onPress={() => { this.photoPopupToggle(this.props.photosList[0].url, this.props.photosList[0].location) }}>
            <Image
              source={{ uri: this.props.photosList[0].url }}
              style={{
                width,
                height,
                resizeMode: 'cover' }}
            />
          </TouchableOpacity>
        </View>
      );
    } else {
      let chunk = _.chunk(this.props.photosList, 9);
      return (
        <View style={[styles.container]}>
        {
          chunk.map((chunkItem, index) => {
            let row = _.chunk(chunkItem, 3);
            return row.map((rowItem, rowIndex) => {
              return this.renderPhotoRow(rowItem, rowIndex);
            })
          })
        }
        </View>
      );
    }
  }

  renderGrid() {
    return (
      <View>
        {this.renderChunk()}
      </View>
    )
  }

  getIndexFromSlide(allPhotos) {
    let index;
    allPhotos.find((element,i) => {
      if (element.source.uri === this.props.currentPhotoUrl) {
        index = i;
        return true;
      }
    })
    return index;
  }

  render() {
    console.log('photo modal visible?', this.state.photoModalVisible)
    return (
      <View>
        {this.renderGrid()}
        <View>
          <Modal
            animationType="fade"
            transparent={false}
            onRequestClose={() => { }}
            visible={this.state.photoModalVisible}
          >
            <View style={{ position: 'relative', flex: 1, flexDirection: 'column', backgroundColor: '#2d2d2d' }}>
              <StatusBar
                hidden={true}
              />
{/* Icon 1 TOP */}
              <View style={{ position: 'absolute', alignItems: 'flex-start', top: 9, left: 8, zIndex: 10, width: 38, height: 38 }}>
                <Icon
                  type="material-community"
                  name="close"
                  color="white"
                  size={25}
                  onPress={() => this.photoPopupToggle()}
                />
              </View>
{/* Icon 2 TOP */}
              <View style={{ position: 'absolute', alignItems: 'flex-end', top: 10, right: 55, zIndex: 10, width: 38, height: 38 }}>
                <Icon
                  type="material-community"
                  name="image-filter"
                  color="white"
                  size={23}
                  onPress={() => Alert.alert(
                    "Change story cover",
                    "Do you want to change your story cover to this photo?",
                    [{
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"), style: "cancel"
                    }, {
                      text: "Yes",
                      onPress: () => this.props.photoGridChangeCoverPhoto(this.props.currentPhotoUrl)
                    }]
                  )}
                />
              </View>
{/* Icon 3 TOP */}
              <View style={{ position: 'absolute', alignItems: 'flex-end', top: 9, right: 15, zIndex: 10, width: 38, height: 38 }}>
                <Icon
                  type="font-awesome"
                  name="trash-o"
                  color="white"
                  size={24}
                  onPress={() => Alert.alert(
                    'Delete photo',
                    'Are you sure you want to delete this photo?',
                    [{
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'), style: 'cancel'
                    }, {
                      text: 'Yes',
                      onPress: () => {
                        this.deletePhoto(this.props.currentPhotoUrl);
                        // if (this.props.photosList.length && result !== false) {
                        //   console.log('is the result false? :', result)
                        //   this.setState({
                        //     photoModalVisible: false,
                        //   })
                        // }
                        // if (this.props.photosList.length && result) {
                        //   this.photoPopupToggle();
                        // }
                      },
                    }]
                  )}
                />
              </View>
{/* Gallery Starts */}
                <Gallery
                  style={{ backgroundColor: '#2d2d2d' }}
                  images={this.changeToSlide(this.props.allPhotosla, this.props.datesFromNewStory)}
                  initialPage={this.state.currentPhotoIndex}
                  onPageSelected={(index) => this.onPageChange(index)}
                />
{/* Currnet Photo Place Display */}
                {!this.props.currentPhotoPlace
                  ?
                  <View
                    style={{
                      position: 'absolute', justifyContent: 'center', alignItems: 'center',
                      bottom: 0, zIndex: 10, width: '100%', height: 40, backgroundColor: '#1d1d1d'
                    }}
                  >
                    <TouchableOpacity
                      style={{ flexDirection: 'row' }}
                      onPress={() => this.searchPlacesPopupToggle()}
                    >
                      <Icon
                        type="simple-line-icon"
                        name="location-pin"
                        color='#8e8c8c'
                        size={20}
                      />
                      <Text style={{ fontFamily: 'Avenir', color: '#8e8c8c', marginLeft: 5 }}>
                        Add Location
                      </Text>
                    </TouchableOpacity>
                  </View>
                  :
                  <View
                    style={{
                      position: 'absolute', flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                      bottom: 0, zIndex: 10, width: '100%', height: 40, backgroundColor: '#1d1d1d'
                    }}
                  >
                    <TouchableOpacity
                      style={{ flexDirection: 'row' }}
                      onPress={() => this.searchPlacesPopupToggle()}
                    >
                      <Icon
                        type="simple-line-icon"
                        name="location-pin"
                        color='white'
                        size={20}
                      />
                      <Text style={{ fontFamily: 'Avenir', color: 'white', marginLeft: 5 }}>
                        {this.props.currentPhotoPlace}
                      </Text>
                    </TouchableOpacity>
                  </View>
                }
            </View>
{/* Modal for search places */}
            <Modal
              animationType={"fade"}
              transparent={false}
              onRequestClose={() => { }}
              visible={this.props.searchPlacesModalVisible}
            >
              <View style={{ flex: 1, flexDirection: 'column' }}>
                <StatusBar
                  hidden={true}
                />
                <View style={{ flexDirection: 'row', width: '100%', height: 42 }}>
                  <View style={{ position: 'absolute', alignItems: 'flex-start', top: 8, left: 8, width: 33, height: 33 }}>
                    <Icon
                      type="material-community"
                      name="close"
                      color="#2d2d2d"
                      size={26}
                      onPress={() => {
                        this.props.photoGridCancelUpdateLocation();
                        this.searchPlacesPopupToggle()}}
                    />
                  </View>
                  <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: 42, zIndex: -1 }}>
                    <Text style={{ color: '#2d2d2d', fontFamily: 'Avenir', fontSize: 18 }}>
                      Locations
                    </Text>
                  </View>
                  <View style={{ position: 'absolute', alignItems: 'flex-end', top: 8, right: 8, width: 33, height: 33 }}>
                    <Icon
                      type="material-community"
                      name="check"
                      color="#2d2d2d"
                      size={26}
                      onPress={() =>{
                        this.props.photoGridUpdateLocation();
                        this.searchPlacesPopupToggle();
                      }}
                    />
                  </View>
                </View>
                <GooglePlacesAutocomplete
                  placeholder='Search location'
                  minLength={2} // minimum length of text to search
                  autoFocus={false}
                  returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                  listViewDisplayed='auto'    // true/false/undefined
                  fetchDetails={true}
                  renderDescription={(row) => row.description} // custom description render
                  onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                    const placeName = data.description.split(', ')[0];
                    const coordinates = details.geometry.location;
                    this.props.photoGridUpdateTempPlace(placeName, coordinates);
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
                    description: {
                      fontWeight: 'bold',
                      fontFamily: 'Avenir',
                    },
                    textInput: {
                      fontFamily: 'Avenir',
                    }
                  }}
                  nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                  filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                  debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                />
              </View>
            </Modal>
          </Modal>
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ auth, newStory, photoGrid }) => {
  const { user } = auth;
  return { user, ...newStory, ...photoGrid };
};

const matchDispatchToProps = dispatch => bindActionCreators(PhotoGridActions, dispatch);

export default connect(mapStateToProps, matchDispatchToProps)(PhotoGrid);
