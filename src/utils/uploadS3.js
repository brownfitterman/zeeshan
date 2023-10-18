import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const s3 = new AWS.S3({
  accessKeyId: "AKIAX5ZODTI63TLRUFUW",
  secretAccessKey: "2aC7tGb36Sl7i3HjIDT0oneog/oEk9O2V9x4TBo",
  region: "ap-south-1",
  signatureVersion: "v3",
});

const dataURItoBlob = (dataURI) => {
  var binary = window.atob(dataURI.split(",")[1]);
  // var binary = atob(dataURI);
  var array = [];
  for (var i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: "image/jpeg" });
};

const addImage = async (image, folder, func) => {
  await s3.upload(
    {
      Bucket: "dod-res-images",
      Key: folder + "/" + Date.now() + "-" + uuidv4() + ".jpeg",
      Body: dataURItoBlob(image),
      ACL: "public-read",
    },
    function (err, data) {
      if (err) {
        alert("unable to upload the file please try later");
        return null;
      }
      if (typeof func == "function" && data) {
        func(data.Location);
      }
    }
  );
  return;
};

export { addImage };
