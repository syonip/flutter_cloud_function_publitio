const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const PublitioAPI = require('publitio_js_sdk').default
const publitioCredentials = require('./publitio_credentials.json')
const publitio = new PublitioAPI(publitioCredentials.key, publitioCredentials.secret)


exports.uploadNewVideo = functions.firestore
    .document('videos/{videoId}')
    .onCreate(async (snap, context) => {
        const bucket = admin.storage().bucket()
        const videoFile = bucket.file(context.params.videoId)
        const stream = videoFile.createReadStream();
        console.log(videoFile.name)

        publitio.uploadFile(stream, 'file')
            .then(data => { console.log(data) })
            .catch(error => { console.log(error) })
    });
