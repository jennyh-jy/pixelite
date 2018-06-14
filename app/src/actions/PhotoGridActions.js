import {
  PHOTOGRID_TOGGLE_PHOTO_POPUP,
  PHOTOGRID_TOGGLE_SEARCH_PLACES,
  PHOTOGRID_CHANGE_COVER_PHOTO,
  PHOTOGRID_DELETE_PHOTO,
  PHOTOGRID_ON_PAGE_CHANGE,
  PHOTOGRID_UPDATE_TEMP_PLACE,
  PHOTOGRID_UPDATE_LOCATION,
  PHOTOGRID_CANCEL_UPDATE_LOCATION,
} from './types';

export const photoGridTogglePhotoPopup = (currentPhotoUrl, currentPhotoLocation, allPhotos) => {
  return {
    type: PHOTOGRID_TOGGLE_PHOTO_POPUP,
    payload: {currentPhotoUrl, currentPhotoLocation, allPhotos},
  };
};

export const photoGridToggleSearchPlaces = () => {
  return {
    type: PHOTOGRID_TOGGLE_SEARCH_PLACES,
    payload: {},
  };
};

export const photoGridChangeCoverPhoto = (currentPhotoUrl) => {
    return {
      type: PHOTOGRID_CHANGE_COVER_PHOTO,
      payload: currentPhotoUrl,
    };
}

export const photoGridDeletePhoto = (currentPhotoUrl) => {
  console.log("I AM DELETING!")
    return {
      type: PHOTOGRID_DELETE_PHOTO,
      payload: currentPhotoUrl,
    };
}

export const photoGridOnPageChange = (nextCurrentPhotoUrl, nextCurrentPhotoPlace) => {
  return {
    type: PHOTOGRID_ON_PAGE_CHANGE,
    payload: [nextCurrentPhotoUrl, nextCurrentPhotoPlace],
  }
}

export const photoGridUpdateTempPlace = (placeName, coordinates) => {
  return {
    type: PHOTOGRID_UPDATE_TEMP_PLACE,
    payload: [placeName, coordinates],
  }
}

const updateLocation = (locations, tempPlace, currentPhotoUrl) => {
  return {
    type: PHOTOGRID_UPDATE_LOCATION,
    payload: {locations, tempPlace, currentPhotoUrl},
  }
}

export const photoGridUpdateLocation = () => {
  return (dispatch, getState) => {
    const {locations} = getState().newStory;
    const { tempPlace, currentPhotoUrl } = getState().photoGrid;
    dispatch(updateLocation(locations, tempPlace, currentPhotoUrl));
  }
};

export const photoGridCancelUpdateLocation = () => {
  return {
    type: PHOTOGRID_CANCEL_UPDATE_LOCATION,
    payload: null,
  }
}
