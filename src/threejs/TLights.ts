import * as three from 'three';

export const LightsList: three.Object3D[] = [];

// 环境光
export const ambientLight: three.AmbientLight = new three.AmbientLight('rgb(255,255,255)', 1.5);

LightsList.push(ambientLight);