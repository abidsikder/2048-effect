import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import { createNoise2D, NoiseFunction2D, createNoise4D, NoiseFunction4D } from 'simplex-noise'

import { Game } from './controller'
import { colors, tileCoord, generateBoxTileBorder, generateNumberText, generateTitle, generateScore, generateMessage } from './view'
import { GRID_SIZE, Position, Tile, Grid } from './model'
import { fragSrc, vertSrc } from './shaders'

class Particles {
  NUM_PARTICLES = 500;

  positions: THREE.Vector3[] = [];
  velocities: THREE.Vector3[] = [];
  // @ts-ignore
  psGeo: THREE.BufferGeometry;
  // @ts-ignore
  psMesh: THREE.Points;
  
  xNoise: NoiseFunction4D;
  yNoise: NoiseFunction4D;
  zNoise: NoiseFunction4D;
  hueNoise: NoiseFunction2D;

  constructor() {
    this.xNoise = createNoise4D();
    this.yNoise = createNoise4D();
    this.zNoise = createNoise4D();
    this.hueNoise = createNoise2D();

    for (let i = 0; i < this.NUM_PARTICLES; i++) {
      this.positions[i] = new THREE.Vector3(
        THREE.MathUtils.randFloatSpread( 7 ),
        THREE.MathUtils.randFloatSpread( 7 ),
        THREE.MathUtils.randFloatSpread( 7 )
      );
      this.velocities[i] = new THREE.Vector3(
        THREE.MathUtils.randFloatSpread( 3 ),
        THREE.MathUtils.randFloatSpread( 3 ),
        THREE.MathUtils.randFloatSpread( 3 )
      );
    }

    this.updateMesh(0);
  }

  updateMesh(time: number) {
    this.psGeo = new THREE.BufferGeometry();
    this.psGeo.setFromPoints(this.positions);
    const color = new THREE.Color(`hsl(${Math.abs(this.hueNoise(this.NUM_PARTICLES, time))*360}, 100%,50%)`);
    const psMat = new THREE.PointsMaterial({color});
    psMat.size = 0.1;
    this.psMesh = new THREE.Points(this.psGeo, psMat);
  }

  update(time: number, timeStep: number) {
    for (let i = 0; i < this.NUM_PARTICLES; i++) {
      const p = this.positions[i];
      const v = this.velocities[i];
      const aX = this.xNoise(p.x, p.y, p.z, time);
      const aY = this.yNoise(p.x, p.y, p.z, time);
      const aZ = this.zNoise(p.x, p.y, p.z, time);

      v.x += aX*timeStep;
      v.y += aY*timeStep;
      v.z += aZ*timeStep;
      p.addScaledVector(v, timeStep);
    }

    this.updateMesh(time/100);
  }
}

class Effect2048 {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer;
  g: Game;

  ps: Particles;

  time: number;
  TIME_STEP = 0.05;

  effectComposer: EffectComposer;

  constructor() {
    this.g = new Game();
    this.time = 0;

    /* Basic Scene Stuff */
    const width = window.innerWidth
    const height = window.innerHeight

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(50,width/height,0.1,2000)
    this.camera.position.z = 10;
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById('app') as HTMLCanvasElement,
    })
    this.renderer.setSize(width, height);

    /* Unreal Bloom Pass */ 
    const renderScene = new RenderPass(this.scene, this.camera);
    const effectComposer = new EffectComposer(this.renderer);

    const bloomPass = new UnrealBloomPass(
      // vec2 representing resolution of the scene 
      new THREE.Vector2(width, height),
      // intensity of effect
      0.4,
      // radius of bloom
      0.04,
      // pixels that exhibit bloom (found through trial and error)
      0.01
    );

    effectComposer.addPass(renderScene);
    effectComposer.addPass(bloomPass);

    this.effectComposer = effectComposer;

    /* Particles */

    this.ps = new Particles();
    this.scene.add(this.ps.psMesh);

    // removes "this is undefined" error from animate() function
    this.animate = this.animate.bind(this)
  }

  public animate() {
    requestAnimationFrame(this.animate);

    const allObjects = new Array();
    Grid.forEachCell(this.g.grid, (x, y, c) => {
      if (c !== null) {
        const tileToAdd = generateNumberText(c);
        this.scene.add(tileToAdd);
        const pos = (4 * (y - 1)) + x;
        tileToAdd.position.x = tileCoord[pos].x;
        tileToAdd.position.y = tileCoord[pos].y;
        tileToAdd.position.z = tileCoord[pos].z;
        allObjects.push(tileToAdd);
      }
    });

    this.time += this.TIME_STEP;

    this.scene.remove(this.ps.psMesh);
    this.ps.update(this.time, this.TIME_STEP);
    this.scene.add(this.ps.psMesh)

    this.effectComposer.render();

    for (let i = 0; i < allObjects.length; i++) {
      this.scene.remove(allObjects[i]); 
    }
  }
}

// bloom 

const effect2048 = new Effect2048();

// @ts-ignore Controls is not used but does not need to be since initializing the object sets up the orbit controls for us
const orbitControls = new OrbitControls(effect2048.camera, effect2048.renderer.domElement)

// const shaderGeo = new THREE.BoxGeometry(1,1,1);
// const shaderMat = new THREE.ShaderMaterial({
//   fragmentShader: fragSrc,
//   vertexShader: vertSrc,
// });
// const shaderMesh = new THREE.Mesh(shaderGeo,shaderMat);
// effect2048.scene.add(shaderMesh);


// TODO: !!! temp remove immediately after merge
const scene = effect2048.scene;
scene.background = new THREE.Color(0.0, 0.1, 0.1);

const boardTile = new Tile();
// TODO: add option for board border generation with proper color
boardTile.value = 0;
const boardLen = 5;
const offset = 0.2;
const board = generateBoxTileBorder(boardTile, 0.04, 0.3,  boardLen);
scene.add(board);
board.position.x -= boardLen/2;

const tileLen = 1;

// const tile2 = new Tile();
// tile2.value = 2;
// const textMesh2 = generateNumberText(tile2);
// scene.add(textMesh2);
// textMesh2.position.x -= boardLen/2 - offset;
// textMesh2.position.y += boardLen/2 - tileLen/2 - offset;

// const tile4 = new Tile();
// tile4.value = 4;
// const textMesh4 = generateNumberText(tile4);
// scene.add(textMesh4);
// textMesh4.position.x -= boardLen/2 - tileLen - (2 * offset);
// textMesh4.position.y += boardLen/2 - tileLen/2 - offset;

// const tile8 = new Tile();
// tile8.value = 8;
// const textMesh8 = generateNumberText(tile8);
// scene.add(textMesh8);
// textMesh8.position.x -= boardLen/2 - (2 * tileLen) - (3 * offset);
// textMesh8.position.y += boardLen/2 - tileLen/2 - offset;

// const tile16 = new Tile();
// tile16.value = 16;
// const textMesh16 = generateNumberText(tile16);
// scene.add(textMesh16);
// textMesh16.position.x -= boardLen/2 - (3 * tileLen) - (4 * offset);
// textMesh16.position.y += boardLen/2 - tileLen/2 - offset;

// const tile32 = new Tile();
// tile32.value = 32;
// const textMesh32 = generateNumberText(tile32);
// scene.add(textMesh32);
// textMesh32.position.x -= boardLen/2 - offset;
// textMesh32.position.y += boardLen/2 - (3/2 * tileLen) - (2 * offset);

// const tile64 = new Tile();
// tile64.value = 64;
// const textMesh64 = generateNumberText(tile64);
// scene.add(textMesh64);
// textMesh64.position.x -= boardLen/2 - tileLen - (2 * offset);
// textMesh64.position.y += boardLen/2 - (3/2 * tileLen) - (2 * offset);

// const tile128 = new Tile();
// tile128.value = 128;
// const textMesh128 = generateNumberText(tile128);
// scene.add(textMesh128);
// textMesh128.position.x -= boardLen/2 - (2 * tileLen) - (3 * offset);
// textMesh128.position.y += boardLen/2 - (3/2 * tileLen) - (2 * offset);

// const tile256 = new Tile();
// tile256.value = 256;
// const textMesh256 = generateNumberText(tile256);
// scene.add(textMesh256);
// textMesh256.position.x -= boardLen/2 - (3 * tileLen) - (4 * offset);
// textMesh256.position.y += boardLen/2 - (3/2 * tileLen) - (2 * offset);

// const tile512 = new Tile();
// tile512.value = 512;
// const textMesh512 = generateNumberText(tile512);
// scene.add(textMesh512);
// textMesh512.position.x -= boardLen/2 - offset;
// textMesh512.position.y += boardLen/2 - (5/2 * tileLen) - (3 * offset);

// const tile1024 = new Tile();
// tile1024.value = 1024;
// const textMesh1024 = generateNumberText(tile1024);
// scene.add(textMesh1024);
// textMesh1024.position.x -= boardLen/2 - tileLen - (2 * offset);
// textMesh1024.position.y += boardLen/2 - (5/2 * tileLen) - (3 * offset);

// const tile2048 = new Tile();
// tile2048.value = 2048;
// const textMesh2048 = generateNumberText(tile2048);
// scene.add(textMesh2048);
// textMesh2048.position.x -= boardLen/2 - (2 * tileLen) - (3 * offset);
// textMesh2048.position.y += boardLen/2 - (5/2 * tileLen) - (3 * offset);


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
const score = generateScore(0);
scene.add(score);
score.position.x += boardLen/3.7;
score.position.y += boardLen/2.1;

// add message
const message = generateMessage();
scene.add(message);
message.position.x -= boardLen/2 - tileLen;
message.position.y -= boardLen/1.4;

effect2048.g.spawn();
effect2048.g.spawn();
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
