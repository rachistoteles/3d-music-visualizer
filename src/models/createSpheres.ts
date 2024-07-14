import * as THREE from 'three';
import sphereParameters from '../sphereParameters';
import shaders from '../shaders';

export function createSpheres(uniforms: any): THREE.Object3D {
    const sphereGroup = new THREE.Object3D();

    sphereParameters.forEach(item => {
        const sphereGeometry = new THREE.SphereGeometry(15, 32, 32);
        const sphereMaterial = new THREE.ShaderMaterial({
            vertexShader: shaders.vertex,
            fragmentShader: shaders.fragment,
            uniforms: uniforms,
            wireframe: true
        });
        const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

        if (item.rotation.x == undefined) {
            if (item.rotation.y != undefined)
                sphereMesh.rotation.y = item.rotation.y;
        } else {
            sphereMesh.rotation.x = item.rotation.x;
        }

        sphereMesh.scale.set(item.scale, item.scale, item.scale);
        sphereMesh.position.set(item.position.x, item.position.y, item.position.z);

        sphereGroup.add(sphereMesh);
    });

    return sphereGroup;
}
