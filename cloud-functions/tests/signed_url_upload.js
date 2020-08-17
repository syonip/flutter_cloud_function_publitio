const admin = require('firebase-admin');
const axios = require('axios').default;
const queryString = require('query-string');
const serverKey = require('./imagesdemo-a95c2-firebase-adminsdk-jsoe9-30bd580e22.json')

admin.initializeApp({
    credential: admin.credential.cert(serverKey),
    storageBucket: "imagesdemo-a95c2.appspot.com",
});


async function run() {
    const bucket = admin.storage().bucket()
    const file = bucket.file(`filename.ext`)
    var expires = new Date()
    expires.setTime(expires.getTime() + (12 * 60 * 60 * 1000))
    const signedUrlArr = await file.getSignedUrl({
        action: 'resumable',
        expires: expires,
    })
    const signedUrl = signedUrlArr[0]
    const qsArr = signedUrl.split('?')
    const params = queryString.parse(qsArr[1]);

    try {
        const options = {
            headers: { "x-goog-resumable": "start" }
        };
        const response = await axios.post(
            qsArr[0],
            { params },
            options,
        )
        console.log(response)

    } catch (e) {
        console.error(e.response.data)
    }
}


run();
