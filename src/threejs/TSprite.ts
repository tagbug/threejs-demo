import { count } from "console";
import { AdditiveBlending, BufferAttribute, BufferGeometry, Clock, Object3D, Points, PointsMaterial, SphereBufferGeometry, Sprite, SpriteMaterial } from "three";
import { particleTexture, saluteTexture } from "./TTextures";

export const SpriteList: Object3D[] = [];
export const ParticleList: Object3D[] = [];

// 普通精灵
const spriteMaterialNormal = new SpriteMaterial({ color: 0x00ffff });
const spriteNormal = new Sprite(spriteMaterialNormal);
spriteNormal.position.set(-70, 20, 0);
spriteNormal.scale.set(50, 50, 1);

// 图片精灵
const sprite = new Sprite(
    new SpriteMaterial({
        map: saluteTexture
    })
)
sprite.position.set(70, 20, 0);
sprite.scale.set(50, 50, 1);

// 粒子
const particlesGeometry = new BufferGeometry();
const vertexCount = 10000;
const positions = new Float32Array(vertexCount * 3);
const colors = new Float32Array(vertexCount * 3);
for (let i = 0; i < vertexCount * 3; i++) {
    positions[i] = (0.5 - Math.random()) * 500;
    colors[i] = Math.random();
}
particlesGeometry.setAttribute('position', new BufferAttribute(positions, 3));
particlesGeometry.setAttribute('color', new BufferAttribute(colors, 3));
const particlesMaterial = new PointsMaterial({
    size: 10,
    // 粒子衰减开关
    sizeAttenuation: true,
    // color: 0xff88cc,
    alphaMap: particleTexture,
    // 通道透明阈值可以解决粒子覆盖问题，但又没完全解决，对大多数场景可用
    // alphaTest: 0.01,
    // 取消深度测试虽然能解决隐藏问题，但会导致粒子穿透场景中其他物体显示
    // depthTest: false,
    // 禁用depthWrite可能是最佳方案，仅在少数特定情况有bug
    depthWrite: false,
    transparent: true,
    // 这个选项会让颜色混合方式变为叠加，在列子数量多的时候可能导致性能问题，但有不错的表现效果
    blending: AdditiveBlending,
    // 让粒子使用顶点定义的颜色值
    vertexColors: true,
})
const particles = new Points(particlesGeometry, particlesMaterial);
// 粒子动画（性能较低，建议使用自定义Shader）
const clock = new Clock();
export const particlesAnimation = () => {
    const t = clock.getElapsedTime();
    // particles.rotation.set(0, t, 0);
    for (let i = 0; i < vertexCount; i++) {
        particlesGeometry.attributes.position.setY(i, Math.sin((t + particlesGeometry.attributes.position.getX(i) + particlesGeometry.attributes.position.getZ(i)) / 10) * 500);
    }
    particlesGeometry.attributes.position.needsUpdate = true;
}

SpriteList.push();
ParticleList.push();