import * as three from 'three';
import { BoxBufferGeometry, Mesh, MeshStandardMaterial } from 'three';
import { pictureTexture } from './TTextures';

export const BasicObjectList: three.Object3D[] = [];

// 地面
const stage: three.Mesh = new three.Mesh(
    new three.BoxBufferGeometry(600, 10, 400),
    new three.MeshStandardMaterial({
        color: 'rgb(0, 75, 75)',
        roughness: 0,
    })
)
stage.position.y = -5;
// 允许接受阴影效果
stage.receiveShadow = true;

// 墙体
export const wall: Mesh = new Mesh(
    new BoxBufferGeometry(600, 200, 10),
    new MeshStandardMaterial({
        color: 'white'
    })
)
wall.position.y = 100;
wall.position.z = -80;
wall.receiveShadow = true;
// 通知wall更新本地矩阵 =>和=> 世界矩阵
wall.updateMatrix();
wall.updateMatrixWorld();

// 立方体
const box: three.Mesh = new three.Mesh(
    new three.BoxBufferGeometry(20, 20, 20),
    new three.MeshStandardMaterial({
        color: 'red',
        metalness: 0.5,
        roughness: 0.5,
        // map: pictureTexture
    })
)
box.position.y = 10;
// 允许产生阴影效果
box.castShadow = true;

// 球体
const sphere: three.Mesh = new three.Mesh(
    new three.SphereBufferGeometry(6),
    new three.MeshStandardMaterial({
        roughness: 0,
        map: pictureTexture
    })
)
sphere.position.y = 6;
sphere.position.z = 20;
sphere.castShadow = true;

// 图片
const picture: three.Mesh = new three.Mesh(
    new three.PlaneBufferGeometry(192, 108),
    new three.MeshStandardMaterial({
        map: pictureTexture
    })
)
picture.position.y = 140;
picture.position.z = -70;
picture.scale.set(0.4, 0.4, 0.4);
picture.castShadow = true;

BasicObjectList.push(stage, picture, wall);