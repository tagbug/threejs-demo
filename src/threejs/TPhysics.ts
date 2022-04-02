import * as cannon from 'cannon';
import { Clock, Mesh, MeshStandardMaterial, Scene, SphereBufferGeometry, Vector3 } from 'three';
import { sphere, stage } from './TBasicObject';

// World
const world = new cannon.World();
// 设置重力
world.gravity.set(0, -98.2, 0);

// 材质
const defaultMaterial = new cannon.Material('default');
const defaultContactMaterial = new cannon.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 1,
        restitution: 0.7
    }
)
world.addContactMaterial(defaultContactMaterial);
world.defaultContactMaterial = defaultContactMaterial;

// 添加物理世界中的物体
// 地面
const floorShape = new cannon.Plane();
const floorBody = new cannon.Body({
    // 设置质量为0，意思就是物体是静止的
    mass: 0,
    position: stage.position as unknown as cannon.Vec3,
    shape: floorShape,
});
floorBody.quaternion.setFromAxisAngle(new cannon.Vec3(-1, 0, 0), Math.PI * 0.5);
world.addBody(floorBody);

// 绑定需要更新的threeJS和CANNON物体
const objectToUpdate: { mesh: Mesh, body: cannon.Body }[] = [];
// 向threeJS世界和物理世界同时创建一个球
export const createPhysicSphere = (scene: Scene, radius: number, position: { x: number, y: number, z: number }) => {
    const sphere = new Mesh(
        new SphereBufferGeometry(radius, 32, 32),
        new MeshStandardMaterial({
            roughness: 0,
        })
    )
    sphere.castShadow = true;
    sphere.position.copy(position as Vector3);
    scene.add(sphere);
    const physicsSphere = new cannon.Body({
        mass: 1,
        position: position as cannon.Vec3,
        shape: new cannon.Sphere(radius)
    })
    world.addBody(physicsSphere);
    objectToUpdate.push({ mesh: sphere, body: physicsSphere });
}


// 物理世界更新函数
let oldElapsedTime = 0;
const clock = new Clock();
export const physicsUpdate = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime;
    // update physics
    world.step(1 / 60, deltaTime, 3);
    // apply to threeJS world
    for (let item of objectToUpdate) {
        item.mesh.position.copy(item.body.position as unknown as Vector3);
    }
}