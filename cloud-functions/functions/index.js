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
        const fileName = `${context.params.videoId}.mp4`;
        const videoFile = bucket.file(fileName)
        
        console.log(`uploading video file: ${videoFile.name}`)
        // const stream = videoFile.createReadStream();
        const downloadUrlArr = await videoFile.getSignedUrl({
            action: 'read',
            expires: '03-17-2025'
        });
        const downloadUrl = downloadUrlArr[0]

        var data;
        try {
            // const data = await publitio.uploadFile(stream, 'file')
            data = await publitio.uploadRemoteFile({file_url: downloadUrl})
            console.log(`Uploading finished. status code: ${data.code}`)
        }
        catch (error) {
            console.error('Uploading error')
            console.error(error)
        }

        if (data.code == 201) {
            console.log(`Setting data in firestore doc: ${context.params.videoId} with publitioID: ${data.id}`)
            await admin.firestore().collection("videos").doc(context.params.videoId).set({
                finishedProcessing: true,
                videoUrl: data.url_download,
                thumbUrl: data.url_thumbnail,
                aspectRatio: data.width / data.height,
                publitioId: data.id,
            }, { merge: true });
        }

        // Delete the source file if you want
        console.log('Deleting source file')
        await bucket.file(context.params.videoId).delete()
        console.log('Done')
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
