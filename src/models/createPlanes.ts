import * as THREE from 'three';
import planeMeshParameters from '../planeMeshParameters';
import planeMeshParameters2 from '../planeMeshParameters2';
import shaders from '../shaders';

export function createPlanes(uniforms: any): THREE.Object3D {
    const planeGeometry = new THREE.PlaneGeometry(64, 64, 64, 64);
    const planeMaterial = new THREE.ShaderMaterial({
        vertexShader: shaders.vertex,
        fragmentShader: shaders.fragment,
        uniforms: uniforms,
        wireframe: true
    });

    const planeGroup = new THREE.Object3D();

    [...planeMeshParameters, ...planeMeshParameters2].forEach(item => {
        const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

        if (item.rotation.x == undefined) {
            if (item.rotation.y != undefined)
                planeMesh.rotation.y = item.rotation.y;
        } else {
            planeMesh.rotation.x = item.rotation.x;
        }

        planeMesh.scale.set(item.scale, item.scale, item.scale);
        planeMesh.position.set(item.position.x, item.position.y, item.position.z);

        planeGroup.add(planeMesh);
    });

    return planeGroup;
}
