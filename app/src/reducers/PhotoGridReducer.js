import {
  PHOTOGRID_TOGGLE_PHOTO_POPUP,
  PHOTOGRID_TOGGLE_SEARCH_PLACES,
  PHOTOGRID_ON_PAGE_CHANGE,
  PHOTOGRID_UPDATE_TEMP_PLACE,
  PHOTOGRID_UPDATE_LOCATION,
  PHOTOGRID_CANCEL_UPDATE_LOCATION,
} from '../actions/types';

const INITIAL_STATE = {
  searchPlacesModalVisible: false,
  photoModalVisible: false,
  currentPhotoUrl: '',
  currentPhotoPlace: null,
  tempPlace: null,
  currentPhotoIndex: 0
};

const updateLocation = (state, action) => {
  const {locations} = action.payload;
  const photoUrl = state.currentPhotoUrl;
  const {placeName, coordinates} = state.tempPlace;
  const newLocation = {
    placeName: placeName,
    coordinates: {
      latitude: coordinates.lat,
      longitude: coordinates.lng,
    }
  }

  const newLocations = [...locations, newLocation];

  return {
    locations: newLocations,
    currentPhotoPlace: placeName,
    tempPlace: null,
  };
}


const photoGridChange = (state, action) => {
  switch (action.type) {
    case PHOTOGRID_TOGGLE_PHOTO_POPUP:
      const {
        currentPhotoLocation,
        currentPhotoUrl,
        allPhotos
      } = action.payload;

      const getIndexFromSlide = (array) => {
        let index;
        array.find((element,i) => {
          if (element.source.uri === currentPhotoUrl) {
            index = i;
            return true;
          }
        })
        return index;
      }

      return {
        currentPhotoUrl,
        currentPhotoPlace: currentPhotoLocation && currentPhotoLocation.placeName,
        photoModalVisible: !state.photoModalVisible,
        currentPhotoIndex: getIndexFromSlide(allPhotos),
      };
    case PHOTOGRID_UPDATE_LOCATION:
      return updateLocation(state, action);
    default:
      return state;
  }
};


export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PHOTOGRID_TOGGLE_PHOTO_POPUP:
      return { ...state, ...photoGridChange(state, action) };
    case PHOTOGRID_TOGGLE_SEARCH_PLACES:
      return { ...state, searchPlacesModalVisible: !state.searchPlacesModalVisible };
    case PHOTOGRID_ON_PAGE_CHANGE:
      return { ...state, currentPhotoUrl: action.payload[0], currentPhotoPlace: action.payload[1]};
    case PHOTOGRID_UPDATE_TEMP_PLACE:
      return { ...state, tempPlace: {placeName: action.payload[0], coordinates: action.payload[1]}};
    case PHOTOGRID_UPDATE_LOCATION:
      return { ...state, ...photoGridChange(state, action) };
    case PHOTOGRID_CANCEL_UPDATE_LOCATION:
      return { ...state, tempPlace: action.payload };
    default:
      return state;
  }
};
