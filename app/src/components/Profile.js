/* eslint-disable */
import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Animated,
  Modal
} from "react-native";
import { Icon, Divider } from 'react-native-elements'
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import MapView from 'react-native-maps';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ProfileActions from '../actions';
import UserMapModal from './UserMapModal';

const sampleSavedStories = [{
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
  title: "Honeymoon in Africa",
  city: "Cape Town",
  country: "South Africa",
  coordinates: {
    latitude: -33.9248685,
    longitude: 18.4240553,
  },
  travelPeriod: "24-30 Sep 2013",
  coverPhotoUrl: "https://images.fineartamerica.com/images-medium-large/lions-head-sunset-johaar-bassier.jpg",
}]

const windowWidth = Dimensions.get('window').width;

class Profile extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isUserMapClicked: false,
      index: 0,
      routes: [
        { key: 'stories', title: `${this.props.stories.length} STORIES` },
        { key: 'saved', title: '3 SAVED' },
      ],
      stories: this.props.stories,
      saved: sampleSavedStories,
    };

    this.handleIndexChange = this.handleIndexChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      stories: nextProps.stories,
      saved: sampleSavedStories,
      routes: [
        { key: 'stories', title: `${nextProps.stories.length} STORIES` },
        { key: 'saved', title: '3 SAVED' },
      ],
    });
  }

  handleIndexChange(index) {
    this.setState({ index });
  }

  renderLabel(props) {
    return ({ route, index }) => {
       const inputRange = props.navigationState.routes.map((x, i) => i);
       const outputRange = inputRange.map(
         inputIndex => (inputIndex === index ? '#be922c' : '#7c7878')
       );
       const color = props.position.interpolate({
         inputRange,
         outputRange,
       });

       return (
         <Animated.Text style={[{ fontSize: 14, fontFamily: 'Avenir', marginVertical: 6 }, { color }]}>
           {route.title}
         </Animated.Text>
       );
     }
   };

  renderHeader(props){
    return (<TabBar {...props}
    style={{ backgroundColor: 'white' }}
    indicatorStyle={{ backgroundColor: '#be922c' }}
    renderLabel={this.renderLabel(props)}
    pressOpacity={0.5}
  />);
  }

  renderScene({ route }) {
    switch (route.key) {
      case 'stories':
        return (
          <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ marginBottom: windowWidth * 0.03 }}>
              {this.renderStoriesImagesInGroups()}
            </View>
          </ScrollView>
        );
      case 'saved':
        return (
          <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ marginBottom: windowWidth * 0.03 }}>
              {this.renderSavedImagesInGroups()}
            </View>
          </ScrollView>
        );
      default:
        return null;
    }
  };

  renderChunk(storiesArr) {
    const array = storiesArr.slice(0);
    const length = array.length;
    const result = [];
    let sum = 0;
    let c = 1;

    while (sum < length) {
      const willAdd = c % 2 === 0 ? 2 : 1;
      const tuple = [];
      for (let i = 0; i < willAdd; i++) {
        if (array[i]) { tuple.push(array[i]) }
      }
      if (tuple.length > 0) { result.push(tuple) }
      array.splice(0, willAdd);
      sum += willAdd;
      c++;
    }
   return result;
  }

  renderRow(stories, index) {
    return stories.map((story, i) => {
      let imageStyle;
      if (index % 2 === 0) {
        imageStyle = {marginTop: windowWidth * 0.03, marginHorizontal: windowWidth * 0.03 , width: windowWidth * 0.94, height: 150}
      } else if (i === 0) {
        imageStyle = {marginTop: windowWidth * 0.03, marginLeft: windowWidth * 0.03, marginRight: windowWidth * 0.015, width: windowWidth * 0.455, height: 150}
      } else if (i === 1) {
        imageStyle = {marginTop: windowWidth * 0.03, marginLeft: windowWidth * 0.015, marginRight: windowWidth * 0.03, width: windowWidth * 0.455, height: 150}
      }
      return (
        <ImageBackground
          key={i}
          style={[imageStyle, {zIndex: -1}]}
          source={{uri: story.coverPhotoUrl}}
        >
          <View style={{width: imageStyle.width, height: imageStyle.height, backgroundColor: 'rgba(0,0,0,.4)', zIndex: 1}}/>
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            paddingTop: 15,
            paddingHorizontal: 10,
            backgroundColor: 'transparent',
            alignItems: 'flex-start',
            width: imageStyle.width,
            height: imageStyle.height,
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
              {story.city === story.country
                ? story.city.toUpperCase()
                : story.city.toUpperCase().concat(', ').concat(story.country.toUpperCase())}
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
              {story.title.toUpperCase()}
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
              {story.travelPeriod}
            </Text>
          </View>
        </ImageBackground>
      );
    })
  }

  renderStoriesImagesInGroups() {
    return this.renderChunk(this.state.stories).map((storiesForRow, index) => {
      return (
        <View style={{margin: 0, flexDirection: "row"}} key={index}>
          {this.renderRow(storiesForRow, index)}
        </View>
      )
    })
  }

  renderSavedImagesInGroups() {
    return this.renderChunk(this.state.saved).map((storiesForRow, index) => {
      return (
        <View style={{margin: 0, flexDirection: "row"}} key={index}>
          {this.renderRow(storiesForRow, index)}
        </View>
      )
    })
  }

  toggleUserMap() {
    this.setState({ isUserMapClicked: !this.state.isUserMapClicked });
  }

  render() {
    let { index, routes, isUserMapClicked } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          barStyle='dark-content'
        />
        <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 120, paddingTop: 25, backgroundColor: "white",
          justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
          <Image
            style={{
              marginRight: 20,
              width: 80,
              height: 80,
              borderRadius: 40
            }}
            source={{uri:'https://s3.us-east-2.amazonaws.com/coderaising-cs/KakaoTalk_Photo_2017-03-27-14-38-15.jpeg'}}
            resizeMode="cover"
          />
          <View>
            <Text style={{ color: '#3b3939', fontFamily: 'Avenir', fontSize: 17, fontWeight: 'bold' }}>{this.props.name}</Text>
            <Divider style={{ width: 25, height: 3, marginTop: 3, backgroundColor: '#3b3939' }} />
            <View style={{ flexDirection: "row", marginTop: 14, marginLeft: 2 }}>
              <Icon type='simple-line-icon' name="globe-alt" size={23} color="#737171" style={{ marginRight: 16 }} onPress={() => this.toggleUserMap()} />
              <Icon type='simple-line-icon' name="settings" size={23} color="#737171" />
            </View>
          </View>
        </View>
        <Modal
          animationType="fade"
          transparent={false}
          onRequestClose={() => { }}
          visible={isUserMapClicked}
        >
          <UserMapModal
            toggleUserMap={this.toggleUserMap.bind(this)}
            stories={this.state.stories}
          />
        </Modal>
        <TabViewAnimated
          style={{ marginTop: 120 }}
          navigationState={{ index, routes }}
          renderScene={this.renderScene.bind(this)}
          renderHeader={this.renderHeader.bind(this)}
          onIndexChange={this.handleIndexChange}
        />
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25
  },
});

const mapStateToProps = ({ profile }) => {
  return { ...profile };
};
const matchDispatchToProps = dispatch =>
  bindActionCreators(ProfileActions, dispatch);

export default connect(mapStateToProps, matchDispatchToProps)(Profile);
