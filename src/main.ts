import * as THREE from 'three'
import $ from 'jquery'
import { Game } from './controller'
import { Tile } from './model'
import { generateBoxTileBorder } from './view'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'

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

let fragSrc = "";
let vertSrc = "";
await $.ajax({
  url: "./glsl/fragment.glsl",
  dataType: "text",
  success: (result: any) => fragSrc = result,
  error: (err: any) => console.log(err),
});
await $.ajax({
  url: "./glsl/vertex.glsl",
  dataType: "text",
  success: (result: any) => vertSrc = result,
  error: (err: any) => console.log(err),
});
const shaderMat = new THREE.ShaderMaterial({
  fragmentShader: fragSrc,
  vertexShader: vertSrc,
});
const shaderGeo = new THREE.BoxGeometry(1,1,1);
const shaderMesh = new THREE.Mesh(shaderGeo,shaderMat);

// One-liner to resume playback when user interacted with the page. This is needed to 
// ensure that the audio plays in Chrome. Pressing any key starts background sound. 
// document.querySelector('button').addEventListener('click', function() {
//   context.resume().then(() => {
//     console.log('Playback resumed successfully');
//   });
// });

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(50,width/height,0.1,2000)
const renderer = new THREE.WebGLRenderer({
	canvas: document.getElementById('app') as HTMLCanvasElement,
})
renderer.setSize(width, height);

scene.add(shaderMesh);

// adding background sound
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

// // One-liner to resume playback when user interacted with the page. This is needed to 
// // ensure that the audio plays in Chrome. Pressing any key starts background sound. 
// document.getElementsByTagName('button')[0].addEventListener('click', function() {
//   context.resume().then(() => {
//     console.log('Playback resumed successfully');
//   });
// });

// bloom 
const renderScene = new RenderPass(scene, camera);
const composer = new EffectComposer(renderer);

const bloomPass = new UnrealBloomPass(
  // vec2 representing resolution of the scene 
  new THREE.Vector2(width, height),
  // intensity of effect
  0.8,
  // radius of bloom
  0.1,
  // pixels that exhibit bloom (found through trial and error)
  0.01
);

const fxaaPass = new ShaderPass( FXAAShader );
const copyPass = new ShaderPass( CopyShader );

composer.addPass(renderScene);
composer.addPass(bloomPass);
composer.addPass(fxaaPass);
composer.addPass(copyPass);

const boxTileTile = new Tile();
boxTileTile.value = 32;
const boxTile2 = generateBoxTileBorder(boxTileTile);
scene.add(boxTile2);
boxTile2.position.x -= 0.5;

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

  composer.render();
}
animate();

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


