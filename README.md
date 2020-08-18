# Serverless video upload with Firebase Storage, Cloud Functions and Publitio

![final.gif](https://www.learningsomethingnew.com/flutter-video-hls/final.gif)

An example app to demonstrate video sharing using Firebase Cloud Storage, using Cloud Functions to upload to [Publitio API](https://publit.io?fpr=jonathan43) for transcoding and hosting.

Full tutorial: ***medium link***

## Getting Started

You need to setup Firebase credentials in order to run the sample:

### Publitio setup
1. Create a free account at [Publit.io](https://publit.io?fpr=jonathan43), and get your credentials from the dashboard.
2. Put your API key and secret in `/cloud-functions/functions/publitio_credentials.json`

### Firebase setup
Complete the setup process as described [here](https://firebase.google.com/docs/flutter/setup).

You should add two files:
- Android: `android/app/google-services.json`
- iOS: `ios/Runner/GoogleService-Info.plist`

Then from the `cloud-functions` dir run:

```sh
firebase login
firebase deploy
```

This will deploy the cloud functions.

### Run the project
Run the project as usual using `flutter run`