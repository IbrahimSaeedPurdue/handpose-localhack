// import logo from './logo.svg';

import React, { useRef, useEffect, useState } from 'react';

import * as tf from '@tensorflow/tfjs';
import Webcam from 'react-webcam';
import './App.css';
// hand recognition from webcam
import { Camera } from '@mediapipe/camera_utils/camera_utils';
import { Hands } from '@mediapipe/hands/hands';
// tfjs model
// import * as handpose from "@tensorflow-models/handpose";
// display
import { displayHand, displayEmpty } from './displayUtils';

function App () {
  const numContainerRef = useRef(null);
  const letterContainerRef = useRef(null);
  const numMode = useRef(true);

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const numPredictionText = useRef(null);
  const letterPredictionText = useRef(null);

  const numPredictions = useRef([]);
  const letterPredictions = useRef([]);

  const zeroDiv = useRef(null);
  const oneDiv = useRef(null);
  const twoDiv = useRef(null);
  const threeDiv = useRef(null);
  const fourDiv = useRef(null);
  const fiveDiv = useRef(null);

  const mDiv = useRef(null);
  const lDiv = useRef(null);
  const hDiv = useRef(null);

  window.webcamEl = null;
  window.recognizer = null;

  const updateNumUI = (currPrediction) => {
    const predictionsArr = numPredictions.current;

    const updateNumCols = (countArr) => {
      zeroDiv.current.style.height = (countArr[0] / 15 * 300) + 'px';
      oneDiv.current.style.height = (countArr[1] / 15 * 300) + 'px';
      twoDiv.current.style.height = (countArr[2] / 15 * 300) + 'px';
      threeDiv.current.style.height = (countArr[3] / 15 * 300) + 'px';
      fourDiv.current.style.height = (countArr[4] / 15 * 300) + 'px';
      fiveDiv.current.style.height = (countArr[5] / 15 * 300) + 'px';
    };

    if (predictionsArr.length < 16) return predictionsArr.push(currPrediction);

    predictionsArr.shift();
    predictionsArr.push(currPrediction);

    let updateText = true;
    const numCounts = [0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 10; i++) {
      numCounts[parseInt(predictionsArr[i])]++;

      if (predictionsArr[i] !== currPrediction) updateText = false;
    }
    // console.log(numCounts);
    updateNumCols(numCounts);
    if (updateText) numPredictionText.current.innerText = currPrediction + ' is the best numeric guess from 1 to 5';
  };

  const updateLetterUI = (currPrediction) => {
    const predictionsArr = letterPredictions.current;
    const updateLetterCols = (countArr) => {
      mDiv.current.style.height = (countArr[0] / 15 * 300) + 'px';
      lDiv.current.style.height = (countArr[1] / 15 * 300) + 'px';
      hDiv.current.style.height = (countArr[2] / 15 * 300) + 'px';
    };
    if (predictionsArr.length < 16) return predictionsArr.push(currPrediction);
    else {
      predictionsArr.shift();
      predictionsArr.push(currPrediction);
    }

    let updateText = true;
    // [M, L, H]
    const numCounts = [0, 0, 0];
    for (let i = 0; i < 10; i++) {
      if (predictionsArr[i] === 'M') numCounts[0]++;
      else if (predictionsArr[i] === 'L') numCounts[1]++;
      else if (predictionsArr[i] === 'H') numCounts[2]++;
      else return;

      if (predictionsArr[i] !== currPrediction) updateText = false;
    }
    // console.log(numCounts);
    updateLetterCols(numCounts);
    if (updateText) numPredictionText.current.innerText = currPrediction + ' is the best numeric guess from 1 to 5';
  };

  // called when image from webcam is successfully sent to the mediapipe hands model
  const onResults = async (results) => {
    if (results !== null) {
      // results is a canvas
      // console.log(results);
    }

    const ctx = canvasRef.current.getContext('2d');
    const canvas = canvasRef.current;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // results are non-empty
    if (results.multiHandLandmarks && results.multiHandedness) {
      // console.log(results);
      for (let i = 0; i < results.multiHandLandmarks.length; i++) {
        const [numPrediction, letterPrediction] = displayHand(
          results.image,
          results.multiHandedness[i],
          results.multiHandLandmarks[i],
          ctx,
          numPredictionText
        );

        // changes prediction text... after getting the same prediction 10 times
        // console.log(letterPrediction);
        updateNumUI(numPrediction);
        updateLetterUI(letterPrediction);
      }
    } else { // empty results
      displayEmpty(ctx, numPredictionText);
      displayEmpty(ctx, letterPredictionText);
    }
    ctx.restore();
  };

  // called to send picture to hands
  const sendPicture = async (hands) => {
    // validate videofeed
    if (
      typeof webcamRef.current !== 'undefined' &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      window.webcamEl = webcamRef.current.video;

      const video = webcamRef.current.video;
      const vw = webcamRef.current.video.videoWidth;
      const vh = webcamRef.current.video.videoHeight;

      video.width = vw;
      video.height = vh;

      canvasRef.current.width = vw;
      canvasRef.current.height = vh;

      /*
      const hand = await net.estimateHands(video);
      console.log(hand);
      if (hand.length > 0) {
        const GE = new fp.GestureEstimator([
          fp.Gestures.VictoryGesture,
          fp.Gestures.ThumbsUpGesture,
        ]);
        const gesture = await GE.estimate(hand[0].landmarks, 4);
        if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
          console.log(gesture.gestures);
          const confidence = gesture.gestures.map(
            (prediction) => prediction.confidence
          );
          const maxConfidence = confidence.indexOf(
            Math.max.apply(null, confidence)
          );
          console.log(gesture, gesture.gestures[maxConfidence].name);
        }
      } */

      if (cam === null) {
        console.log('setting up mediapipe camera for the first time');
        cam = new Camera(video, {
          onFrame: async () => {
            window.current_screenshot = video;
            await hands.send({ image: video });
          },
          width: 640,
          height: 480
        });
        cam.start();
      }
    }
  };

  // initialize camera, will be filled when page loaded
  let cam = null;

  const setupWidgets = async () => {
    // const net = await handpose.load();
    console.log('setting up widgets');

    // initialize mediapipe ML model
    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }
    });
    hands.setOptions({
      maxNumHands: 1,
      minDetectionConfidence: 0.8,
      minTrackingConfidence: 0.8
    });
    hands.onResults(onResults);

    // initialize custom hand recognizer
    window.recognizer = await tf.loadLayersModel(
      'https://aelu419.github.io/TensorFlowPlayground/asl_cnn/model.json'
    );
    window.recognizer.add(tf.layers.softmax());
    console.log(window.recognizer);

    // automatically send webcam picture to hands
    const refresh = () => {
      // console.log('refresh called');
      sendPicture(hands);
    };
    setInterval(refresh, 1000);
  };

  useEffect(() => { setupWidgets(); }, []);

  return (
    <div className='App'>
      <header>
        <Webcam ref={webcamRef} className='webcam' />
        <canvas ref={canvasRef} className='canvas' />
      </header>
      <div className='blog-slider'>
        <p style={{ textAlign: 'center' }}>Spread you hand towards the camera like a 5 to calibrate</p>
        <div ref={numContainerRef} className='numContainer'>
          <h4 ref={numPredictionText} style={{ textAlign: 'center' }}>No Prediction</h4>
          <div className='colContainer'>
            <div ref={zeroDiv} className='col'><p>0</p></div>
            <div ref={oneDiv} className='col'><p>1</p></div>
            <div ref={twoDiv} className='col'><p>2</p></div>
            <div ref={threeDiv} className='col'><p>3</p></div>
            <div ref={fourDiv} className='col'><p>4</p></div>
            <div ref={fiveDiv} className='col'><p>5</p></div>
          </div>
        </div>

        <div ref={letterContainerRef} className='letterContainer hidden'>
          <h4 ref={letterPredictionText} style={{ textAlign: 'center' }}>No Prediction</h4>
          <div className='colContainer'>
            <div ref={mDiv} className='col'>M</div>
            <div ref={lDiv} className='col'>L</div>
            <div ref={hDiv} className='col'>H</div>
          </div>
        </div>
        <div className='toggleContainer'>
          <p>Num Recognition</p>
          <div>
            <input
              type='checkbox'
              id='switch'
              onChange={() => {
                if (numMode.current) {
                  numContainerRef.current.classList.add('hidden');
                  letterContainerRef.current.classList.remove('hidden');
                } else {
                  letterContainerRef.current.classList.add('hidden');
                  numContainerRef.current.classList.remove('hidden');
                }
                numMode.current = !numMode.current;
              }}
            /><label for='switch'>Toggle</label>
            <strong>Toggle Mode</strong>
          </div>
          <p>letter Recognition</p>
        </div>
      </div>
    </div>
  );
}

export default App;
