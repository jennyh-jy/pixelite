
import * as _ from 'lodash';
import { AWS_ACCESS_KEY, AWS_SECRET_KEY } from '../../apis';
import { RNS3 } from 'react-native-aws3';
import {
  NEWSTORY_CREATE_STORY,
  NEWSTORY_UPDATED_STORIES,
  NEWSTORY_GET_PHOTOS,
  NEWSTORY_GOOGLE_PLACES_AUTOCOMPLETE,
  NEWSTORY_CHANGE_TITLE_INPUT,
  NEWSTORY_TOGGLE_STORY_MAP,
  NEWSTORY_TOGGLE_TEXT_EDITABLE,
  NEWSTORY_CHANGE_TEXT_EDITABLE_INPUT,
  NEWSTORY_TOGGLE_STORY,
  NEWSTORY_CLEAR_EVERYTHING,
} from './types';


const options = {
  keyPrefix: "uploads/",
  bucket: "pixelite-s3",
  region: "us-east-2",
  accessKey: AWS_ACCESS_KEY,
  secretKey: AWS_SECRET_KEY,
  successActionStatus: 201
}

const saveImageToS3 = (uri, user) => {
  const file = {
    uri: `file://${uri}`,
    name: `${user.uid}_AND_${uri.slice(uri.lastIndexOf('/') + 1)}`,
    type: "image/jpg"
  }
  return RNS3.put(file, options).then(response => {
    if (response.status !== 201)
      throw new Error("Failed to upload image to S3");
  });
}

const updateStory = (dispatch, updatedStory) => {
  console.log('updatesStory: ', updatedStory);
  dispatch({
    type: NEWSTORY_UPDATED_STORIES,
    payload: updatedStory,
  });
};

export const newStoryCreateStory = (props) => {
  const items = _.flattenDeep(Object.values(props.selectedPhotos));
  const promises = items.map(item => saveImageToS3(item.url, props.user));
  const urls = items.map((item) => `https://s3.us-east-2.amazonaws.com/pixelite-s3/uploads/${props.user.uid}_AND_${item.url.slice(item.url.lastIndexOf('/') + 1)}`);
  const coverPhotoUrl =  'https://s3.us-east-2.amazonaws.com/pixelite-s3/uploads/' + props.user.uid + '_AND_' + props.coverPhotoUrl.slice(props.coverPhotoUrl.lastIndexOf('/') + 1);
  const newStory = {
    title: props.titleValue,
    description: props.textValue,
    dates: props.dates,
    items,
    city: props.selectedCity,
    country: props.selectedCountry,
    coordinates: props.selectedCoordinates,
    maplocations: props.locations,
    travelPeriod: props.travelPeriod,
    coverPhotoUrl,
  };

  for (let i = 0; i < newStory.items.length; i++) {
    newStory.items[i].url = urls[i];
  }

  return (dispatch) => {
    Promise.all(promises)
      .then(() => {
        fetch('http://localhost:5000/createNewStory', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            story: newStory,
            user: props.user,
          }),
        })
        .then((res) => {
          const bodyText = JSON.parse(res._bodyText);
          console.log('createNewStory, received bodyText:', bodyText);
          updateStory(dispatch, bodyText);
        }).catch(err => console.log('createNewStory err!: ', err));
      });
  };
};

export const clearEverything = () => {
  return {
    type: NEWSTORY_CLEAR_EVERYTHING,
  }
};

export const newStoryToggleStory = () => {
  return {
    type: NEWSTORY_TOGGLE_STORY,
  }
};

export const newStoryToggleStoryMap = (isStoryMapClicked) => {
  return {
    type: NEWSTORY_TOGGLE_STORY_MAP,
    payload: isStoryMapClicked,
  }
}

export const newStoryToggleEditable = (isTextEditable) => {
  return {
    type: NEWSTORY_TOGGLE_TEXT_EDITABLE,
    payload: isTextEditable,
  }
}

export const newStoryChangeTitleInput = (titleValue) => {
  return {
    type: NEWSTORY_CHANGE_TITLE_INPUT,
    payload: titleValue,
  }
}

export const newStoryChangeTextEditableInput = (textValue) => {
  return {
    type: NEWSTORY_CHANGE_TEXT_EDITABLE_INPUT,
    payload: textValue,
  }
}

export const newStoryGooglePlacesAtuocomplete = (selectedLocationInfo) => {
  console.log(selectedLocationInfo);
  return {
    type: NEWSTORY_GOOGLE_PLACES_AUTOCOMPLETE,
    payload: selectedLocationInfo,
  };
}

export const newStoryGetPhotos = (nextSelectedPhotos, firstAdd) => {
  return {
    type: NEWSTORY_GET_PHOTOS,
    payload: {
      nextSelectedPhotos,
      firstAdd,
    },
  };
}
