import * as three from 'three';

export const BasicObjectList: three.Object3D[] = [];

// 地面
const stage: three.Mesh = new three.Mesh(
    new three.BoxBufferGeometry(200, 10, 200),
    new three.MeshStandardMaterial({ color: 'rgb(150, 150, 150)' })
)
stage.position.y = -5;

// 立方体
const box: three.Mesh = new three.Mesh(
    new three.BoxBufferGeometry(20, 20, 20),
    new three.MeshStandardMaterial({ color: 'red' })
)
box.position.y = 10;

BasicObjectList.push(stage, box);