/* eslint-disable */
import React from 'react';
import { Text, View, Dimensions, StyleSheet, StatusBar } from 'react-native';
import { Icon } from 'react-native-elements';
import MapView from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.3;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class StoryMapModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        ...this.props.regionCoordinates,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      markers: this.props.locations,
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   console.log(nextProps);
  //   this.setState({
  //     markers: nextProps.locations,
  //   })
  // }

  onRegionChange(region) {
    this.setState({ region: this.props.region });
  }

  render() {
    console.log(this.state.markers);
    console.log(this.state.region)
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          hidden={true}
        />
        <View style={{...StyleSheet.absoluteFillObject, position: 'absolute', alignItems: 'flex-start', top: 8, left: 8, width: 35, height: 35, zIndex: 10 }}>
          <Icon
            type="material-community"
            name="close"
            color="#2d2d2d"
            size={26}
            onPress={() => this.props.toggleStoryMap()}
          />
        </View>
        <MapView
          provider={this.props.provider}
          region={this.state.region}
          style={{...StyleSheet.absoluteFillObject}}
          onRegionChange={this.onRegionChange.bind(this)}
        >
          {this.state.markers.map((marker, i) => (
            <MapView.Marker
              key={i}
              coordinate={marker.coordinates}
              title={marker.placeName}
            />
          ))}
        </MapView>
      </View>
    );
  }
}
