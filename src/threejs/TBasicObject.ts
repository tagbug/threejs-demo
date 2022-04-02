import * as three from 'three';
import { BoxBufferGeometry, CircleBufferGeometry, Color, ConeBufferGeometry, CylinderBufferGeometry, Line, Mesh, MeshMatcapMaterial, MeshStandardMaterial, TorusBufferGeometry } from 'three';
import { matcapTexture, pictureTexture } from './TTextures';

export const BasicObjectList: three.Object3D[] = [];

// 地面
const stage: three.Mesh = new three.Mesh(
    new three.BoxBufferGeometry(600, 10, 400),
    new three.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0,
    })
)
stage.position.y = -20;
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

// 圆形
const circle: Mesh = new Mesh(
    new CircleBufferGeometry(20, 50),
    new MeshStandardMaterial({
        color: 'blue',
        roughness: 0.5
    })
)
circle.position.y = 20;

// 圆锥
const cone: Line = new Line(
    new ConeBufferGeometry(30, 80, 50, 50),
    new MeshStandardMaterial({
        color: 'white',
        roughness: 0
    })
)
cone.position.y = 40;

// 圆柱
const cylinder: Mesh = new Mesh(
    new CylinderBufferGeometry(),
    new MeshStandardMaterial({
        color: 'cyan'
    })
)

// 球体
export const sphere: three.Mesh = new three.Mesh(
    new three.SphereBufferGeometry(20),
    new three.MeshStandardMaterial({
        roughness: 0,
        map: pictureTexture
    })
)
sphere.position.y = 5;
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

// 圆环
const donutGeometry = new TorusBufferGeometry(10, 6, 20, 45);
const donutMaterial = new MeshStandardMaterial({ roughness: 0 });
/* for (let i = 0; i < 1000; i++) {
    // 创建100个甜甜圈随机分布在scene中
    const donut = new Mesh(
        donutGeometry,
        donutMaterial
    )
    donut.position.set((0.5 - Math.random()) * 600, (0.5 - Math.random()) * 600, (0.5 - Math.random()) * 500);
    donut.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    const scale = Math.random();
    donut.scale.set(scale, scale, scale);
    donut.castShadow = true;
    BasicObjectList.push(donut);
} */

BasicObjectList.push(stage, wall, sphere);