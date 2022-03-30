import { useEffect } from 'react';
import styled from 'styled-components';
import threeInit from './threejs/init';

export default function App() {

    // Effect
    useEffect(() => {
        threeInit(document.getElementById('renderContainer'));
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