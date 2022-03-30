import * as THREE from "three";

export default function threeInit(elem: HTMLElement | null) {
    if (elem == null) {
        throw 'threeInit: elem不能为空';
    }
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(elem.clientWidth, elem.clientHeight);
    elem.appendChild(renderer.domElement);
}