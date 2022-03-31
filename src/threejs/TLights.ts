import * as three from 'three';
import { wall } from './TBasicObject';

export const LightsList: three.Object3D[] = [];

// 环境光
export const ambientLight: three.AmbientLight = new three.AmbientLight('rgb(255,255,255)', 0.3);

// 点光源
export const pointLight: three.PointLight = new three.PointLight(
    'rgb(255, 255, 0)',
    0.7,
    30,
    0.1
)
pointLight.position.set(20, 20, 20);

// 聚光灯光源
export const spotLight: three.SpotLight = new three.SpotLight(
    'rgb(255, 255, 255)',
    1,
    500,
    Math.PI / 180 * 30,
    0,
    0
)
spotLight.position.set(0, 100, 400);
spotLight.target = wall;
// 允许产生阴影
spotLight.castShadow = true;

LightsList.push(ambientLight, spotLight);