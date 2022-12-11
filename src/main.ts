import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { Game } from './controller'
import { Tile } from './model'
import { generateBoxTile } from './view'


import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

const width = window.innerWidth
const height = window.innerHeight


// function getShaderFile(textFile: string) {
//   var request = new XMLHttpRequest();
//   request.open("GET", textFile, false);
//   request.overrideMimeType("text/plain");
//   request.send(null);
//   return request.responseText;
// };
// const vertexSrc = getShaderFile("./frag.glsl")
// const fragSrc = getShaderFile("./vertex.glsl")

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(50,width/height,0.1,2000)
// const camera = new THREE.OrthographicCamera();
const renderer = new THREE.WebGLRenderer({
	canvas: document.getElementById('app') as HTMLCanvasElement
})
renderer.setSize(width, height)


const boxTile2 = generateBoxTile(2);
console.log(boxTile2);
scene.add(boxTile2);

camera.position.z = 10;

// @ts-ignore Controls is not used but does not need to be since initializing the object sets up the orbit controls for us
const controls = new OrbitControls(camera, renderer.domElement)

const loader = new FontLoader();
loader.load('fonts/Inconsolata_Regular.json', function ( font ) {
	const textGeo = new TextGeometry( '2 4 8 16 32 64', {
		font: font,
		size: 3,
		height: 0.0001
	} );
  const textMat = new THREE.MeshBasicMaterial({color:0xff0000});
  const textMesh = new THREE.Mesh(textGeo, textMat);
  scene.add(textMesh);
} );

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
