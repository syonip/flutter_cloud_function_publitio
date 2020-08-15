import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_cloud_function_publitio/models/video_info.dart';

class FirebaseProvider {
  static saveVideo(String videoName) async {
    await Firestore.instance.collection('videos').document(videoName).setData({
      'finishedProcessing': false,
      'videoName': videoName,
    });
  }

  static deleteVideo(String videoName) async {
    await Firestore.instance.collection('videos').document(videoName).delete();
  }

  static listenToVideos(callback) async {
    Firestore.instance.collection('videos').snapshots().listen((qs) {
      final videos = mapQueryToVideoInfo(qs);
      callback(videos);
    });
  }

  static mapQueryToVideoInfo(QuerySnapshot qs) {
    return qs.documents.map((DocumentSnapshot ds) {
      return VideoInfo(
        videoUrl: ds.data['videoUrl'],
        thumbUrl: ds.data['thumbUrl'],
        coverUrl: ds.data['coverUrl'],
        aspectRatio: ds.data['aspectRatio'],
        videoName: ds.data['videoName'],
        uploadedAt: ds.data['uploadedAt'],
        finishedProcessing: ds.data['finishedProcessing'] == true,
      );
    }).toList();
  }
}
