import React from 'react';
import styled from 'styled-components';
import backgroundMp4 from '/background/homePageBackground.mp4';

//TODO: Change from styled-components to sx

const Pattern = () => (
    <StyledWrapper>
        <video
            className="background"
            src={backgroundMp4}
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
