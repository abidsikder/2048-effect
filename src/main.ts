import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
// import { CopyShader } from 'three/examples/jsm/shaders/CopyShader'
// import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
// import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'

import { Game } from './controller'
import { Tile } from './model'
import { generateBoxTileBorder, generateNumberText, generateTitle, generateScore} from './view'
import { fragSrc, vertSrc } from './shaders'

class Effect2048 {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer;
  g: Game;

  constructor() {
    const width = window.innerWidth
    const height = window.innerHeight

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(50,width/height,0.1,2000)
    this.camera.position.z = 4;
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById('app') as HTMLCanvasElement,
    })
    this.renderer.setSize(width, height);

    this.g = new Game();

    // removes "this is undefined" error from animate() function
    this.animate = this.animate.bind(this)
  }

  public animate() {
    requestAnimationFrame(this.animate);

    // composer.render();
    this.renderer.render(this.scene, this.camera);
  }
}

// bloom 
// const renderScene = new RenderPass(scene, camera);
// const composer = new EffectComposer(renderer);

// const bloomPass = new UnrealBloomPass(
//   // vec2 representing resolution of the scene 
//   new THREE.Vector2(width, height),
//   // intensity of effect
//   0.8,
//   // radius of bloom
//   0.1,
//   // pixels that exhibit bloom (found through trial and error)
//   0.01
// );

// const fxaaPass = new ShaderPass( FXAAShader );
// const copyPass = new ShaderPass( CopyShader );
// composer.addPass(renderScene);
// composer.addPass(bloomPass);
// composer.addPass(fxaaPass);
// composer.addPass(copyPass);

const effect2048 = new Effect2048();

// @ts-ignore Controls is not used but does not need to be since initializing the object sets up the orbit controls for us
const orbitControls = new OrbitControls(effect2048.camera, effect2048.renderer.domElement)

const shaderGeo = new THREE.BoxGeometry(1,1,1);
const shaderMat = new THREE.ShaderMaterial({
  fragmentShader: fragSrc,
  vertexShader: vertSrc,
});
const shaderMesh = new THREE.Mesh(shaderGeo,shaderMat);
effect2048.scene.add(shaderMesh);


// TODO: !!! temp remove immediately after merge
const scene = effect2048.scene;
scene.background = new THREE.Color(0., 0.1, 0.1);

const boardTile = new Tile();
// TODO: add option for board border generation with proper color
//boardTile.value = colors.boardBorder;
const boardLen = 5;
const offset = 0.2;
const board = generateBoxTileBorder(boardTile, 0.04, 0.3,  boardLen);
scene.add(board);
board.position.x -= boardLen/2;

const tileLen = 1;

const tile2 = new Tile();
tile2.value = 2;
const textMesh2 = generateNumberText(tile2);
scene.add(textMesh2);
textMesh2.position.x -= boardLen/2 - offset;
textMesh2.position.y += boardLen/2 - tileLen/2 - offset;

const tile4 = new Tile();
tile4.value = 4;
const textMesh4 = generateNumberText(tile4);
scene.add(textMesh4);
textMesh4.position.x -= boardLen/2 - tileLen - (2 * offset);
textMesh4.position.y += boardLen/2 - tileLen/2 - offset;

const tile8 = new Tile();
tile8.value = 8;
const textMesh8 = generateNumberText(tile8);
scene.add(textMesh8);
textMesh8.position.x -= boardLen/2 - (2 * tileLen) - (3 * offset);
textMesh8.position.y += boardLen/2 - tileLen/2 - offset;

const tile16 = new Tile();
tile16.value = 16;
const textMesh16 = generateNumberText(tile16);
scene.add(textMesh16);
textMesh16.position.x -= boardLen/2 - (3 * tileLen) - (4 * offset);
textMesh16.position.y += boardLen/2 - tileLen/2 - offset;

const tile32 = new Tile();
tile32.value = 32;
const textMesh32 = generateNumberText(tile32);
scene.add(textMesh32);
textMesh32.position.x -= boardLen/2 - offset;
textMesh32.position.y += boardLen/2 - (3/2 * tileLen) - (2 * offset);

const tile64 = new Tile();
tile64.value = 64;
const textMesh64 = generateNumberText(tile64);
scene.add(textMesh64);
textMesh64.position.x -= boardLen/2 - tileLen - (2 * offset);
textMesh64.position.y += boardLen/2 - (3/2 * tileLen) - (2 * offset);

const tile128 = new Tile();
tile128.value = 128;
const textMesh128 = generateNumberText(tile128);
scene.add(textMesh128);
textMesh128.position.x -= boardLen/2 - (2 * tileLen) - (3 * offset);
textMesh128.position.y += boardLen/2 - (3/2 * tileLen) - (2 * offset);

const tile256 = new Tile();
tile256.value = 256;
const textMesh256 = generateNumberText(tile256);
scene.add(textMesh256);
textMesh256.position.x -= boardLen/2 - (3 * tileLen) - (4 * offset);
textMesh256.position.y += boardLen/2 - (3/2 * tileLen) - (2 * offset);

const tile512 = new Tile();
tile512.value = 512;
const textMesh512 = generateNumberText(tile512);
scene.add(textMesh512);
textMesh512.position.x -= boardLen/2 - offset;
textMesh512.position.y += boardLen/2 - (5/2 * tileLen) - (3 * offset);

const tile1024 = new Tile();
tile1024.value = 1024;
const textMesh1024 = generateNumberText(tile1024);
scene.add(textMesh1024);
textMesh1024.position.x -= boardLen/2 - tileLen - (2 * offset);
textMesh1024.position.y += boardLen/2 - (5/2 * tileLen) - (3 * offset);

const tile2048 = new Tile();
tile2048.value = 2048;
const textMesh2048 = generateNumberText(tile2048);
scene.add(textMesh2048);
textMesh2048.position.x -= boardLen/2 - (2 * tileLen) - (3 * offset);
textMesh2048.position.y += boardLen/2 - (5/2 * tileLen) - (3 * offset);


// function printFormatted(p: THREE.Vector3): void {
//   console.log(`new THREE.Vector3(${p.x}, ${p.y}, ${p.z})`)
// }

// console.log("2 position")
// printFormatted(textMesh2.position)

// pos1x: textMesh.position.x -= boardLen/2 - offset;
// pos1y: textMesh.position.y += boardLen/2 - tileLen/2 - offset;
// pos2x: textMesh.position.x -= boardLen/2 - tileLen - (2 * offset);
// pos2y: textMesh.position.y += boardLen/2 - tileLen/2 - offset;
// pos3x: textMesh.position.x -= boardLen/2 - (2 * tileLen) - (3 * offset);
// pos3y: textMesh.position.y += boardLen/2 - tileLen/2 - offset;
// pos4x: textMesh.position.x -= boardLen/2 - (3 * tileLen) - (4 * offset);
// pos4y: textMesh.position.y += boardLen/2 - tileLen/2 - offset;
// pos13x: textMesh.position.x -= boardLen/2 - offset
// pos13y: textMesh.position.x -= boardLen/2 - tileLen/2 - offset

// add title: 2048 Effect
const title = generateTitle();
scene.add(title);
title.position.multiplyScalar(0);
title.position.x -= boardLen/2;
title.position.y += boardLen/2.1 + tileLen/2;

// add score
const score = generateScore();
scene.add(score);
score.position.x += boardLen/3.7;
score.position.y += boardLen/2.1;

effect2048.animate();

// add message
const message = generateMessage();
scene.add(message);
message.position.x -= boardLen/2 - tileLen;
message.position.y -= boardLen/1.4;

effect2048.animate();

// Game steps
window.addEventListener("keydown", (event) => {
  const g = effect2048.g;
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
  const scored = scoreBefore - g.score !== 0;
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
