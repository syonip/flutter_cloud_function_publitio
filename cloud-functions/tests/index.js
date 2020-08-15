const admin = require('firebase-admin');
const stream = require('stream');
const path = require('path');
const os = require('os');
const fs = require('fs');
const serverKey = require('./imagesdemo-a95c2-firebase-adminsdk-jsoe9-30bd580e22.json')

admin.initializeApp({
    credential: admin.credential.cert(serverKey),
    storageBucket: "imagesdemo-a95c2.appspot.com",
}
);
const PublitioAPI = require('publitio_js_sdk').default
const publitioCredentials = require('../functions/publitio_credentials.json')
const publitio = new PublitioAPI(publitioCredentials.key, publitioCredentials.secret)

async function run() {

    const context = {
        params: {
            videoId: 'video1558'
        }
    }


    const bucket = admin.storage().bucket()

    const videoFile = bucket.file(context.params.videoId)

    // const contentType = videoFile.contentType;
    // const tempFilePath = path.join(os.tmpdir(), context.params.videoId);
    // const metadata = {
    //     contentType: contentType,
    // };
    // await videoFile.download({ destination: tempFilePath });
    // console.log('Image downloaded locally to', tempFilePath);
    // fs.unlinkSync(tempFilePath);
    // return;

    const fileStream = videoFile.createReadStream();
    console.log(new Date().toString())
    console.log(`uploading video file: ${videoFile.name}`)

    // const dataStream = new stream.PassThrough();
    // fileStream.pipe(dataStream);


    try {
        const data = await publitio.uploadFile(fileStream, 'file')
        
        console.log(new Date().toString())
        console.log('Uploading success. data:')
        console.log(data)

        if (data.code == 201) {
            admin.firestore().collection("videos").doc(videoFile.name).set({
                finishedProcessing: true,
                videoUrl: data.url_download,
                thumbUrl: data.url_thumbnail,
                aspectRatio: data.width / data.height,
              }, { merge: true });
            }
    }
    catch (error) {
        console.log(new Date().toString())
        console.error('Uploading error')
        console.error(error)
    }
}

run();