import * as three from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { frameColorTexture, frameDisplaceTexture, frameRoughnessTexture } from './TTextures';
import { Material, Mesh, MeshStandardMaterial } from 'three';

const objLoader: OBJLoader = new OBJLoader();
const dracoLoader: DRACOLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
const gltfLoader: GLTFLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

export const getFrame = async () => {
    const group = await objLoader.loadAsync('/ambient/frame.obj');
    const frame = group.children[0] as Mesh;
    // 性能优化
    (frame.material as Material).dispose();
    frame.material = new three.MeshStandardMaterial({
        map: frameColorTexture,
        roughnessMap: frameRoughnessTexture,
        bumpMap: frameDisplaceTexture,
    });
    frame.position.y = 140;
    frame.position.z = -60;
    frame.position.x = 0;
    frame.rotation.y = Math.PI / 180 * -90;
    frame.scale.set(2.4, 2.4, 2.6);
    return frame;
}

export const getDuckModel = async () => {
    const loaded = await gltfLoader.loadAsync('/model/Duck/glTF-Draco/Duck.gltf');
    return loaded;
}

export const getFlightHelmetModel = async () => {
    const loaded = await gltfLoader.loadAsync('/model/FlightHelmet/glTF/FlightHelmet.gltf');
    return loaded;
}

export const getFoxModel = async () => {
    const loaded = await gltfLoader.loadAsync('/model/Fox/glTF/Fox.gltf');
    return loaded;
}

export const getHamburgerModel = async () => {
    const loaded = await gltfLoader.loadAsync('/model/Hamburger/Hamburger.glb');
    return loaded;
}