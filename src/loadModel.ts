import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export function loadModel(
    scene: THREE.Scene, 
    path: string, 
    params: {
        name: string; position: THREE.Vector3, rotation: THREE.Euler, scale: THREE.Vector3, speed: number, size: number
    }, 
    onLoad?: (gltf: THREE.Group, name: string) => void
): void {
    const loader = new GLTFLoader();
    loader.load(
        path,
        (gltf) => {
            gltf.scene.position.copy(params.position);
            gltf.scene.rotation.copy(params.rotation);
            gltf.scene.scale.set(params.size, params.size, params.size); // Set size here

            if (onLoad) {
                onLoad(gltf.scene, params.name);
            }

            scene.add(gltf.scene);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (error) => {
            console.error('An error happened', error);
        }
    );
}
