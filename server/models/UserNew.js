
const mongoose = require('mongoose');

const { Schema } = mongoose;

// pre-defined sub-docs
const subCoordinates = { latitude: Number, longitude: Number };
const subLocation = { placeName: String, coordinates: subCoordinates };
const subItems = {
  date: String,
  filename: String,
  url: String,
  width: Number,
  height: Number,
  location: subLocation,
  tag: [String],
};

const storySchema = new Schema({
  title: String,
  description: String,
  dates: [String],
  travelPeriod: String,
  coverPhotoUrl: String,
  items: [subItems],
  city: String,
  country: String,
  coordinates: subCoordinates,
  maplocations: [subLocation],
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new Schema({
  uid: String,
  profile: {
    profilePhotoUri: String,
    email: String,
    name: String,
    password: String,
  },
  lastSearch: String,
  stories: [{ type: Schema.Types.ObjectId, ref: 'story' }],
  friends: {
    follower: [String],
    following: [String],
  },
});

const Story = mongoose.model('story', storySchema);
const User = mongoose.model('user', userSchema);

module.exports.StoryNew = Story;
module.exports.UserNew = User;
