import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
let averageArrayFreq: number[] = [];
function init(
  audio: HTMLAudioElement,
  container: HTMLElement | Window = document.body,
  includeBackgroundColor: boolean = true,
  numModels: number,
  distanceBetween: number,
  rotationSpeedOdd: number,
  rotationSpeedEven: number,
  inOrderObjects: boolean,
  features: string
) {
// Replace 10 with the desired value
  const uniforms = {
    u_time: { type: 'f', value: 2.0 },
    u_amplitude: { type: 'f', value: 4.0 },
    u_data_arr: { type: 'float[64]', value: new Uint8Array() },
    u_color: { type: 'v3', value: new THREE.Color(0xffffff) },
  };

  const audioContext = new window.AudioContext();
  const source = audioContext.createMediaElementSource(audio);
  const analyser = audioContext.createAnalyser();
  source.connect(analyser);
  analyser.connect(audioContext.destination);
  analyser.fftSize = 1024;
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  let mixers: THREE.AnimationMixer[] = [];
  let gltf3: any;
 

  async function _initThree() {
    console.log('Initializing Three.js scene...');
    const isWindow = container instanceof Window;
    const _container: HTMLElement = isWindow ? document.body : container as HTMLElement;
    const width = isWindow ? window.innerWidth : _container.clientWidth;
    const height = isWindow ? window.innerHeight : _container.clientHeight;
    const scene = new THREE.Scene();

    // Set the background color
    scene.background = new THREE.Color(0x222222);

    addLights(scene);
    const camera = setupCamera(width, height);
    const renderer = setupRenderer(width, height, _container);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    // Load the GLTF models with error handling
    try {
      const loader = new GLTFLoader();

      const gltf = await loader.loadAsync(
        "./models/jirachi/pokemon_3ds_jirachi.glb"
      );
      gltf.scene.position.set(0, 0, 0);
      scene.add(gltf.scene);
      const mixer = new THREE.AnimationMixer(gltf.scene);

      if ((gltf as any).animations) {
        (gltf as any).animations.forEach((clip: THREE.AnimationClip) => {
          console.log("Playing animation clip:", clip);
          const action = mixer.clipAction(clip);
          action.play();
        });
      } else {
        console.warn("No animations found in GLTF model:", gltf);
      }

      const gltf2 = await loader.loadAsync(
        "./models/sasuke/rumba_dancing_sasuke.glb"
      );
      gltf2.scene.position.set(distanceBetween, 0, 0);
      scene.add(gltf2.scene);
      const mixer2 = new THREE.AnimationMixer(gltf2.scene);

      if ((gltf2 as any).animations) {
        (gltf2 as any).animations.forEach((clip: THREE.AnimationClip) => {
          console.log("Playing animation clip:", clip);
          const action = mixer2.clipAction(clip);
          action.play();
        });
      } else {
        console.warn("No animations found in GLTF model:", gltf2);
      }

      const gltf3 = await loader.loadAsync(
        "./models/infernape/pokemon_pokedex_3d_pro_infernape.glb"
      );

      gltf3.scene.position.set(-distanceBetween, 0, 0);
      scene.add(gltf3.scene);
      const mixer3 = new THREE.AnimationMixer(gltf3.scene);

      if ((gltf3 as any).animations) {
        (gltf3 as any).animations.forEach((clip: THREE.AnimationClip) => {
          console.log("Playing animation clip:", clip);
          const action = mixer3.clipAction(clip);
          action.play();
        });
      } else {
        console.warn("No animations found in GLTF model:", gltf3);
      }

      // Set up the animation mixers
      mixers = [mixer, mixer2, mixer3];
      // Start the animation loop
      animate(
        scene,
        camera,
        renderer,
        controls,
        analyser,
        dataArray,
        uniforms,
        mixers,
        gltf3
      );

      // Resize handler
      window.addEventListener("resize", () =>
        handleResize(camera, renderer, isWindow, _container)
      );
    } catch (error) {
      console.error('Error loading models:', error);
    }
  }

  _initThree();
}

function addLights(scene: THREE.Scene) {
  console.log('Adding lights to the scene...');
  const ambientLight = new THREE.AmbientLight(0x404040, 3);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(10, 10, 10).normalize();
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0xffffff, 1.5);
  pointLight.position.set(0, 5, 5);
  scene.add(pointLight);

  const spotLight = new THREE.SpotLight(0xffffff, 0.8);
  spotLight.position.set(5, 5, 5);
  spotLight.castShadow = true;
  scene.add(spotLight);
}

function setupCamera(width: number, height: number): THREE.PerspectiveCamera {
  console.log('Setting up the camera...');
  const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
  camera.position.set(0, 2, 5);
  camera.lookAt(new THREE.Vector3(0, 1, 0));
  return camera;
}

function setupRenderer(width: number, height: number, container: HTMLElement): THREE.WebGLRenderer {
  console.log('Setting up the renderer...');
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 1);
  container.appendChild(renderer.domElement);
  return renderer;
}

function animate(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  controls: OrbitControls,
  analyser: AnalyserNode,
  dataArray: Uint8Array,
  uniforms: any,
  mixers: THREE.AnimationMixer[],
  gltf3: any
) {
  const clock = new THREE.Clock();
  function animateLoop() {
    requestAnimationFrame(animateLoop);

    // Update the mixers on each frame
    const delta = clock.getDelta();
    mixers.forEach((mixer: { update: (arg0: number) => any; }) => mixer.update(delta));

    // Update the frequency data and uniforms
    updateFrequencyData(analyser, dataArray, uniforms, scene, mixers, gltf3);

    renderer.render(scene, camera);
    controls.update();
  }
  animateLoop();
}

function updateFrequencyData(analyser: AnalyserNode, dataArray: Uint8Array, uniforms: any, scene: THREE.Scene, mixers: THREE.AnimationMixer[], gltf3: any ) {
  analyser.getByteFrequencyData(dataArray);
  uniforms.u_data_arr.value = dataArray;

  const averageFreq = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
  //if not 0 then push
  if (averageFreq !== 0){
    averageArrayFreq.push(averageFreq);
  }
  console.log('Average Array Frequency:', averageArrayFreq);
  const hue = Math.random() * 360;
  const saturation = 90;
  const lightness = Math.min(50, (averageFreq / 255) * 250);
  const color = new THREE.Color(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  uniforms.u_color.value = color;
  updateSceneBasedOnFrequency(averageFreq, scene, mixers, gltf3);
}
function updateSceneBasedOnFrequency(averageFreq: number, scene: THREE.Scene, mixers: THREE.AnimationMixer[], gltf3: any) {
  
  if (averageFreq < 50) {
      scene.background = new THREE.Color('red');
      mixers.forEach(mixer => mixer.timeScale = 1);
      //ROTATE position x
      gltf3.scene.rotation.y += 0.03
      //mixers[gltf3].timeScale = 1.5;
      gltf3.size = 1.5;
    } else if (averageFreq >= 50 && averageFreq <= 70) {
      scene.background = new THREE.Color('blue');
      mixers.forEach(mixer => mixer.timeScale = 1.2);
     
      gltf3.scene.rotation.y += 0.06; 
      //mixers[gltf3].timeScale = 1.8;
      gltf3.size = 2.5;
    } else if (averageFreq >= 70 && averageFreq <= 100) {
      scene.background = new THREE.Color('green');
      mixers.forEach(mixer => mixer.timeScale = 1.5);
      //mixers[gltf3].timeScale = 2.2;
      gltf3.scene.rotation.y += 0.09;
    } else if (averageFreq >= 100 && averageFreq <= 115) {
      scene.background = new THREE.Color('purple');
      //mixers.forEach(mixer => mixer.timeScale = 1);
      gltf3.scene.rotation.y -= 0.04;
     // mixers[gltf3].timeScale = 1;
      gltf3.size = 3.5;
    } else if (averageFreq >= 115 && averageFreq <= 120) {
      scene.background = new THREE.Color('yellow');
      //mixers.forEach(mixer => mixer.timeScale = 1.8);
      //mixers[gltf3].timeScale = 0.8;
      gltf3.scene.rotation.y -= 0.06;
    } else if (averageFreq >= 120 && averageFreq <= 125) {
      scene.background = new THREE.Color('orange');
      //mixers.forEach(mixer => mixer.timeScale = 1.1);
      gltf3.size = 5.5;
      //mixers[gltf3].timeScale = 0.5;
      gltf3.scene.rotation.y -= 0.09;
    } else if (averageFreq >= 125 && averageFreq <= 140) {
      scene.background = new THREE.Color('pink');
      mixers.forEach(mixer => mixer.timeScale = 2.8);
    } else if (averageFreq > 140 && averageFreq <= 150) {
      scene.background = new THREE.Color('cyan');
      mixers.forEach(mixer => mixer.timeScale = 3);
    } else {
      scene.background = new THREE.Color('black');
      mixers.forEach(mixer => mixer.timeScale = 3);
    }
  };



function handleResize(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, isWindow: boolean, container: HTMLElement) {
  const width = isWindow ? window.innerWidth : container.clientWidth;
  const height = isWindow ? window.innerHeight : container.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

export { init };
