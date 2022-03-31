import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BasicObjectList } from './threejs/TBasicObject';
import { TEngine } from './threejs/TEngine';
import { HelperList } from './threejs/THelper';
import { LightsList } from './threejs/TLights';
import { getFrame } from './threejs/TLoadModel';

export default function App() {

    const initEngine = () => {
        const renderContainer = document.getElementById('renderContainer');
        if (renderContainer == null) {
            throw '找不到renderContainer';
        }

        const engine = new TEngine(renderContainer);
        engine.addObjects(...BasicObjectList, ...LightsList);
        engine.loadDatGui();

        getFrame().then(frame => {
            engine.addObjects(frame);
        })
        return engine;
    }

    // Effect
    useEffect(() => {
        let engine = initEngine();
        global.window.addEventListener('resize', () => {
            engine.destroy();
            engine = initEngine();
        })
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