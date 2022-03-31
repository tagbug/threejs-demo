import * as three from 'three';
import { pointLight, spotLight } from './TLights';

export const HelperList: three.Object3D[] = [];

// 坐标轴
const axesHelper: three.AxesHelper = new three.AxesHelper(500);
// 地面网格
const gridHelper: three.GridHelper = new three.GridHelper(500, 20, 'rgb(200,200,200)', 'rgb(100,100,100)');

// 点光源辅助器，可以显示点光源的位置、作用范围、颜色
const pointLightHelper: three.PointLightHelper = new three.PointLightHelper(pointLight, pointLight.distance, pointLight.color);
// 聚光灯辅助器
const spotLightHelper: three.SpotLightHelper = new three.SpotLightHelper(spotLight, spotLight.color);

HelperList.push(axesHelper, spotLightHelper);