// var connection = new RTCMultiConnection();
// console.log(window.DetectRTC);
// // this line is VERY_important
// connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
// // all below lines are optional; however recommended.

// connection.session = {
//     audio: true,
//     video: true
// };

// connection.sdpConstraints.mandatory = {
//     OfferToReceiveAudio: true,
//     OfferToReceiveVideo: true
// };
// connection.onstream = function(event) {
//     document.body.appendChild( event.mediaElement );
// };
var connection = "";

export default connection;