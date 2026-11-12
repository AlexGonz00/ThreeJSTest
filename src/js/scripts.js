import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

/*
import nebula from 'url:../img/nebula.jpg';
import stars from 'url:../img/stars.jpg';
import space from 'url:../img/outer_space.jpg';
*/

const nebula = new URL ('../assets/img/nebula.jpg');
const stars = new URL ('../assets/img/stars.jpg');
const space = new URL ('../assets/img/outer_space.jpg');
const monkeyUrl = new URL('../assets/monkey.glb', import.meta.url);

const renderer = new THREE.WebGLRenderer();

// shadows
renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// move camera back
camera.position.set(-10, 30, 30);
orbit.update();

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshStandardMaterial({color: 0x00FF00});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(0, 0.5, 0);
scene.add(box);

const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xFFFFFF,
  side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;  // Rotate plane along grid
plane.receiveShadow = true; // have shadows added to material

const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0x0000FF,
  wireframe: false
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.set(-10, 10, 0);
sphere.castShadow = true;

// ambient light
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// // Directional light
// const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 4);
// scene.add(directionalLight);
// directionalLight.position.set(-30, 50, 0);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.bottom = -12;  // add extra space to bottom of camera (accounts for shadow clipping w/ sphere)

// // Light helper
// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(dLightHelper);

// const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(dLightShadowHelper);

const spotLight = new THREE.SpotLight(0xFFFFFF, 100000);
scene.add(spotLight);
spotLight.position.set(-100, 100, 0);
spotLight.castShadow = true;
spotLight.angle = 0.2;  // fixes pixelated angels (somehow?)

const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);

//scene.fog = new THREE.Fog(0xFFFFFF, 0, 200);
scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01);

// flat colored background
//renderer.setClearColor(0xD0BA2F);

// Textured background
//const textureLoader = new THREE.TextureLoader();
//scene.background = textureLoader.load(space);
//const cubeTextureLoader = new THREE.CubeTextureLoader();
//scene.background = cubeTextureLoader.load([
//   nebula,
//   nebula,
//   stars,
//   stars,
//   stars,
//   stars
// ]);

// Sphere skybox
const textureLoader = new THREE.TextureLoader();
const tex = textureLoader.load(space);
tex.mapping = THREE.EquirectangularReflectionMapping; // Texture mapping constant that interprets a 2D image as a 360 degree view panoramic
tex.colorSpace = THREE.SRGBColorSpace;
scene.background = tex;

const box2Geometry = new THREE.BoxGeometry(4, 4, 4);
const box2Material = new THREE.MeshBasicMaterial({
  //color: 0x0E72B5,
  //map: textureLoader.load(nebula)
});
const box2MultiMaterial = [
  new THREE.MeshBasicMaterial({map: textureLoader.load(stars)}),
  new THREE.MeshBasicMaterial({map: textureLoader.load(stars)}),
  new THREE.MeshBasicMaterial({map: textureLoader.load(nebula)}),
  new THREE.MeshBasicMaterial({map: textureLoader.load(stars)}),
  new THREE.MeshBasicMaterial({map: textureLoader.load(nebula)}),
  new THREE.MeshBasicMaterial({map: textureLoader.load(stars)})
];
const box2 = new THREE.Mesh(box2Geometry, box2MultiMaterial);
scene.add(box2);
box2.position.set(0, 5, 10);
//box2.material.map = textureLoader.load(nebula);

const plane2Geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
const plane2Material = new THREE.MeshBasicMaterial({
  color: 0xFFFFFF,
  wireframe: true
});
const plane2 = new THREE.Mesh(plane2Geometry, plane2Material);
scene.add(plane2);
plane2.position.set(10, 10, 15);

// change the position of the first vertex
plane2.geometry.attributes.position.array[0] -= 10 * Math.random();
plane2.geometry.attributes.position.array[1] -= 10 * Math.random();
plane2.geometry.attributes.position.array[2] -= 10 * Math.random();
const lastPointZ = plane2.geometry.attributes.position.array.length - 1;
plane2.geometry.attributes.position.array[lastPointZ] -= 10 * Math.random();

const sphere2Geometry = new THREE.SphereGeometry(4);

// const vShader = `
//     void main() {
//         gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//     }
// `;

// const fShader = `
//     void main() {
//         gl_FragColor = vec4(0.5, 0.5, 1.0, 1.0);
//     }
// `;

const sphere2Material = new THREE.ShaderMaterial({
  vertexShader: `
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    void main() {
      gl_FragColor = vec4(0.5, 0.5, 1.0, 1.0);
    }
  `
});
const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
scene.add(sphere2);
sphere2.position.set(-5, 10, 10);

const assetLoader = new GLTFLoader();

assetLoader.load(monkeyUrl.href, function(gltf) {
  const model = gltf.scene;
  scene.add(model);
  model.position.set(-12, 4, 10);
}, undefined, function(error) {
  console.log(error);
});

const gui = new dat.GUI();

// toggleable features
const options = {
  sphereColor: '#ffea00',
  wireframe: false,
  speed: 0.01,
  angle: 0.2,
  penumbra: 0,
  intensity: 100000
};

gui.addColor(options, 'sphereColor').onChange(function(e){
  sphere.material.color.set(e);
});

gui.add(options, 'wireframe').onChange(function(e){
  sphere.material.wireframe = e;
});

gui.add(options, 'speed', 0, 0.1);

gui.add(options, 'angle', 0, 1);
gui.add(options, 'penumbra', 0, 1);
gui.add(options, 'intensity', 0, 200000);

let step = 0;

const mousePosition = new THREE.Vector2();

window.addEventListener('mousemove', function(e) {
  mousePosition.x = (e.clientX / this.window.innerWidth) * 2 - 1;
  mousePosition.y = - (e.clientY / this.window.innerHeight) * 2 + 1;
});

const rayCaster = new THREE.Raycaster();

const sphereId = sphere.id;
box2.name = 'theBox';

function animate(time) {
  box.rotation.y = time / 1000;
  renderer.render(scene, camera);

  step += options.speed;
  sphere.position.y = 10 * Math.abs(Math.sin(step));

  // Add features from options to spotlight
  spotLight.angle = options.angle;
  spotLight.penumbra = options.penumbra;
  spotLight.intensity = options.intensity;
  sLightHelper.update();

  rayCaster.setFromCamera(mousePosition, camera);
  const intersects = rayCaster.intersectObjects(scene.children);
  
  sphere.material.color.set(options.sphereColor);  // set default color of sphere

  // sort through interected objects
  for (let i = 0; i < intersects.length; i++)
  {
    if (intersects[i].object.id === sphereId)
    {
      intersects[i].object.material.color.set(0xFF0000);
    }

    // rotate cube over time
    if (intersects[i].object.name === 'theBox')
    {
      intersects[i].object.rotation.x += 0.01;
      intersects[i].object.rotation.y += 0.01;
    }

  }

  // plane2.geometry.attributes.position.array[0] -= 10 * Math.random();
  // plane2.geometry.attributes.position.array[1] -= 10 * Math.random();
  // plane2.geometry.attributes.position.array[2] -= 10 * Math.random();
  // plane2.geometry.attributes.position.array[lastPointZ] -= 10 * Math.random();
  // plane2.geometry.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
  camera.aspect = window.innerWidth / window.innerh;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, winddow.innerHeight);
});