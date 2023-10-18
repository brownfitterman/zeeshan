import { IonicNativePlugin, cordova } from "@ionic-native/core";
import { Observable } from "rxjs";
var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
var FirebaseAuthenticationOriginal = /** @class */ (function (_super) {
  __extends(FirebaseAuthenticationOriginal, _super);
  function FirebaseAuthenticationOriginal() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  FirebaseAuthenticationOriginal.prototype.getCurrentUser = function () {
    return cordova(this, "getCurrentUser", { sync: true }, arguments);
  };
  FirebaseAuthenticationOriginal.prototype.setAuthStateChanged = function (
    disable
  ) {
    return cordova(this, "setAuthStateChanged", { sync: true }, arguments);
  };
  FirebaseAuthenticationOriginal.pluginName = "FirebaseAuthentication";
  FirebaseAuthenticationOriginal.plugin =
    "cordova-plugin-firebase-authentication";
  FirebaseAuthenticationOriginal.pluginRef = "cordova.plugins.firebase.auth";
  FirebaseAuthenticationOriginal.repo =
    "https://github.com/chemerisuk/cordova-plugin-firebase-authentication";
  FirebaseAuthenticationOriginal.install =
    "ionic cordova plugin add cordova-plugin-firebase-authentication --variable FIREBASE_AUTH_VERSION=version";
  FirebaseAuthenticationOriginal.installVariables = ["FIREBASE_AUTH_VERSION"];
  FirebaseAuthenticationOriginal.platforms = ["Android", "iOS"];
  return FirebaseAuthenticationOriginal;
})(IonicNativePlugin);
var FirebaseAuthenticationCustom = new FirebaseAuthenticationOriginal();
export { FirebaseAuthenticationCustom };
