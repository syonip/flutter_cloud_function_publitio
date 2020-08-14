const admin = require('firebase-admin');
admin.initializeApp();
const PublitioAPI = require('publitio_js_sdk').default
const publitioCredentials = require('../functions/publitio_credentials.json')
const publitio = new PublitioAPI(publitioCredentials.key, publitioCredentials.secret)


const context = {
    params: {
        videoId: 'video1558'
    }
}


const bucket = admin.storage().bucket('imagesdemo-a95c2')
const videoFile = bucket.file(context.params.videoId)
const stream = videoFile.createReadStream();
console.log(videoFile.name)

console.log('Uploading file to publitio')
publitio.uploadFile(stream, 'file')
    .then(data => { 
        console.log('UPLOAD SUCCESS')
        console.log(data) })
    .catch(error => { 
        console.error('PUBLITIO ERROR')
        console.log(error) })

