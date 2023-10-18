import { Camera } from "@ionic-native/camera";
import { VideoCapturePlus } from "@ionic-native/video-capture-plus";

const openVideo = () => {
  const options = {
    limit: 1,
    highquality: true,
    portraitOverlay: "assets/img/camera/overlay/portrait.png",
    landscapeOverlay: "assets/img/camera/overlay/landscape.png",
  };
  VideoCapturePlus.captureVideo(options).then(
    (mediafile) => {
      alert(mediafile);
    },
    (error) => alert("Something went wrong")
  );
};

const openCam = async () => {
  const options = {
    quality: 100,
    destinationType: Camera.DestinationType.NATIVE_URI,
    sourceType: Camera.PictureSourceType.CAMERA,
    mediaType: Camera.MediaType.ALLMEDIA,
    cameraDirection: Camera.Direction.FRONT,
  };
  let base64 = null;
  await Camera.getPicture(options).then(
    (imageData) => {
      base64 = imageData;
    },
    (err) => {}
  );
  return base64;
};

const takePicture = () => {
  const pictureOpts = {
    width: 1280,
    height: 1280,
    quality: 100,
  };

  // take a picture
  Camera.getPicture(pictureOpts).then(
    (imageData) => {
      alert(imageData);
      Camera.stopCamera();
      this.picture = "data:image/jpeg;base64," + imageData;
    },
    (err) => {
      alert(err);
      console.log(err);
      this.picture = "assets/img/test.jpg";
    }
  );
};

export { takePicture, openCam, openVideo };
