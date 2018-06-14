import { combineReducers } from 'redux';
import ProfileReducer from './ProfileReducer';
import AuthReducer from './AuthReducer';
import NewStoryReducer from './NewStoryReducer';
import HomeReducer from './HomeReducer';
import PhotoGridReducer from './PhotoGridReducer';

export default function getRootReducer(navReducer) {
  return combineReducers({
    nav: navReducer,
    auth: AuthReducer,
    profile: ProfileReducer,
    newStory: NewStoryReducer,
    home: HomeReducer,
    photoGrid: PhotoGridReducer,
  });
}
