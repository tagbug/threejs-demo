import { AnimationMixer, Clock } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

const clock = new Clock();
let oldElapsedTime = 0;
export const playFoxAnimation = (gltf: GLTF, idx: number) => {
    const mixer = new AnimationMixer(gltf.scene);
    const action = mixer.clipAction(gltf.animations[idx]);
    action.play();
    return () => {
        const elapsedTime = clock.getElapsedTime();
        const deltaTime = elapsedTime - oldElapsedTime;
        oldElapsedTime = elapsedTime;
        mixer.update(deltaTime);
    }
}
