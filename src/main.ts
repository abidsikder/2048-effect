import * as THREE from 'three'
import { _SRGBAFormat } from 'three'

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
const renderer = new THREE.WebGLRenderer({
	canvas: document.getElementById('app') as HTMLCanvasElement
})
renderer.setSize(width, height)

const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(geometry, material);

scene.add(cube)
camera.position.z = 5;
renderer.render(scene,camera)

function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}
animate();

