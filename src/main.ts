import * as THREE from 'three'
import { Game } from './controller'
import { Tile } from './model'
import { generateBoxTile } from './view'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

const width = window.innerWidth
const height = window.innerHeight

const fontLoader = new FontLoader();
const FontPromises = {
  "Regular" : new Promise(resolve => {
    fontLoader.load("./fonts/Inconsolata_Regular.json", f => {
      resolve(f);
    });
  }),
  "SemiBold" : new Promise(resolve => {
    fontLoader.load("./fonts/Inconsolata_SemiBold.json", f => {
      resolve(f);
    });
  }),
  "SemiExpanded" : new Promise(resolve => {
    fontLoader.load("./fonts/Inconsolata_SemiExpanded_ExtraBold.json", f => {
      resolve(f);
    });
  })
}
const TextFontShapes = {
  "Regular": await FontPromises["Regular"],
  "SemiBold": await FontPromises["SemiBold"],
  "SemiExpanded": await FontPromises["SemiExpanded"],
}

// function getShaderFile(textFile: string) {
//   var request = new XMLHttpRequest();
//   request.open("GET", textFile, false);
//   request.overrideMimeType("text/plain");
//   request.send(null);
//   return request.responseText;
// };
// const vertexSrc = getShaderFile("./frag.glsl")
// const fragSrc = getShaderFile("./vertex.glsl")

// One-liner to resume playback when user interacted with the page. This is needed to 
// ensure that the audio plays in Chrome. Pressing any key starts background sound. 
document.querySelector('button').addEventListener('click', function() {
  context.resume().then(() => {
    console.log('Playback resumed successfully');
  });
});

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(50,width/height,0.1,2000)
// const camera = new THREE.OrthographicCamera();
const renderer = new THREE.WebGLRenderer({
	canvas: document.getElementById('app') as HTMLCanvasElement
})
renderer.setSize(width, height)

// adding background sound
const listener = new THREE.AudioListener();
camera.add(listener);
const audioLoader = new THREE.AudioLoader();
const backgroundSound = new THREE.Audio(listener);

audioLoader.load("./sound/forest.mp3", function(buffer) {
  backgroundSound.setBuffer(buffer);
  backgroundSound.setLoop(true);
  backgroundSound.setVolume(0.5);
  backgroundSound.play();
});

const boxTileTile = new Tile();
boxTileTile.value = 2;
const boxTile2 = generateBoxTile(boxTileTile);
console.log(boxTile2);
scene.add(boxTile2);

camera.position.z = 4;

// @ts-ignore Controls is not used but does not need to be since initializing the object sets up the orbit controls for us
const controls = new OrbitControls(camera, renderer.domElement)

let g = new Game();
// g.spawn();
// g.spawn();

const t1 = new Tile();
t1.value = 1024;
const t2 = new Tile();
t2.value = 1024;
g.grid.setTile(4,4,t1);
g.grid.setTile(3,4,t2);

function animate() {
  requestAnimationFrame(animate);

  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}
animate();

console.log(g)
console.log(g.toString());

// Game steps
window.addEventListener("keydown", (event) => {
  const scoreBefore = g.score;
  let moved = false;
  if ("ArrowUp" === event.key) {
    moved = g.moveUp();
  }
  else if ("ArrowLeft" === event.key) {
    moved = g.moveLeft();
  }
  else if ("ArrowDown" === event.key) {
    moved = g.moveDown();
  }
  else if ("ArrowRight" === event.key) {
    moved = g.moveRight();
  }
  const scored = scoreBefore - g !== 0;
  if (moved || scored) {
    g.spawn();
    // order of won and isGameOver important, can get 2048 with an unmovable board
    if (g.won) {
      alert("You won!");
    }
    else if (g.isGameOver()) {
      alert("Game over");
    }
    console.log(g.toString());
  }
})

export { TextFontShapes }
