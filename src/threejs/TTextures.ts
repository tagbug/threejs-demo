import * as three from 'three';

// 贴图加载器
const textureLoader: three.TextureLoader = new three.TextureLoader();

export const pictureTexture: three.Texture = textureLoader.load('/img/plane.jpg');
export const saluteTexture: three.Texture = textureLoader.load('/img/salute.jpg');

export const frameColorTexture = textureLoader.load('/ambient/WoodFloor024_1K_Color.jpg');
export const frameRoughnessTexture = textureLoader.load('/ambient/WoodFloor024_1K_Roughness.jpg');
export const frameDisplaceTexture = textureLoader.load('/ambient/WoodFloor024_1K_Displacement.jpg');

export const matcapTexture = textureLoader.load('/matcaps/256/C7C7D7_4C4E5A_818393_6C6C74-256px.png');

export const particleTexture = textureLoader.load('/particle/Black/star_04.png');