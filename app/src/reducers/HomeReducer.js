import {
  HOME_CHANGE_TEXT,
  HOME_SHOW_SEARCHED_STORIES,
} from '../actions/types';

const INITIAL_STATE = {
  searchText: null,
  searchedStories: null,
};


export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case HOME_CHANGE_TEXT:
      return { ...state, searchText: action.payload };
    case HOME_SHOW_SEARCHED_STORIES:
      console.log("from reducers : ", action.payload );
      return { ...state, searchedStories: action.payload };
    default:
      return state;
  }
};
