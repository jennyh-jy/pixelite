import {
  HOME_CHANGE_TEXT,
  HOME_SHOW_SEARCHED_STORIES,
} from './types';

export const changeText = (text) => {
  return {
    type: HOME_CHANGE_TEXT,
    payload: text,
  };
};

export const showSearchedStories = (stories) => {
  console.log("from home actions : ", stories);
  return {
    type: HOME_SHOW_SEARCHED_STORIES,
    payload: stories,
  };
};
