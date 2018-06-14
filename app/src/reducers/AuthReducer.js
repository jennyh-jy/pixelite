import {
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER,
  GOOGLE_LOGIN,
  SIGNUP_USER,
  SIGNUP_USER_SUCCESS,
  SIGNUP_USER_FAIL,
  NAME_CHANGED,
  } from '../actions/types';

const INITIAL_STATE = {
  email: '',
  password: '',
  user: null,
  name: '',
  error: '',
  loading: false,
};

export default (state = INITIAL_STATE, action) => {

  switch (action.type) {
    case EMAIL_CHANGED:
      return { ...state, email: action.payload };
    case PASSWORD_CHANGED:
      return { ...state, password: action.payload };
    case NAME_CHANGED:
      return { ...state, name: action.payload };
    case LOGIN_USER:
      return { ...state, loading: true, error: '' };
    case LOGIN_USER_SUCCESS:
      return { ...state, ...INITIAL_STATE, user: action.payload};
    case SIGNUP_USER:
      return { ...state, loading: true, error: '' };
    case LOGIN_USER_FAIL:
      return { ...state, error: 'Authentication Failed - please check your email and password', password: '', loading: false };
    case SIGNUP_USER_SUCCESS:
      return { ...state, ...INITIAL_STATE, user: action.payload };
    case SIGNUP_USER_FAIL:
      return { ...state, error: action.payload, password: '', user: null, loading: false };
    // case GOOGLE_LOGIN:
    //   return { ...state, ...INITIAL_STATE, error: 'Google Login Success!', user: action.payload };
    default:
      return state;
  }
};
