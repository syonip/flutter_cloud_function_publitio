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
        console.log(`uploading video file: ${videoFile.name}`)

        try {
            const data = await publitio.uploadFile(stream, 'file')
            console.log(`Uploading finished. status code: ${data.code}`)
            if (data.code == 201) {
                admin.firestore().collection("videos").doc(videoFile.name).set({
                    finishedProcessing: true,
                    videoUrl: data.url_download,
                    thumbUrl: data.url_thumbnail,
                    aspectRatio: data.width / data.height,
                    publitioId: data.id,
                }, { merge: true });
            }

            // Delete the source file if you want
            bucket.file(context.params.videoId).delete()
        }
        catch (error) {
            console.error('Uploading error')
            console.error(error)
        }
    });

exports.deleteVideo = functions.firestore
    .document('videos/{videoId}')
    .onDelete(async (snap, context) => {
        const videoId = context.params.videoId;
        const publitioId = snap.data().publitioId;
        console.log(`Deleting video file: ${videoId}`)

        try {
            const result = await publitio.call(`/files/delete/${publitioId}`, 'DELETE')
            console.log('delete complete. result:')
            console.log(result)
        }
        catch (error) {
            console.error('Delete error')
            console.error(error)
        }
    });
