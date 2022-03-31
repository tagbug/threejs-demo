import * as three from 'three';

// 贴图加载器
const textureLoader: three.TextureLoader = new three.TextureLoader();

export const pictureTexture: three.Texture = textureLoader.load('/img/plane.jpg');

export const frameColorTexture = textureLoader.load('/ambient/WoodFloor024_1K_Color.jpg')
export const frameRoughnessTexture = textureLoader.load('/ambient/WoodFloor024_1K_Roughness.jpg')
export const frameDisplaceTexture = textureLoader.load('/ambient/WoodFloor024_1K_Displacement.jpg')