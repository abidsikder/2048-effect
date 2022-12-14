// // One-liner to resume playback when user interacted with the page. This is needed to 
// // ensure that the audio plays in Chrome. Pressing any key starts background sound. 
// document.querySelector('button').addEventListener('click', function() {
//   context.resume().then(() => {
//     console.log('Playback resumed successfully');
//   });
// });

// //adding background sound
// const listener = new THREE.AudioListener();
// camera.add(listener);
// const audioLoader = new THREE.AudioLoader();
// const backgroundSound = new THREE.Audio(listener);

// // TODO wrap in proper promise
// audioLoader.load("./sound/forest.mp3", function(buffer) {
//   backgroundSound.setBuffer(buffer);
//   backgroundSound.setLoop(true);
//   backgroundSound.setVolume(0.5);
//   backgroundSound.play();
// });
