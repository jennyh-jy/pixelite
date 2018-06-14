
import {
  PROFILE_DELETE_STORY,
  PROFILE_SHOW_MAP,
  // PROFILE_MAP_CHANGED,
  PROFILE_STORY_SELECTED,
  NEWSTORY_UPDATED_STORIES,
  NEWSTORY_UPDATED_STORIES_LOGIN,
} from '../actions/types';

const INITIAL_STATE = {
  stories: [],
  selectedStory: null,
  isShowingMap: false,
  name: '',
};

const profileChange = (state, action) => {
  switch (action.type) {
    case PROFILE_DELETE_STORY:
      const stories = state.stories;
      let index;
      stories.forEach((story, i) => {
        if (story._id.$oid === action.payload) {
          index = i;
        }
      });
      return [...stories.slice(0, index), ...stories.slice(index + 1)];
    case NEWSTORY_UPDATED_STORIES:
      return [...state.stories, action.payload];
    default:
      return state;
  }
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PROFILE_DELETE_STORY:
      return { ...state, stories: profileChange(state, action) };
    case PROFILE_SHOW_MAP:
      return { ...state, isShowingMap: !state.isShowingMap };
    case PROFILE_STORY_SELECTED:
      return { ...state, selectedStory: action.payload };
    case NEWSTORY_UPDATED_STORIES:
      console.log('received updated storeis: ', action.payload);
      return { ...state, stories: profileChange(state, action) };
    case NEWSTORY_UPDATED_STORIES_LOGIN:
      return { ...state, stories: action.payload, name: action.name };
    default:
      return state;
  }
};
