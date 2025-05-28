import React from 'react';
import styled from 'styled-components';

const Pattern = () => (
    <StyledWrapper>
        <video
            className="background"
            src='../../../public/background/homePageBackground.mp4'
            autoPlay
            muted
            loop
            playsInline
        />
    </StyledWrapper>
);

const StyledWrapper = styled.div`
    .background {
        position: fixed;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.4;
        z-index: -10;
        background: #FFFFFF;
    }
`;

export default Pattern;
