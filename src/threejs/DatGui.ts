import * as three from 'three';
import { Mesh, MeshStandardMaterial } from "three";
import { TEngine } from "./TEngine";
import { BasicHelperList, CameraHelperList, LightHelperList, rectAreaLightHelperUpdate, spotLightHelperUpdate } from "./THelper";
import { directionLight } from "./TLights";
import { createPhysicBox, createPhysicSphere, destroyPhysicsWorld } from "./TPhysics";

/**
 * 为一个引擎加载DatGui调试控制面板
 * @param engine 引擎实例
 */
export const loadDatGui = (engine: TEngine) => {
    const config = {
        // 基础Helper（坐标轴、(Desperate)网格Helper）
        basicHelper: false,
        // 光源Helper
        lightHelper: false,
        // 摄像机Helpers
        cameraHelper: false,
        // 射线拾取+变换控制器（键盘1->移动 2->scale 3->旋转）
        enableTransformControl: false,
    }
    const gui = engine.getDatGui();
    const scene = engine.getScene();
    const renderer = engine.getRenderer();

    const helper = gui.addFolder('Helper');
    helper.add(config, 'basicHelper').onChange((enable) => {
        if (enable) {
            engine.addObjects(...BasicHelperList);
        } else {
            engine.removeObjects(...BasicHelperList);
        }
    });
    helper.add(config, 'lightHelper').onChange((enable) => {
        if (enable) {
            engine.addObjects(...LightHelperList);
            engine.addFunctionToAni(spotLightHelperUpdate, rectAreaLightHelperUpdate);
        } else {
            engine.removeObjects(...LightHelperList);
            engine.removeFunctionFromAni(spotLightHelperUpdate, rectAreaLightHelperUpdate);
        }
    });
    helper.add(config, 'cameraHelper').onChange(enable => {
        if (enable) {
            engine.addObjects(...CameraHelperList);
        } else {
            engine.removeObjects(...CameraHelperList);
        }
    })
    helper.add(config, 'enableTransformControl').onChange((enableTransformControl) => {
        enableTransformControl ? engine.initTransformControl() : engine.destroyTransformControl();
    });
    const physics = gui.addFolder('physics');
    physics.add({
        createPhysicsSphere: () => {
            createPhysicSphere(
                scene,
                Math.random() * 5 + 5,
                {
                    x: (Math.random() - 0.5) * 100,
                    y: 30,
                    z: (Math.random() - 0.5) * 100,
                }
            )
        }
    }, 'createPhysicsSphere');
    physics.add({
        createPhysicsBox: () => {
            createPhysicBox(
                scene,
                Math.random() * 5 + 15,
                Math.random() * 5 + 15,
                Math.random() * 5 + 15,
                {
                    x: (Math.random() - 0.5) * 100,
                    y: 30,
                    z: (Math.random() - 0.5) * 100,
                }
            )
        }
    }, 'createPhysicsBox');
    physics.add({
        reset: () => {
            destroyPhysicsWorld(scene);
        }
    }, 'reset');
    // Realistic Render
    const folder = gui.addFolder('Realistic Render');
    folder.add(directionLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity');
    folder.add(directionLight.position, 'x').min(-5).max(5).step(0.001).name('lightX');
    folder.add(directionLight.position, 'y').min(-20).max(20).step(0.001).name('lightY');
    folder.add(directionLight.position, 'z').min(-20).max(20).step(0.001).name('lightZ');
    folder.add(renderer, 'physicallyCorrectLights');
    folder.add({ envMapIntensity: 5 }, 'envMapIntensity').min(1).max(10).step(0.001).onChange(val => {
        scene.traverse(item => {
            if (item instanceof Mesh && item.material instanceof MeshStandardMaterial) {
                item.material.envMapIntensity = val;
            }
        })
    })
    folder.add(renderer, 'toneMapping', {
        No: three.NoToneMapping,
        Linear: three.LinearToneMapping,
        Reinhard: three.ReinhardToneMapping,
        Cineon: three.CineonToneMapping,
        ACESFilmic: three.ACESFilmicToneMapping,
    }).onFinishChange(() => {
        // 这是js或者datGui的一个bug，enum值会被自动转换为string，所以要手动再次转换回来
        renderer.toneMapping = Number(renderer.toneMapping);
        // 更新场景中的物体材质以应用toneMapping
        scene.traverse(item => {
            if (item instanceof Mesh && item.material instanceof MeshStandardMaterial) {
                item.material.needsUpdate = true;
            }
        })
    });
    folder.add(renderer, 'toneMappingExposure').min(1).max(5).step(0.001);
    folder.add({ shadow: false }, 'shadow').onChange(enable => {
        scene.traverse(item => {
            if (item instanceof Mesh && item.material instanceof MeshStandardMaterial) {
                item.castShadow = enable;
                item.receiveShadow = enable;
            }
        })
    })
}