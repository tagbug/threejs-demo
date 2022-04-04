import * as three from 'three';
import { CameraHelper, DirectionalLightHelper, HemisphereLightHelper, Object3D } from 'three';
import { directionLight, hemisphereLight, pointLight, rectAreaLight, spotLight } from './TLights';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';

export const BasicHelperList: three.Object3D[] = [];
export const LightHelperList: Object3D[] = [];
export const CameraHelperList: Object3D[] = [];

// 坐标轴
const axesHelper: three.AxesHelper = new three.AxesHelper(500);
// 地面网格
const gridHelper: three.GridHelper = new three.GridHelper(500, 20, 'rgb(200,200,200)', 'rgb(100,100,100)');

// 点光源辅助器，可以显示点光源的位置、作用范围、颜色
const pointLightHelper: three.PointLightHelper = new three.PointLightHelper(pointLight, pointLight.distance, pointLight.color);
// 聚光灯辅助器
const spotLightHelper: three.SpotLightHelper = new three.SpotLightHelper(spotLight, spotLight.color);
// 聚光灯辅助器需要手动让其更新位置
export const spotLightHelperUpdate = () => {
    spotLightHelper.update();
}

// 半球灯辅助器
const hemisphereLightHelper = new HemisphereLightHelper(hemisphereLight, 10);
// 平行光辅助器
const directionalLightHelper = new DirectionalLightHelper(directionLight, 10);
// 平面光辅助器
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
// 平面光辅助器需要手动让其更新位置
export const rectAreaLightHelperUpdate = () => {
    rectAreaLightHelper.position.copy(rectAreaLight.position);
    rectAreaLightHelper.quaternion.copy(rectAreaLight.quaternion);
}

// 摄影机Helper
const spotLightCameraHelper = new CameraHelper(spotLight.shadow.camera);

BasicHelperList.push(axesHelper);
LightHelperList.push(hemisphereLightHelper, directionalLightHelper, pointLightHelper, rectAreaLightHelper, spotLightHelper);
CameraHelperList.push(spotLightCameraHelper);

// 让射线拾取器不会拾取这些Helper
BasicHelperList.forEach(item => {
    item.raycast = () => { };
    item.children.forEach(child => child.raycast = () => { });
})
LightHelperList.forEach(item => {
    item.raycast = () => { };
    item.children.forEach(child => child.raycast = () => { });
})
CameraHelperList.forEach(item => {
    item.raycast = () => { };
    item.children.forEach(child => child.raycast = () => { });
})