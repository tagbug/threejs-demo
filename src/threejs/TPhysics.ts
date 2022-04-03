import * as cannon from 'cannon';
import { BoxBufferGeometry, Clock, Mesh, MeshStandardMaterial, Quaternion, Scene, SphereBufferGeometry, Vector3 } from 'three';
import { throttle } from '../utils/HOF';
import { sphere, stage } from './TBasicObject';
import { playHitSound, woodHitSound2, woodHitSound } from './TSound';

// World
const world = new cannon.World();
// 设置重力
world.gravity.set(0, -98.2, 0);
// 更换碰撞检测算法，提高性能，少数情况（物体移动过快）会导致碰撞检测失效（原生的是NaiveBroadphase）
world.broadphase = new cannon.SAPBroadphase(world);
// 允许物体能够自动睡眠（暂时不进行碰撞检测），极大提升性能
world.allowSleep = true;

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

type Position = { x: number, y: number, z: number };
// 向threeJS世界和物理世界同时创建一个球
const sphereGeometry = new SphereBufferGeometry(1, 32, 32);
const sphereMaterial = new MeshStandardMaterial({
    roughness: 0,
})
export const createPhysicSphere = (scene: Scene, radius: number, position: Position) => {
    const sphere = new Mesh(sphereGeometry, sphereMaterial);
    sphere.scale.set(radius, radius, radius);
    sphere.castShadow = true;
    sphere.position.copy(position as Vector3);
    scene.add(sphere);
    const physicsSphere = new cannon.Body({
        mass: 1,
        position: position as cannon.Vec3,
        shape: new cannon.Sphere(radius)
    })
    physicsSphere.addEventListener('collide', throttle(playHitSound.bind(this, woodHitSound2), 100));
    world.addBody(physicsSphere);
    objectToUpdate.push({ mesh: sphere, body: physicsSphere });
}

// 创建物理盒子
const boxGeometry = new BoxBufferGeometry(1, 1, 1);
const boxMaterial = new MeshStandardMaterial({
    roughness: 0,
})
export const createPhysicBox = (scene: Scene, width: number, height: number, depth: number, position: Position) => {
    const box = new Mesh(boxGeometry, boxMaterial);
    box.scale.set(width, height, depth);
    box.castShadow = true;
    box.position.copy(position as Vector3);
    scene.add(box);
    const physicsBox = new cannon.Body({
        mass: 1,
        position: position as cannon.Vec3,
        shape: new cannon.Box(new cannon.Vec3(width / 2, height / 2, depth / 2)),
    })
    physicsBox.addEventListener('collide', throttle(playHitSound.bind(this, woodHitSound), 100));
    world.addBody(physicsBox);
    objectToUpdate.push({ mesh: box, body: physicsBox });
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
        item.mesh.quaternion.copy(item.body.quaternion as unknown as Quaternion);
    }
}

export const destroyPhysicsWorld = (scene: Scene) => {
    objectToUpdate.forEach(item => {
        world.remove(item.body);
        scene.remove(item.mesh);
    })
}