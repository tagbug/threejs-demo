import * as three from 'three';

export const BasicObjectList: three.Object3D[] = [];

// box: 立方体
export const box: three.Mesh = new three.Mesh(
    new three.BoxBufferGeometry(10, 10, 10),
    new three.MeshStandardMaterial({ color: 'rgb(255,255,0)' })
)
box.position.x = -10;

// sphere: 球体
export const sphere: three.Line = new three.Line(   // 网格物体
    new three.SphereBufferGeometry(5),  // 几何对象
    new three.MeshStandardMaterial()    // 网格标准材质
)
sphere.position.x = 10;

// cylinder: 柱体
export const cylinder: three.Mesh = new three.Mesh(
    new three.CylinderBufferGeometry(5, 5, 10, 32, 5),
    new three.MeshStandardMaterial()
)
cylinder.position.z = 10;

BasicObjectList.push(box, sphere, cylinder);