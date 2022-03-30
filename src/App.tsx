import { useEffect } from 'react';
import styled from 'styled-components';
import { BasicObjectList } from './threejs/TBaseObject';
import { TEngine } from './threejs/TEngine';

export default function App() {

    // Effect
    useEffect(() => {
        const renderContainer = document.getElementById('renderContainer');
        if (renderContainer == null) {
            throw '找不到renderContainer';
        }

        const engine = new TEngine(renderContainer);
        engine.addObject(...BasicObjectList);

        return (() => {
            // destroy method...
        })
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