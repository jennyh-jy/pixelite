# Introduction

Pixelite is a mobile app that provides unique features to travel enthusiasts. You can easily create a travel story out of selected photos, share your stories on the platform, and search for other stories when you're planning your next adventure.

These are some of the features Pixelite can offer:

- create travel stories with a timeline and places you've visited only with a few simple steps
- make a personalized world map with all the places you've travelled to
- check out other people's stories by searching for a location(city, country, or name of a specific place) and/or a keyword(e.g. surfing, mountain, food) that you're interested in
 
### Demo
https://bit.ly/pixelite_demo


# Getting started

1. Run **npm install** to download the packages

2. Run **react-native link**

3. Run the following command depending on your platform
- iOS: **react-native run-ios**
- Android: **react-native run-android**


## Client-side

Pixelite utilizes multiple API keys that are used to access login and geolocation information. In order to run the app, create a file named **"apis.js"** under pixelite > app folder with the following template. You will need to get your own API keys from Google and AWS.

<pre><code>
exports.GOOGLE_PLACES_API_KEY = "*****************************";
exports.GOOGLE_FIREBASE_API_KEY = "*****************************";
exports.AWS_ACCESS_KEY = "*****************************";
exports.AWS_SECRET_KEY = "*****************************";

</pre></code>


## Server-side

Go to pixelite > server > config, and create a file named **"dev.js"** with the following template. You can get your MongoDB URI after going through the steps in 'Quick-Start Guide to mLab'(http://docs.mlab.com/).

```
module.exports = {
  mongoURI: ‘mongodb://*****:*****@******.mlab.com:*****/your-projectname’,
};
```


# Any questions or feedback?

Feel free to drop us an email at pixelite1010@gmail.com!
