import { useEffect } from 'react';
import styled from 'styled-components';
import { BasicObjectList } from './threejs/TBasicObject';
import { TEngine } from './threejs/TEngine';
import { HelperList } from './threejs/THelper';
import { LightsList } from './threejs/TLights';
import { getFrame } from './threejs/TLoadModel';

export default function App() {

    // Effect
    useEffect(() => {
        const renderContainer = document.getElementById('renderContainer');
        if (renderContainer == null) {
            throw '找不到renderContainer';
        }

        const engine = new TEngine(renderContainer);
        engine.addObject(...BasicObjectList, ...LightsList, ...HelperList);

        getFrame().then(frame => {
            engine.addObject(frame);
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