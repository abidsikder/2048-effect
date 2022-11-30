import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'

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

const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(geometry, material);

scene.add(cube)
camera.position.z = 10;

// @ts-ignore
const controls = new OrbitControls(camera, renderer.domElement)

const loader = new FontLoader();
loader.load('droid_sans_bold.typeface.json', function ( font ) {
	const textGeo = new TextGeometry( 'Hello three.js!', {
		font: font,
		size: 3,
		height: 0.0001
	} );
  const textMat = new THREE.MeshBasicMaterial({color:0xff0000});
  const textMesh = new THREE.Mesh(textGeo, textMat);
  scene.add(textMesh);
} );


function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}
animate();

