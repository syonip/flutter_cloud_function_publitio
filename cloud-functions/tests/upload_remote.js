const PublitioAPI = require('publitio_js_sdk').default
const publitioCredentials = require('../functions/publitio_credentials.json')
const publitio = new PublitioAPI(publitioCredentials.key, publitioCredentials.secret)

publitio.uploadRemoteFile({
    file_url:
        'https://firebasestorage.googleapis.com/v0/b/imagesdemo-a95c2.appspot.com/o/video7816?alt=media&token=a3916f0b-53bd-4990-8d18-e8f9e6fe2162'
}).then(data => { console.log(data) })
    .catch(error => { console.log(error) })