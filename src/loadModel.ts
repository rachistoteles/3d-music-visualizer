import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export function loadModel(
    scene: THREE.Scene, 
    path: string, 
    params: { position: THREE.Vector3, rotation: THREE.Euler, scale: THREE.Vector3, speed: number }, 
    onLoad?: (gltf: THREE.Group, speed: number) => void
): void {
    const loader = new GLTFLoader();
    loader.load(
        path,
        (gltf) => {
            gltf.scene.position.copy(params.position);
            gltf.scene.rotation.copy(params.rotation);
            gltf.scene.scale.copy(params.scale);

            if (onLoad) {
                onLoad(gltf.scene, params.speed);
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
