import * as three from 'three';
import { DirectionalLight, HemisphereLight, RectAreaLight } from 'three';
import { wall } from './TBasicObject';

export const LightsList: three.Object3D[] = [];

// 环境光
export const ambientLight: three.AmbientLight = new three.AmbientLight('rgb(255,255,255)', 0.1);

// 点光源
export const pointLight: three.PointLight = new three.PointLight(
    0xff9000,
    0.8,
    800,
)
pointLight.position.set(0, 100, -100);

// 聚光灯光源
export const spotLight: three.SpotLight = new three.SpotLight(
    'rgb(255, 255, 255)',
    1,
    500,
    Math.PI / 180 * 30,
    0.5,
    0.3
)
spotLight.position.set(0, 100, 400);
spotLight.target = wall;
// 允许产生阴影
spotLight.castShadow = true;
// 优化阴影效果
spotLight.shadow.mapSize.set(4096, 4096);
// 通过优化摄影机视角范围来得到更精细的阴影效果
spotLight.shadow.camera.near = 150;
spotLight.shadow.camera.far = 500;
// 设置阴影过渡半径
// spotLight.shadow.radius = 10;

// 平行光
export const directionLight = new DirectionalLight(0xffffff, 3);
directionLight.position.set(2.5, 12, -14.5);
directionLight.castShadow = true;
// 设置法线偏移，使得物体自身的影子不会忽明忽暗
directionLight.shadow.normalBias = 0.05;
directionLight.shadow.mapSize.set(2048, 2048);
directionLight.shadow.camera.scale.set(2, 2, 2);
directionLight.shadow.camera.far = 30;

// 半球光
export const hemisphereLight = new HemisphereLight(0xff0000, 0x0000ff, 0.1);

// 平面光
export const rectAreaLight = new RectAreaLight(0x4e00ff, 2, 100, 100);
rectAreaLight.position.set(0, 40, 50);

LightsList.push(directionLight);