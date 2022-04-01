import { Object3D, Sprite, SpriteMaterial } from "three";
import { saluteTexture } from "./TTextures";

export const SpriteList: Object3D[] = [];

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

SpriteList.push(spriteNormal, sprite);