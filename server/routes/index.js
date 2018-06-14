const router = require('express').Router();
const controller = require('../controllers/controller');

router.post('/updateUserProfile', controller.updateUserProfile);
router.post('/createNewStory', controller.createNewStory);
router.post('/searchQuery', controller.searchQuery);
// router.get('/getRandomStories', controller.getRandomStories);

module.exports = router;
