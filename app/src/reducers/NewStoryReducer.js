import {
  NEWSTORY_CREATE_STORY,
  NEWSTORY_GET_PHOTOS,
  NEWSTORY_GOOGLE_PLACES_AUTOCOMPLETE,
  NEWSTORY_CHANGE_TITLE_INPUT,
  NEWSTORY_TOGGLE_STORY_MAP,
  NEWSTORY_TOGGLE_TEXT_EDITABLE,
  NEWSTORY_CHANGE_TEXT_EDITABLE_INPUT,
  PHOTOGRID_CHANGE_COVER_PHOTO,
  PHOTOGRID_DELETE_PHOTO,
  PHOTOGRID_UPDATE_LOCATION,
  NEWSTORY_TOGGLE_STORY,
  NEWSTORY_CLEAR_EVERYTHING,
} from '../actions/types';

const INITIAL_STATE = {
  isStoryMapClicked: false,
  arePhotosSelected: false,
  isTextEditable: false,
  story: null,
  dates: [],
  titleValue: '',
  textValue: '',
  selectedPhotos: {},
  selectedCity: null,
  selectedCountry: null,
  selectedCoordinates: null,
  travelPeriod: null,
  coverPhotoUrl: 'http://travel.home.sndimg.com/content/dam/images/travel/fullset/2014/12/3/top-10-caribbean-beaches-eagle-beach-aruba.jpg.rend.hgtvcom.966.725.suffix/1491584555480.jpeg',
  locations: [],
};



const getTravelPeriod = (dates) => {
  if (dates.length === 1) {
    return dates[0];
  } else {
    const early = dates[0].split(' ').map((element, i) => { if (i === 0 || i === 2) return Number(element); return element; });
    const late = dates[dates.length - 1].split(' ').map((element, i) => { if (i === 0 || i === 2) return Number(element); return element; });

    if (early[2] === late[2] && early[1] === late[1]) {
      return `${early[0]} - ${late[0]} ${late[1]} ${late[2]}`;
    } else if (early[2] === late[2]) {
      return `${early[0]} ${early[1]} - ${late[0]} ${late[1]} ${late[2]}`;
    } else {
      return `${early.join(' ')} - ${late.join(' ')}`;
    }
  }
}

const getInitialCoverPhoto = (nextSelectedPhotos, nextDates) => {
  const randomDateIndex = Math.floor(Math.random() * nextDates.length);
  const randomDatesArray = nextSelectedPhotos[nextDates[randomDateIndex]];
  const randomPhoto = randomDatesArray[Math.floor(Math.random() * randomDatesArray.length)];
  return randomPhoto.url;
};

const changeToSlide = (dates, selectedPhotos) => {
  const result = [];
  dates.forEach(date => {
    selectedPhotos[date].forEach(({ url, location }) => {
      result.push({
        source: {
          uri: url,
          locationName: location && location.placeName,
        }
      })
    })
  })
  return result;
}

// const deletePhoto = (state, photoUrl) => {
//   const selectedPhotos = state.selectedPhotos;
//   const updatedSelectedPhotos = {};
//   const allEachPhotos = Object.values(updatedSelectedPhotos);
//   const newLocations = [...state.locations];
//   let deleteLocation = null;
//
//   for (let date in selectedPhotos) {
//     const tuple = [];
//     selectedPhotos[date].forEach(photo => {
//       if (photo.url === photoUrl) {
//         if (photo.location) {
//           state.locations.forEach((location, i) => {
//             if (location.placeName === deleteLocation.placeName) {
//               newLocations.splice(i, 1);
//             }
//           })
//         }
//       } else {
//         tuple.push(photo);
//       }
//     })
//     if (tuple.length !== 0) {
//       updatedSelectedPhotos[date] = tuple;
//     }
//   }
//
//   const nextDates = compareDates(updatedSelectedPhotos);
//   const nextTravelPeriod = getTravelPeriod(nextDates);
//
//   console.log("UPDATES : ", updatedSelectedPhotos);
//
//   return {
//     selectedPhotos: updatedSelectedPhotos,
//     dates: nextDates,
//     //allPhotos: changeToSlide(nextDates, updatedSelectedPhotos),
//     locations: newLocations,
//     travelPeriod: nextTravelPeriod,
//     coverPhotoUrl: getInitialCoverPhoto(updatedSelectedPhotos, nextDates),
//   }
// };

const deletePhoto = (state, photoUrl) => {
  const updatedSelectedPhotos = Object.assign({}, state.selectedPhotos);
  const dates = Object.keys(updatedSelectedPhotos);
  const allEachPhotos = Object.values(updatedSelectedPhotos);
  const newLocations = [...state.locations];
  let coverPhotoUrl = state.coverPhotoUrl;
  let deleteLocation = null;

  allEachPhotos.forEach((eachPhotos, index) => {
    const foundPhotoIndex = eachPhotos.findIndex((photo) => photo.url === photoUrl);
    if (foundPhotoIndex !== -1) {
      if (eachPhotos[foundPhotoIndex].location) {
        deleteLocation = eachPhotos[foundPhotoIndex].location;
      }
      eachPhotos.splice(foundPhotoIndex, 1);
      if (!eachPhotos.length) {
        delete updatedSelectedPhotos[dates[index]];
        console.log('date deleted!');
      }
    }
  });

  if (deleteLocation) {
    state.locations.forEach((location, i) => {
      if (location.placeName === deleteLocation.placeName) {
        newLocations.splice(i, 1);
      }
    })
  }

  const nextDates = compareDates(updatedSelectedPhotos);
  const nextTravelPeriod = getTravelPeriod(nextDates);
  if (state.coverPhotoUrl === photoUrl) {
    coverPhotoUrl = getInitialCoverPhoto(updatedSelectedPhotos, nextDates);
  }

  console.log("UPDATES : ", updatedSelectedPhotos);
  return {
    selectedPhotos: updatedSelectedPhotos,
    dates: nextDates,
    locations: newLocations,
    travelPeriod: nextTravelPeriod,
    coverPhotoUrl,
  }
};


const compareDates = (selectedPhotos) => {
  const dates = Object.keys(selectedPhotos);
  return dates.sort((a, b) => new Date(a) > new Date(b));
}

const updateLocation = (state, action) => {
  const {currentPhotoUrl, tempPlace} = action.payload;
  const {placeName, coordinates} = tempPlace;
  const selectedPhotos = {...state.selectedPhotos};
  const newSelectedPhotos = {};
  const newLocation = {
    placeName: placeName,
    coordinates: {
      latitude: coordinates.lat,
      longitude: coordinates.lng,
    }
  }
  const nextLocations = [...state.locations, newLocation];
  for (let date in selectedPhotos) {
    const updates =
      selectedPhotos[date].map(photo => {
      return photo.url === currentPhotoUrl
        ? {
          ...photo,
          location: newLocation,
        } : photo;
    })
    newSelectedPhotos[date] = updates;
  }
  return {
    selectedPhotos: newSelectedPhotos,
    locations: nextLocations,
  };
}


const newStoryChange = (state, action) => {
  switch (action.type) {
    case NEWSTORY_GET_PHOTOS:
      const {nextSelectedPhotos, firstAdd} = action.payload;
      const nextDates = compareDates(nextSelectedPhotos);
      console.log("THIS IS NEXT DATES", nextDates);
      const nextTravelPeriod = getTravelPeriod(nextDates);
      const nextArePhotosSelected = firstAdd
        ? !state.arePhotosSelected
        : state.arePhotosSelected;
      let nextCoverPhotoUrl = state.coverPhotoUrl;
      if (firstAdd) {
        nextCoverPhotoUrl = getInitialCoverPhoto(nextSelectedPhotos, nextDates);
      }
      return {
        selectedPhotos: nextSelectedPhotos,
        dates : nextDates,
        travelPeriod: nextTravelPeriod,
        arePhotosSelected: nextArePhotosSelected,
        coverPhotoUrl: nextCoverPhotoUrl,
      };
    case NEWSTORY_GOOGLE_PLACES_AUTOCOMPLETE:
      const { selectedCity, selectedCountry, selectedCoordinates } = action.payload;
      return { selectedCity, selectedCountry, selectedCoordinates };
    case PHOTOGRID_UPDATE_LOCATION:
      return updateLocation(state, action)
    case PHOTOGRID_DELETE_PHOTO:
      return deletePhoto(state, action.payload);
    default:
      return state;
  }
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case NEWSTORY_CREATE_STORY:
      return { ...state, story: action.payload };
    case NEWSTORY_TOGGLE_STORY:
      return { ...INITIAL_STATE, selectedCity: state.selectedCity, selectedCountry: state.selectedCountry, titleValue: state.titleValue };
    case NEWSTORY_CLEAR_EVERYTHING:
      return { ...INITIAL_STATE };
    case NEWSTORY_GET_PHOTOS:
      return { ...state, ...newStoryChange(state, action) };
    case NEWSTORY_GOOGLE_PLACES_AUTOCOMPLETE:
      return { ...state, ...newStoryChange(state, action) };
    case NEWSTORY_CHANGE_TITLE_INPUT:
      return { ...state, titleValue: action.payload };
    case NEWSTORY_TOGGLE_STORY_MAP:
      return { ...state, isStoryMapClicked: !action.payload };
    case NEWSTORY_TOGGLE_TEXT_EDITABLE:
      return { ...state, isTextEditable: !action.payload };
    case NEWSTORY_CHANGE_TEXT_EDITABLE_INPUT:
      return { ...state, textValue: action.payload};
    case PHOTOGRID_CHANGE_COVER_PHOTO:
      return { ...state, coverPhotoUrl: action.payload };
    case PHOTOGRID_UPDATE_LOCATION:
      return { ...state, ...newStoryChange(state, action) }; //change selectedPhotos
    case PHOTOGRID_DELETE_PHOTO:
      return { ...state, ...newStoryChange(state, action) };
    default:
      return state;
  }
};
