import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import * as three from 'three';
import { Mesh, MeshBasicMaterial, MeshMatcapMaterial, MeshStandardMaterial } from 'three';
import { matcapTexture } from './TTextures';

const fontLoader = new FontLoader();

export const getTextExample = async () => {
    const font = await fontLoader.loadAsync('/font/Calibri_Regular.json');
    const textGeometry = new TextGeometry(
        'Text Example',
        {
            font: font,
            size: 40,
            height: 10,
            curveSegments: 20,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 6,
        }
    )
    /* textGeometry.computeBoundingBox();
    // 通过boundingBox让文字居中
    textGeometry.translate(
        - (textGeometry.boundingBox!.max.x - 0.02) * 0.5, // bevelSize=0.02
        - (textGeometry.boundingBox!.max.y - 0.02) * 0.5, // bevelSize=0.02
        - (textGeometry.boundingBox!.max.z - 0.03) * 0.5, // bevelThickness=0.3
    ) */
    // 调用api让文字居中
    textGeometry.center();
    return new Mesh(
        textGeometry,
        new MeshMatcapMaterial({
            matcap: matcapTexture
        })
    )
}