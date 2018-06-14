const AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');
const rekognition = new AWS.Rekognition();

const reko = (uri, maxLabels, minConfidence) => {
  return new Promise((resolve, reject) => {
    const modifiedUri = uri.slice(uri.lastIndexOf('uploads/'));
    const params = {
      Image: {
        S3Object: {
          Bucket: 'pixelite-s3',
          Name: modifiedUri,
        },
      },
      MaxLabels: maxLabels,
      MinConfidence: minConfidence,
    };
    rekognition.detectLabels(params, (err, data) => {
      if (err) return reject(err.stack);
      resolve(data);
    });
  });
};

/* input a uris array */
// const reko = (uris, maxLabels, minConfidence) => {
//
//   function rekognitionAsync(params) {
//     return new Promise((resolve, reject) => {
//       rekognition.detectLabels(params, (err, data) => {
//         if (err) return reject(err.stack);
//         resolve(data);
//       });
//     });
//   }
//
//   const promiseArray = uris.map((uri) => {
//     const modifiedUri = uri.slice(uri.lastIndexOf('uploads/'));
//     const params = {
//       Image: {
//         S3Object: {
//           Bucket: 'pixelite-s3-oregon',
//           Name: modifiedUri,
//         },
//       },
//       MaxLabels: maxLabels,
//       MinConfidence: minConfidence,
//     };
//     return rekognitionAsync(params);
//   });
//
//   Promise.all(promiseArray)
//   .then((datas) => {
//     const labelsArr = datas
//     .map(data => data.Labels
//       .map(label => label.Name));
//     console.log('labelsArr[0]: ', labelsArr[0]);
//     return labelsArr[0];
//   });
// };

module.exports = reko;
