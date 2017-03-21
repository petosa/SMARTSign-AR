# SMARTSign AR
## Available now on the Google Play Store!
https://play.google.com/store/apps/details?id=com.ionicframework.signbook563294

[![](http://i.imgur.com/d2IlRk0.png)](https://www.youtube.com/watch?v=WqTYQB4JrKk)

A cross-platform phone application for learning sign language on the fly. Part of The Center for Accessible Technology in Sign (CATS) at Georgia Tech. http://www.cats.gatech.edu/

Works on Android, iOS, and Windows phones.

# Description
Use the built in camera to snap photos of text you come across at school, at the library, or anywhere. Text is extracted from these photos to build pages of live text. Click on any of the text links to view a YouTube video courtesy of CATS demonstrating how to sign that word.

Pages can be saved to books so that you can organize and categorize your pages for future use.

<img src="http://i.imgur.com/dMEoybb.jpg" width="200"/>
<img src="http://i.imgur.com/mq1iLl1.jpg" width="200"/>
<img src="http://i.imgur.com/Pv8BPGA.png" width="200"/>
<img src="http://i.imgur.com/9qY3Vtx.png" width="200"/>

# How it Works
The app itself was built with the cross-platform ionic framework. OCR (text extraction from images) is done using Google's new Vision API: https://cloud.google.com/vision/
Note: If you clone this, make sure you install the Cordova whitelist and camera plugins.

# Build instructions
1. Install Node.js v4.4.7
2. Change directory into the cloned repo and run `npm install`
3. Run `npm install -g ionic` with proper permissions
4. Run `npm install -g cordova` with proper permissions
5. Run `ionic platform add ios` or `ionic platform add android` depending on what platform you are building it for.
6. Run `ionic build ios --release` or `ionic build android --release` to get an xCode project or an APK. You can also emulate your app or run it on a live device without building. All of those intracacies are detailed in the Ionic quick start guide. See http://ionicframework.com/docs/guide/testing.html

# Plugin Downloads
- cordova plugin add cordova-plugin-camera
- cordova plugin add cordova-plugin-file
- cordova plugin add cordova-plugin-whitelist
- cordova plugin add cordova-plugin-compat
