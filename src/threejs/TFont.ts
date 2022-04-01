import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import * as three from 'three';
import { Mesh, MeshStandardMaterial } from 'three';

const fontLoader = new FontLoader();

export const getTextExample = async () => {
    const font = await fontLoader.loadAsync('/font/Calibri_Regular.json');
    const textGeometry = new TextGeometry(
        'Text Example',
        {
            font: font,
            size: 20,
            height: 30,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5,
        }
    )
    return new Mesh(
        textGeometry,
        new MeshStandardMaterial()
    )
}