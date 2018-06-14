// Profile Action Creator
import {
  PROFILE_DELETE_STORY,
  PROFILE_SHOW_MAP,
  // PROFILE_MAP_CHANGED,
  PROFILE_STORY_SELECTED,
} from './types';

export const profileDeleteStory = (storyId) => {
  return {
    type: PROFILE_DELETE_STORY,
    payload: storyId,
  };
};

export const profileShowMap = (isShowing) => {
  return {
    type: PROFILE_SHOW_MAP,
    payload: isShowing,
  };
};

export const profileStorySelected = (storyId) => {
  return {
    type: PROFILE_STORY_SELECTED,
    payload: storyId,
  };
};
