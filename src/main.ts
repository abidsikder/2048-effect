import * as THREE from 'three'
import { Game } from './controller'
import { Tile } from './model'
import { generateBoxTileBorder } from './view'
import { fragSrc, vertSrc } from './shaders'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
// import { CopyShader } from 'three/examples/jsm/shaders/CopyShader'
// import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
// import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'

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


// g.spawn();
// g.spawn();

const effect2048 = new Effect2048();

// @ts-ignore Controls is not used but does not need to be since initializing the object sets up the orbit controls for us
const orbitControls = new OrbitControls(effect2048.camera, effect2048.renderer.domElement)

const t1 = new Tile();
t1.value = 1024;
const t2 = new Tile();
t2.value = 1024;
effect2048.g.grid.setTile(4,4,t1);
effect2048.g.grid.setTile(3,4,t2);

const shaderGeo = new THREE.BoxGeometry(1,1,1);
const shaderMat = new THREE.ShaderMaterial({
  fragmentShader: fragSrc,
  vertexShader: vertSrc,
});
const shaderMesh = new THREE.Mesh(shaderGeo,shaderMat);
effect2048.scene.add(shaderMesh);

const boxTileTile = new Tile();
boxTileTile.value = 32;
const boxTile2 = generateBoxTileBorder(boxTileTile);
effect2048.scene.add(boxTile2);
boxTile2.position.x += 0.5;

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