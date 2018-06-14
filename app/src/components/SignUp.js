/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import { Text, View, StatusBar } from 'react-native';
import { Icon, Button } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient';
import * as ActionsFunctions from '../actions';
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

class SignUp extends React.Component {

  onEmailChange(text) {
    this.props.emailChanged(text); // emailChanged -> action creator
  }
  onPasswordChange(text) {
    this.props.passwordChanged(text);
  }

  onNameChange(text) {
    this.props.nameChanged(text);
  }

  onSignUpButtonPress() {
    const { email, password, name} = this.props;
    this.props.signUpUser({ email, password, name });
  }

  render() {
    return (
      <LinearGradient
        start={{x: 0.0, y: 0.0}} end={{x: 1.0, y: 1.0}}
        // colors={['#b4b4b4', '#7d7b7a', '#535251']}
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
      <View style={{ position: 'absolute', top: 25, left: 8, justifyContent: 'center', alignItems: 'flex-start', width: 30, height: 30, zIndex: 10 }}>
        <Icon
          type="simple-line-icon"
          name="arrow-left"
          color="white"
          size={24}
          onPress={() => this.props.navigation.goBack()}
        />
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{
          fontSize: 20,
          marginTop: 30,
          backgroundColor: 'transparent',
          color: 'white',
          fontFamily: 'Avenir',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          Create an Account
        </Text>
        <View style={{margin: 30}}>
          <View style={{margin: 7}}>
            <FloatingLabelInput
              label="Name"
              value={this.props.name}
              onChangeText={this.onNameChange.bind(this)}
            />
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
            <Button
              buttonStyle={{ marginTop: 20, width: 250, height: 40, borderWidth: 1, borderColor: 'white', alignSelf: 'center' }}
              backgroundColor="white"
              borderRadius={20}
              title="Sign Up"
              color="#fe161d"
              fontFamily="Avenir"
              fontWeight="bold"
              fontSize={16}
              onPress={this.onSignUpButtonPress.bind(this)}
            />
          </View>
        </View>
      </View>
    </LinearGradient>
    );
  }
}

const mapStateToProps = ({ auth }) => { // auth = state.auth
  const { email, password, error, loading, name } = auth;
  return { email, password, error, loading, name };
};

export default connect(mapStateToProps, {
  ...ActionsFunctions
})(SignUp);
