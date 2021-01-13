import React, { useRef } from 'react';
import Webcam from 'react-webcam';

const App = () => {
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'user'
  };

  const webcamRef = useRef();

  return (
    <Webcam
      audio={false}
      height={720}
      ref={webcamRef}
      screenshotFormat='image/jpeg'
      width={1280}
      videoConstraints={videoConstraints}
    />
  );
};

export default App;
