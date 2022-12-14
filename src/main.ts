import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import { createNoise2D, NoiseFunction2D, createNoise4D, NoiseFunction4D } from 'simplex-noise'

import { Game } from './controller'
import { tileCoord, generateBoxTileBorder, generateNumberText, generateTitle, generateScore, generateMessage } from './view'
import { Tile, Grid } from './model'
import { fragSrc, vertSrc } from './shaders'

const BOARD_LEN = 5;

class Particles {
  NUM_PARTICLES = 100;

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
        THREE.MathUtils.randFloatSpread( 3 ),
        THREE.MathUtils.randFloatSpread( 3 ),
        THREE.MathUtils.randFloatSpread( 3 )
      );
      this.velocities[i] = new THREE.Vector3(
        THREE.MathUtils.randFloatSpread( 3 ),
        THREE.MathUtils.randFloatSpread( 3 ),
        THREE.MathUtils.randFloatSpread( 3 )
      );
    }

    this.psGeo = new THREE.BufferGeometry();
    this.psGeo.setFromPoints(this.positions);
    this.updateMesh(0);
  }

  updateMesh(time: number) {
    const bgPositions = this.psGeo.getAttribute('position');
    for (let i = 0; i < this.NUM_PARTICLES; i++) {
      const p = this.positions[i];
      bgPositions.setXYZ(i, p.x, p.y, p.z);
    }
    bgPositions.needsUpdate = true;

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

    /* Board Border */
    this.boardBorder = this.generateBoardBorder();
    this.scene.add(this.boardBorder);

    // removes "this is undefined" error from animate() function
    this.animate = this.animate.bind(this)
  }

  boardBorder: THREE.Mesh;

  generateBoardBorder(): THREE.Mesh {
    const THICKNESS:number = 0.04;
    const DEPTH: number = 0.3
    const BOARD_LENGTH: number = 5;

    // const shaderGeo = new THREE.BoxGeometry(1,1,1);
    // const shaderMat = new THREE.ShaderMaterial({
    //   fragmentShader: fragSrc,
    //   vertexShader: vertSrc,
    // });
    // const shaderMesh = new THREE.Mesh(shaderGeo,shaderMat);

    // const mat = new THREE.MeshBasicMaterial({color});
    const mat = new THREE.ShaderMaterial({
      fragmentShader: fragSrc,
      vertexShader: vertSrc,
      uniforms: {
        "time": {
          "value": this.time
        }
      }
    });

    const sideGeo = new THREE.BoxGeometry(THICKNESS, BOARD_LENGTH, DEPTH);
    const topBotGeo = new THREE.BoxGeometry(BOARD_LENGTH - 2*THICKNESS, THICKNESS, DEPTH);

    const leftMesh = new THREE.Mesh(sideGeo, mat);
    const rightMesh = new THREE.Mesh(sideGeo, mat);
    const topMesh = new THREE.Mesh(topBotGeo, mat);
    const botMesh = new THREE.Mesh(topBotGeo, mat);

    rightMesh.position.x += BOARD_LENGTH - THICKNESS;
    topMesh.position.x += BOARD_LENGTH/2 - THICKNESS/2;
    topMesh.position.y += BOARD_LENGTH/2 - THICKNESS/2;
    botMesh.position.x += BOARD_LENGTH/2 - THICKNESS/2;
    botMesh.position.y -= BOARD_LENGTH/2 - THICKNESS/2;

    const boxTile = new THREE.Group();
    boxTile.add(leftMesh);
    boxTile.add(rightMesh);
    boxTile.add(topMesh);
    boxTile.add(botMesh);
    boxTile.position.x -= BOARD_LEN/2;

    // @ts-ignore weird error
    return boxTile;
  }

  public animate() {
    requestAnimationFrame(this.animate);

    const allObjects = new Array();
    Grid.forEachCell(this.g.grid, (x, y, c) => {
      if (c === null) return;

      const tile = c;
      const tileMesh = generateNumberText(tile);
      this.scene.add(tileMesh);

      const tileScenePos = tileCoord[tile.nowPos.x][tile.nowPos.y];
      tileMesh.position.copy(tileScenePos);
      allObjects.push(tileMesh);
    });

    const score = generateScore(this.g.score);
    this.scene.add(score);
    score.position.x += BOARD_LEN/3.7;
    score.position.y += BOARD_LEN/2.1;

    this.time += this.TIME_STEP;

    this.scene.remove(this.ps.psMesh);
    this.ps.update(this.time, this.TIME_STEP);
    this.scene.add(this.ps.psMesh)

    this.scene.remove(this.boardBorder);
    this.boardBorder = this.generateBoardBorder();
    this.scene.add(this.boardBorder);

    this.effectComposer.render();

    for (let i = 0; i < allObjects.length; i++) {
      this.scene.remove(allObjects[i]); 
    }

    this.scene.remove(score);
  }
}

const effect2048 = new Effect2048();

// @ts-ignore Controls is not used but does not need to be since initializing the object sets up the orbit controls for us
const orbitControls = new OrbitControls(effect2048.camera, effect2048.renderer.domElement)

effect2048.scene.background = new THREE.Color(0.0, 0.1, 0.1);

// add title: 2048 Effect
const title = generateTitle();
effect2048.scene.add(title);
const tileLen = 1;
title.position.multiplyScalar(0);
title.position.x -= BOARD_LEN/2;
title.position.y += BOARD_LEN/2.1 + tileLen/2;

// const pointLight = new THREE.PointLight( 0xff0000, 1, 100 );
// pointLight.position.set( 10, 10, 10 );
// scene.add( pointLight );

// const sphereSize = 1;
// const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
// scene.add( pointLightHelper );

// add light 
const light = new THREE.PointLight(0x0000FF, 1);
light.position.set(title.position.x + tileLen, title.position.y, title.position.z + tileLen);
light.castShadow = true;
effect2048.scene.add(light);

// add light 
const light2 = new THREE.PointLight(0xFF0000, 1);
light2.position.set(title.position.x - tileLen, title.position.y +  tileLen, title.position.z + 1);
light2.castShadow = true;
effect2048.scene.add(light2);


//adding background sound
const listener = new THREE.AudioListener();
effect2048.camera.add(listener);
const audioLoader = new THREE.AudioLoader();
const backgroundSound = new THREE.Audio(listener);

audioLoader.load("./sound/background.mp3", function(buffer) {
  backgroundSound.setBuffer(buffer);
  backgroundSound.setLoop(true);
  backgroundSound.setVolume(0.5);
  backgroundSound.play();
});

// // One-liner to resume playback when user interacted with the page. This is needed to 
// // ensure that the audio plays in Chrome. Pressing any key starts background sound. 
// document.querySelector('button').addEventListener('click', function() {
//   context.resume().then(() => {
//     console.log('Playback resumed successfully');
//   });
// });



// // add score
// const score = generateScore(0);
// scene.add(score);

// add message
const message = generateMessage();
effect2048.scene.add(message);
message.position.x -= BOARD_LEN/2 - tileLen;
message.position.y -= BOARD_LEN/1.4;

effect2048.g.spawn();
effect2048.g.spawn();
effect2048.animate();


const audioLoaderDing = new THREE.AudioLoader();
const soundEffectDing = new THREE.Audio(listener);

// Game steps
window.addEventListener("keydown", (event) => {
  let g = effect2048.g;
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
  else if ("s" === event.key) {
    effect2048.scene.remove(effect2048.ps.psMesh);
    effect2048.ps = new Particles();
    effect2048.scene.add(effect2048.ps.psMesh);
  }

  const scored = scoreBefore - g.score !== 0;
  if (scored) {
    audioLoaderDing.load("./sound/ding.mp3", function (buffer) {
      soundEffectDing.setBuffer(buffer);
      soundEffectDing.setLoop(false);
      soundEffectDing.setVolume(0.4);
      soundEffectDing.play();
    });
    effect2048.scene.remove(effect2048.ps.psMesh);
    effect2048.ps = new Particles();
    effect2048.scene.add(effect2048.ps.psMesh);
  }
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
