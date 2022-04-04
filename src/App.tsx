import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Clock } from 'three';
import { playFoxAnimation } from './threejs/TAnimation';
import { BasicObjectList, sphere } from './threejs/TBasicObject';
import { TEngine } from './threejs/TEngine';
import { getTextExample } from './threejs/TFont';
import { BasicHelperList } from './threejs/THelper';
import { LightsList } from './threejs/TLights';
import { getDuckModel, getFlightHelmetModel, getFoxModel, getFrame, getHamburgerModel } from './threejs/TLoadModel';
import { physicsUpdate } from './threejs/TPhysics';
import { ParticleList, particlesAnimation, SpriteList } from './threejs/TSprite';
import { environmentMap } from './threejs/TTextures';

export default function App() {

    const initEngine = () => {
        const renderContainer = document.getElementById('renderContainer');
        if (renderContainer == null) {
            throw '找不到renderContainer';
        }

        const engine = new TEngine(renderContainer);
        engine.addObjects(...BasicObjectList, ...LightsList, ...SpriteList, ...ParticleList);
        engine.loadDatGui();
        // const clock = new Clock();
        engine.addFunctionToAni(() => {
            // const t = clock.getElapsedTime();
            // sphere.position.set(Math.cos(t) * 30, Math.abs(Math.sin(t * 3) * 30), Math.sin(t) * 30);
        }, physicsUpdate);
        getFlightHelmetModel().then(model => {
            model.scene.scale.set(30, 30, 30);
            model.scene.position.set(0, -8, 0);
            engine.getDatGui()
                ?.add(model.scene.rotation, 'y')
                .min(-Math.PI)
                .max(Math.PI)
                .step(0.001)
                .name('modelRotation');
            engine.addObjects(model.scene);
            engine.updateEnvironmentMap(environmentMap);
        })
        return engine;
    }

    // Effect
    useEffect(() => {
        let engine = initEngine();
        return () => { engine.destroy() };
    }, []);



    return <Container>
        <div id='renderContainer' />
    </Container>
}

const Container = styled.div`
    width: 100%;
    height: 100%;

    #renderContainer {
        width: 100%;
        height: 100%;
    }
`