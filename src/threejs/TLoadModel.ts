import * as three from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { frameColorTexture, frameDisplaceTexture, frameRoughnessTexture } from './TTextures';
import { Material, Mesh, MeshStandardMaterial } from 'three';

const objLoader: OBJLoader = new OBJLoader();

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