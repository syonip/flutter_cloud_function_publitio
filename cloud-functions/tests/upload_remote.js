const PublitioAPI = require('publitio_js_sdk').default
const publitioCredentials = require('../functions/publitio_credentials.json')
const publitio = new PublitioAPI(publitioCredentials.key, publitioCredentials.secret)

console.log('start')
console.log(new Date().toString())

publitio.uploadRemoteFile({
    file_url:
        "https://firebasestorage.googleapis.com/v0/b/imagesdemo-a95c2.appspot.com/o/video2676.mp4?alt=media&token=70b7f73c-9a20-4cb3-9e10-d21733cb5676"
    // 'https://firebasestorage.googleapis.com/v0/b/imagesdemo-a95c2.appspot.com/o/video833.mp4?alt=media&token=5f82ed8f-6483-43c4-b85e-d95bc7aba2d7' //works
    // 'https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4' // works
}).then(data => {
    console.log('end')
    console.log(new Date().toString())
    console.log(data)
})
    .catch(error => { console.log(error) })