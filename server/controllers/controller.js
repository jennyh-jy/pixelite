/* eslint-disable no-underscore-dangle, no-tabs, no-param-reassign */
const reko = require('../services/rekognition');
const { UserNew, StoryNew } = require('../models/UserNew');

exports.updateUserProfile = (req, res) => {
  console.log('a user connected: ', req.body);
  UserNew.findOne({ uid: req.body.uid })
    .then((doc) => {
      if (!doc) {
        const newUser = new UserNew(req.body);
        newUser.save()
          .then(res.send(`UserNew ${req.body.uid} saved`))
          .catch(err => console.log(err));
      } else {
        UserNew.findOne({ uid: req.body.uid })
          .populate('stories')
          .exec((err, sendInfo) => {
            console.log('send user Info to client: ', sendInfo.uid);
            res.send(sendInfo);
          });
      }
    }).catch(err => console.log(err));
};

exports.createNewStory = (req, res) => {
  // max 15 labels from rekognition
  const MAX = 15;
  // over 70 confidence level from rekognition
  const CONFIDENCE = 70;
  const newStory = new StoryNew(req.body.story);
  console.log('Create newStory: ', newStory.title);
  console.log('newStory: ', JSON.stringify(newStory, undefined, 2));
  newStory.save((error, savedStory) => {
    if (!error) {
      UserNew.findOne({ uid: req.body.user.uid })
        .then((user) => {
          user.stories.addToSet(newStory._id);
          user.save();
          res.send(newStory);
        }).catch(err => console.log(err));
      StoryNew.findOne({ _id: savedStory._id })
        .then((story) => {
          const uris = req.body.story.items.map(item => item.url);
          const promiseArr = [];
          for (let i = 0; i < uris.length; i += 1) {
            promiseArr.push(reko(uris[i], MAX, CONFIDENCE));
          }
          const tagsArr = [];
          Promise.all(promiseArr)
            .then((resultArr) => {
              resultArr.forEach((result) => {
                const aTag = [];
                result.Labels.forEach((aTagObj) => {
                  aTag.push(aTagObj.Name.toLowerCase());
                });
                tagsArr.push(aTag);
              });
              for (let i = 0; i < tagsArr.length; i += 1) {
                console.log('Changed to Rekognized tags: ', story.items[i].tag, ' -> ', tagsArr[i]);
                story.items[i].tag = tagsArr[i];
              }
              story.save();
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }
  });
};

exports.searchQuery = (req, res) => {
  console.log('searchQuery!');
  const RegExpArr = [];
  if (req.body.tag !== '' && req.body.location === '') {
    const searchTags = req.body.tag.split(' ').map(word => word.toLowerCase());
    console.log('tags for search : ', searchTags);
    StoryNew.find({ 'items.tag': { $in: searchTags } })
      .then((stories) => {
        console.log('find stories: ', JSON.stringify(stories, undefined, 2));
        res.send(stories);
      }).catch(err => console.log(err));
  } else if (req.body.tag === '' && req.body.location !== '') {
    const searchLocations = req.body.location.split(' ').map(word => word.toLowerCase());
    searchLocations.forEach((word) => {
      // option i, ignore case
      RegExpArr.push(new RegExp(word, 'i'));
    });
    console.log('locations for search : ', RegExpArr);
    StoryNew.find({ $or: [
      { city: { $in: RegExpArr } },
      { 'items.location.placeName': { $in: RegExpArr } },
      { country: { $in: RegExpArr } }],
    })
      .then((stories) => {
        console.log('find stories: ', stories);
        res.send(stories);
      }).catch(err => console.log(err));
  } else {
    const searchTags = req.body.tag.split(' ').map(word => word.toLowerCase());
    console.log('tags for search : ', searchTags);
    const searchLocations = req.body.location.split(' ').map(word => word.toLowerCase());
    searchLocations.forEach((word) => {
      RegExpArr.push(new RegExp(word, 'i'));
    });
    console.log('locations for search : ', RegExpArr);
    // StoryNew.find({
    //   $and: [
    //     { $or : [ { city: { $in: RegExpArr } }, { 'items.location.placeName': { $in: RegExpArr } }, { country: { $in: RegExpArr } } ]},
    //     { $or : [ { 'items.tag': { $in: searchTags } }, { searchTags : { $in: 'items.tag' } } ] }
    //   ]
    // })
    StoryNew.find({ $or: [
      { city: { $in: RegExpArr } },
      { 'items.location.placeName': { $in: RegExpArr } },
      { country: { $in: RegExpArr } }],
    }).where('items.tag').in(searchTags)
      .then((stories) => {
        console.log('found stories: ', stories);
        res.send(stories);
      })
      .catch(err => console.log(err));
  }
};


/* eslint-disable no-tabs */

// example object for createNewStory
//   {	"user": { "uid": "postmanNewUserTest" },
// "story": {
//	"uid": "postmanNewUserTest",
//	"title": "postmanStoryTest",
//	"description": "story description",
//	"dates": ["20191010"],
//	"travelPeriod": "20191010-20191011",
//	"coverPhotoUrl": "String",
//	"items": [{
//		"date": "20191010",
//		"filename": "image1.jpg",
//		"url": "https:~",
//		"width": 200,
//		"height": 100,
//		"location": "Han River",
//		"tag": ["Jeju"]
//		},
//		{
//		"date": "20191011",
//		"filename": "image2.jpg",
//		"url": "https:~",
//		"width": 300,
//		"height": 400,
//		"location": "Some River",
//		"tag": ["Ganwon"]
//		}],
//	"city": "Seoul",
//	"country": "Republic of Korea",
//	"coordinates": { "latitude": 0, "longitude": 10 },
//	"maplocations": [
//	  	{ "placeName": "mapunknown1", "coordinates": { "latitude": 0, "longitude": 100 }},
//		{ "placeName": "mapunknown2", "coordinates": { "latitude": 0, "longitude": 200 }}
//		]
// }
// }

// example object for updateUserProfile
// {
// 	"user": {
// 		 "uid": "postmanNewUserTest2",
// 		 "profile": {
// 			"profilePhotoUri": "imgUrlTest",
// 		    "email": "asdf@asdf.com",
// 		    "name": "MarkJCS",
//     		"password": "Secret"
// 		},
// 		"lastSearch": "jeju",
// 		"stories": [],
// 		"friends": {
//     		"follower": ["katu"],
//     		"following": ["jenny"]
// 		}
// 	}
// }
