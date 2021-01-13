import React, { useRef } from 'react';

//for web camera
import Webcam from 'react-webcam';

//for tensorflowjs and handpose related
import * as tf from '@tensorflow/tfjs-core';
//import '@tensorflow/tfjs-backend-webgl';
//import * as handpose from "@tensorflow-models/handpose";

//for mediapipe handpose related
import {Camera} from '@mediapipe/camera_utils/camera_utils';
import {Hands} from '@mediapipe/hands/hands';
import {drawConnectors, drawLandmarks} from '@mediapipe/drawing_utils/drawing_utils';


//TODO: import custom model

//for canvas drawing on top of webcam
import {drawHand, drawHandMP, drawRed} from "./drawBoundary";

//require('@tensorflow/tfjs-backend-webgl');

/**
 * code referencing:
 * "Real Time AI Hand Pose estimation with Javascript, Tensorflow.JS and React.JS"
 * by Nicholas Renotte
 * & MediaPipe hand detection 
 */

const App = () => {
  const videoConstraints = {
    width: 720,
    height: 540,
    facingMode: 'user'
  };

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  //using the tensorflow implementation of handpose
  /*
  //load the handpose model
  const runHandpose = async () => {
    const net = await handpose.load();
    console.log(net);

    console.log("handpose model ready");
    //detect hand repeatedly
    setInterval(() => {
      detectHand(net);
    }, 100);
  }

  const detectHand = async (net) => {
    //validate videofeed
    if (
      typeof webcamRef.current != "undefined"
      && webcamRef.current !== null
      && webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const vw = video.width;
      const vh = video.height;
      //force parameters to set
      video.width = vw;
      video.height = vh;

      canvasRef.current.width = vw;
      canvasRef.current.height = vh;

      //detect hand boundaries using handpose
      const hand = await net.estimateHands(video);
      if (hand.length){
        drawHand(hand, canvasRef.current.getContext("2d"));
      }
      else{
        drawRed(canvasRef.current.getContext("2d"));
      }
    }
  }

  runHandpose();*/

  
  const onResults = (results) => {
    if (results !== null){
      console.log(results);
    }
    /*
    // Hide the spinner.
    document.body.classList.add('loaded');

    // Update the frame rate.
    fpsControl.tick();*/

    const canvasCtx = canvasRef.current.getContext("2d");
    const canvasElement = canvasRef.current;

    // Draw the overlays.
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    //canvasCtx.drawImage(
        //results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.multiHandLandmarks && results.multiHandedness) {
      for (let index = 0; index < results.multiHandLandmarks.length; index++) {
        
        const classification = results.multiHandedness[index];
        const isRightHand = classification.label === 'Right';
        const landmarks = results.multiHandLandmarks[index];
        
        //draw custom hands using the drawboundary methods
        drawHandMP(results.image, classification, landmarks, canvasCtx);

        //draw hand using utils
        /*
        drawConnectors(
            canvasCtx, landmarks, HAND_CONNECTIONS,
            {color: isRightHand ? '#00FF00' : '#FF0000'});
        drawLandmarks(canvasCtx, landmarks, {
          color: isRightHand ? '#00FF00' : '#FF0000',
          fillColor: isRightHand ? '#FF0000' : '#00FF00'
        });*/
      }
    }
    else{
      drawRed(canvasCtx);
    }
    canvasCtx.restore();
  }

  var cam = null;

  const setupComponents = async () => {
    
    //initialize ML model
    const hands = new Hands({locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }});
    hands.setOptions({
      maxNumHands: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
  
    hands.onResults(onResults);

    setInterval(() => {
      sendPicture(hands);
    }, 100);
  }

  const sendPicture = async (hands) => {
    //validate videofeed
    if (
      typeof webcamRef.current != "undefined"
      && webcamRef.current !== null
      && webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const vw = video.width;
      const vh = video.height;
      //force parameters to set
      video.width = vw;
      video.height = vh;

      canvasRef.current.width = vw;
      canvasRef.current.height = vh;

      if (cam === null){
        console.log("setup camera");
        cam = new Camera(video, {
          onFrame: async () => {
            await hands.send({image: video});
          },
          width: 720,
          height: 540
        });
        cam.start();
      }
      
    }
  }

  setupComponents();

  return (
    <div className="App">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat='image/jpeg'
          width = "720"
          height = "540"
          videoConstraints={videoConstraints}
          style={{
            position: "absolute",
            zIndex: 9
          }}
        />
        <canvas 
          ref = {canvasRef}
          style={{
            position: "absolute",
            height: 540,
            width: 720,
            zIndex: 9
          }}
        />
    </div>
  );
};

export default App;
