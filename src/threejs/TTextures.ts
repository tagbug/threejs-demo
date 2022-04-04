import * as three from 'three';
import { CubeTextureLoader } from 'three';

// 贴图加载器
const textureLoader: three.TextureLoader = new three.TextureLoader();
// cube贴图加载器
const cubeTextureLoader = new CubeTextureLoader();

export const pictureTexture: three.Texture = textureLoader.load('/img/plane.jpg');
export const saluteTexture: three.Texture = textureLoader.load('/img/salute.jpg');

export const frameColorTexture = textureLoader.load('/ambient/WoodFloor024_1K_Color.jpg');
export const frameRoughnessTexture = textureLoader.load('/ambient/WoodFloor024_1K_Roughness.jpg');
export const frameDisplaceTexture = textureLoader.load('/ambient/WoodFloor024_1K_Displacement.jpg');

export const matcapTexture = textureLoader.load('/matcaps/256/C7C7D7_4C4E5A_818393_6C6C74-256px.png');

export const particleTexture = textureLoader.load('/particle/Black/star_04.png');

// Environment map
export const environmentMap = cubeTextureLoader.load([
    '/texture/environmentMaps/0/px.jpg',
    '/texture/environmentMaps/0/nx.jpg',
    '/texture/environmentMaps/0/py.jpg',
    '/texture/environmentMaps/0/ny.jpg',
    '/texture/environmentMaps/0/pz.jpg',
    '/texture/environmentMaps/0/nz.jpg'
])
// 更换渲染输出解码器，获得更真实的色彩，原因同renderer
environmentMap.encoding = three.sRGBEncoding;