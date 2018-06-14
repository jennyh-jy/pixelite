/* eslint-disable */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Image,
  Dimensions,
  StatusBar
} from "react-native";
import { Icon } from 'react-native-elements';
import MapView from 'react-native-maps';

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.3;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const CARD_HEIGHT = height / 3;
const CARD_WIDTH = width - 90;

const getMarkers = (stories) => {
  return stories.map(story => ({
      coordinate: story.coordinates,
      title: story.title.toUpperCase(),
      location: story.city === story.country
        ? story.city
        : story.city.concat(', ').concat(story.country),
      image: {uri: story.coverPhotoUrl},
    })
  )
}

export default class UserMapModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: getMarkers(this.props.stories),
      region: {
        latitude: getMarkers(this.props.stories)[0].coordinate.latitude,
        longitude: getMarkers(this.props.stories)[0].coordinate.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
    };
  }

  componentWillMount() {
    this.index = 0;
    this.animation = new Animated.Value(0);
  }

  componentDidMount() {
    // We should detect when scrolling has stopped then animate
    // We should just debounce the event listener here
    this.animation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (index >= this.state.markers.length) {
        index = this.state.markers.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      clearTimeout(this.regionTimeout);
      this.regionTimeout = setTimeout(() => {
        if (this.index !== index) {
          this.index = index;
          const { coordinate } = this.state.markers[index];
          this.map.animateToRegion({
            ...coordinate,
            latitudeDelta: this.state.region.latitudeDelta,
            longitudeDelta: this.state.region.longitudeDelta,
          }, 350);
        }
      }, 10);
    });
  }

  render() {
    const interpolations = this.state.markers.map((marker, index) => {
      const inputRange = [
        (index - 1) * CARD_WIDTH,
        index * CARD_WIDTH,
        ((index + 1) * CARD_WIDTH),
      ];
      const scale = this.animation.interpolate({
        inputRange,
        outputRange: [1, 2.5, 1],
        extrapolate: "clamp",
      });
      const opacity = this.animation.interpolate({
        inputRange,
        outputRange: [0.35, 1, 0.35],
        extrapolate: "clamp",
      });
      return { scale, opacity };
    });

    return (
      <View style={styles.container}>
        <StatusBar
          hidden={true}
        />
        <View style={{ position: 'absolute', alignItems: 'flex-start', top: 8, left: 8, width: 35, height: 35, zIndex: 10 }}>
          <Icon
            type="material-community"
            name="close"
            color="#2d2d2d"
            size={26}
            onPress={() => this.props.toggleUserMap()}
          />
        </View>
        <MapView
          ref={map => this.map = map}
          initialRegion={this.state.region}
          style={styles.container}
        >
          {this.state.markers.map((marker, index) => {
            const scaleStyle = {
              transform: [{
                scale: interpolations[index].scale,
              }],
            };
            const opacityStyle = {
              opacity: interpolations[index].opacity,
            };
            return (
              <MapView.Marker key={index} coordinate={marker.coordinate}>
                <Animated.View style={[styles.markerWrap, opacityStyle]}>
                  <Animated.View style={[styles.ring, scaleStyle]} />
                  <View style={styles.marker} />
                </Animated.View>
              </MapView.Marker>
            );
          })}
        </MapView>
        <Animated.ScrollView
          horizontal
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + 25.5}
          // snapToAlignment={'center'}
          decelerationRate={0}
          onScroll={Animated.event([{
              nativeEvent: {
                contentOffset: {
                  x: this.animation,
                },
              },
            }], { useNativeDriver: true })}
          style={styles.scrollView}
          contentContainerStyle={styles.endPadding}
        >
          {this.state.markers.map((marker, index) => (
            <View style={styles.card} key={index}>
              <Image
                source={marker.image}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.textContent}>
                <Text numberOfLines={1} style={styles.cardTitle}>{marker.title}</Text>
                <View style={{ flexDirection: 'row', paddingHorizontal: 15, paddingTop: 5 }}>
                  <Icon
                    type="simple-line-icon"
                    name="location-pin"
                    color='#444'
                    size={15}
                  />
                  <Text numberOfLines={1} style={styles.cardLocation}>
                    {marker.location}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </Animated.ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingHorizontal: (width - CARD_WIDTH) / 2,
  },
  card: {
    elevation: 2,
    backgroundColor: "#FFF",
    marginHorizontal: 11,
    shadowColor: "red",
    shadowRadius: 5,
    shadowOpacity: 0.5,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
    borderRadius: 5,
  },
  cardImage: {
    flex: 2,
    width: "100%",
    height: "100%",
  },
  textContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    paddingHorizontal: 15,
    color: '#3b3939',
    fontSize: 15,
    fontFamily: 'Avenir',
    fontWeight: "bold",
  },
  cardLocation: {
    paddingLeft: 3,
    fontSize: 12,
    color: "#5d5b5b",
    fontFamily: 'AvenirNext-Italic',
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 71, 26, 0.9)",
  },
  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 71, 26, 0.3)",
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(255, 71, 26, 0.5)",
  },
});
