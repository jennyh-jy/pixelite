import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, Image, StatusBar } from 'react-native';
import { Button } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient';

import { emailChanged, passwordChanged, loginUser, signUpUser } from '../actions';
import FloatingLabelInput from './common/FloatingLabelInput';

const styles = {
  errorTextStyle: {
    alignSelf: 'center',
    margin: 2,
    color: 'red',
    fontSize: 13,
    fontFamily: 'Avenir',
  },
};

class Login extends Component {
  onEmailChange(text) {
    this.props.emailChanged(text); // emailChanged -> action creator
  }

  onPasswordChange(text) {
    this.props.passwordChanged(text);
  }

  onButtonPress() {
    const { email, password } = this.props;
    this.props.loginUser({ email, password });
  }

  onSignUpButtonPress() {
    this.props.navigation.navigate('SignUp');
  }

  render() {
    return (
      <LinearGradient
        start={{x: 0.0, y: 0.0}} end={{x: 1.0, y: 1.0}}
        // colors={['#f6c377', '#e48832', '#ffb000']}
        colors={['#f9855a', '#eb3d3d', '#fe161d']}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <StatusBar
          barStyle='light-content'
        />
        <Image source={require('../images/pixelite_logo_white.png')} style={{ width: 80, height: 80 }}/>
        <Text style={{
          fontSize: 25,
          margin: 10,
          color: 'white',
          fontFamily: 'Avenir',
          fontWeight: 'bold',
          textAlign: 'center',
          backgroundColor: 'transparent'
        }}>
          Welcome to Pixelite
        </Text>
        <View style={{margin: 20}}>
          <View style={{margin: 7}}>
            <FloatingLabelInput
              autoCapitalize={'none'}
              label="Email"
              value={this.props.email}
              onChangeText={this.onEmailChange.bind(this)}
            />
            <FloatingLabelInput
              autoCapitalize={'none'}
              secureTextEntry
              label="Password"
              value={this.props.password}
              onChangeText={this.onPasswordChange.bind(this)}
            />
            <Text style={styles.errorTextStyle}>
              {this.props.error}
            </Text>
          </View>
            <Button
              buttonStyle={{ width: 250, height: 40, borderWidth: 1, borderColor: 'white', alignSelf: 'center' }}
              backgroundColor="transparent"
              borderRadius={20}
              title="Log In"
              fontFamily="Avenir"
              fontSize={16}
              onPress={this.onButtonPress.bind(this)}
            />
          <View style={{margin: 7}}>
            <Text style={{ backgroundColor: 'transparent', color: 'white', fontFamily: 'Avenir', fontSize: 14, textAlign: 'center', alignItems: 'center', marginTop: 15, marginBottom: 7 }}>
              Don't have an account yet?
            </Text>

            <Button
              buttonStyle={{ width: 250, height: 40, borderWidth: 1, borderColor: 'white', alignSelf: 'center' }}
              icon={{name: 'user', type: 'simple-line-icon'}}
              backgroundColor="transparent"
              borderRadius={20}
              title="Sign Up"
              color="white"
              fontFamily="Avenir"
              fontSize={16}
              onPress={this.onSignUpButtonPress.bind(this)}
            />
          </View>
        </View>
      </LinearGradient>
    );
  }
}

const mapStateToProps = ({ auth }) => { // auth = state.auth
  const { email, password, error, loading } = auth;
  return { email, password, error, loading };
};

export default connect(mapStateToProps, {
  emailChanged, passwordChanged, loginUser
})(Login);
