const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();


exports.uploadNewVideo = functions.firestore
    .document('videos/{videoId}')
    .onCreate(async (snap, context) => {

        const bucket = admin.storage().bucket();
        const videoFile = bucket.file(context.params.videoId);
        
        console.log(videoFile.name);
        
    });
