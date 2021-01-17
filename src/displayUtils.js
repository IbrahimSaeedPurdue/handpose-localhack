import * as tf from '@tensorflow/tfjs';

// recognize gesture off of landmarks
import * as fp from 'fingerpose';
import { zero, one, two, three, four, five } from './CustomGestures';

const labels = [
  'M', 'L', 'H'
];

const GE = new fp.GestureEstimator([
  zero, one, two, three, four, five
]);

// draw green boundary around the hand
export const displayHand = (image, classification, marks, ctx, predictionRef) => {
  const w = image.width;
  const h = image.height;
  // let score = classification.score;

  // console.log(marks);

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = 'green';
  ctx.strokeStyle = 'rgba(171, 235, 52, 1)';

  // draw landmarks
  displayHandLandmarks(image, marks, ctx);

  const marks_ = new Array(21);
  for (let i = 0; i < 21; i++) {
    marks_[i] = [marks[i].x * w, marks[i].y * h, 0];
  }

  // console.log(marks_);

  const manual_gesture = GE.estimate(
    marks_, 7.5 // 7.5 is minimum confidence out of 10
  );

  // console.log(manual_gesture);
  let finalNumPrediction = null;
  if (manual_gesture.gestures !== undefined && manual_gesture.gestures.length > 0) {
    let maxConfidence = -1;
    let maxConfidenceIndex = -1;
    manual_gesture.gestures.forEach((gesture, index) => {
      if (gesture.confidence > maxConfidence) {
        maxConfidence = gesture.confidence;
        maxConfidenceIndex = index;
      }
    });

    const numPrediction = manual_gesture.gestures[maxConfidenceIndex].name;
    // value that will be return at the end
    finalNumPrediction = numPrediction;
    // console.log(predictionRef);
    // predictionRef.current.innerText = numPrediction + ' is the best numeric guess from 1 to 5';
    // console.log(manual_gesture.gestures[maxConfidenceIndex].name, 'is the best numeric guess from 1 to 5');
  } else {
    predictionRef.current.innerText = 'Found hand But gesture not recognized';
  }

  if (marks.length > 0) {
    let x1 = 1; let x2 = 0; let y1 = 1; let y2 = 0;
    marks.forEach(m => {
      if (m.x < x1) x1 = m.x;
      if (m.x > x2) x2 = m.x;
      if (m.y < y1) y1 = m.y;
      if (m.y > y2) y2 = m.y;
    });

    x1 *= w;
    x2 *= w;
    y1 *= h;
    y2 *= h;

    const x_mid = (x1 + x2) / 2;
    const y_mid = (y1 + y2) / 2;
    const factors = [0.5, 0.9, 1.2];

    const guesses = new Array(factors.length);
    const confidence = new Array(factors.length);

    let nGuess = 0;
    factors.forEach(scale_fac => {
      const w_ = Math.max((x2 - x1) * scale_fac, (y2 - y1) * scale_fac);
      // crop bound
      const x_min = Math.max(0, x_mid - w_);
      const y_min = Math.max(0, y_mid - w_);
      // get image from video
      // 64x64 rgba image on the left top corner of the canvas
      ctx.drawImage(window.webcamEl, x_min, y_min, 2 * w_, 2 * w_, 0, 0, 64, 64);

      const img_temp = ctx.getImageData(0, 0, 64, 64);

      const pix = new Float32Array(64 * 64 * 3);
      let cur = 0;
      for (let i = 0; i < 64 * 64 * 4; i++) {
        if (i % 4 !== 3) {
          if (i % 4 === 2) { pix[cur - 2] = img_temp.data[i] / 255.0; }
          if (i % 4 === 1) { pix[cur] = img_temp.data[i] / 255.0; }
          if (i % 4 === 0) { pix[cur + 2] = img_temp.data[i] / 255.0; }
          // pix[cur] = img_temp.data[i] / 255.0;
          cur += 1;
        }
      }

      // console.log(pix);

      const tensor = tf.tensor4d(pix, [1, 64, 64, 3], 'float32');
      // console.log(tensor.dataSync());
      if (window.recognizer === null) return [finalNumPrediction, null];
      const recognized = window.recognizer.predict(tensor).bufferSync().values;

      // console.log(recognized);

      let max = 0;
      let charindex = -1;
      for (let i = 0; i < recognized.length; i++) {
        if (recognized[i] > max) {
          max = recognized[i];
          charindex = i;
        }
      }

      confidence[nGuess] = max;
      guesses[nGuess] = charindex;

      nGuess += 1;
    });

    let best_confidence = confidence[0];
    let best_guess = guesses[0];
    for (let j = 1; j < nGuess; j++) {
      if (best_confidence < confidence[j]) {
        best_confidence = confidence[j];
        best_guess = guesses[j];
      }
    }

    // console.log(labels[best_guess], "is the best letter guess out of 'MLH' with confidence:", best_confidence);

    // console.log(labels[charindex], recognized[charindex]);

    // console.log(img_temp);

    // ctx.scale(64 / img_temp.width, 64 / img_temp.height);
    // ctx.putImageData(img_temp, 0, 0);

    ctx.lineWidth = 5;
    ctx.strokeRect(
      x1, y1,
      x2 - x1, y2 - y1
    );

    return [finalNumPrediction, labels[best_guess]];
  }
};

const displayHandLandmarks = (image, marks, ctx) => {
  if (marks.length === 0) return;

  // all inclusive
  // 0 - base
  // thumb 0 - 4
  // index 5 - 8
  // middle 9 - 12
  // ring 13 - 16
  // pinky 17 - 20
  const fingers = [
    { range: [1, 4], color: 'red' },
    { range: [5, 8], color: 'blue' },
    { range: [9, 12], color: 'yellow' },
    { range: [13, 16], color: 'orange' },
    { range: [17, 20], color: 'lime' }
  ];

  fingers.forEach(finger => {
    for (let i = finger.range[0]; i < finger.range[1]; i++) {
      const x1 = marks[i].x * image.width;
      const y1 = marks[i].y * image.height;

      // first dot
      ctx.beginPath();
      ctx.arc(x1, y1, 5, 0, 3 * Math.PI);
      ctx.fillStyle = finger.color;
      ctx.fill();

      ctx.moveTo(x1, y1);

      const x2 = marks[i + 1].x * image.width;
      const y2 = marks[i + 1].y * image.height;

      // line
      ctx.lineTo(x2, y2);
      ctx.lineWidth = 3;
      ctx.strokeStyle = finger.color;
      ctx.stroke();

      // second dot
      ctx.arc(x2, y2, 5, 0, 3 * Math.PI);
      ctx.fillStyle = finger.color;
      ctx.fill();
    }
  });

  // connecting each finger to the base
  const baseX = marks[0].x * image.width;
  const baseY = marks[0].y * image.height;
  fingers.forEach(finger => {
    // first landmark in finger
    const x = marks[finger.range[0]].x * image.width;
    const y = marks[finger.range[0]].y * image.height;

    ctx.moveTo(baseX, baseY);
    ctx.lineTo(x, y);
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'white';
    ctx.stroke();
  });
};

// draw red boundary around the entire screen when no hand is discovered
export const displayEmpty = (ctx, predictionRef) => {
  ctx.strokeStyle = 'tomato';
  ctx.lineWidth = 5;
  ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  predictionRef.current.innerText = 'No Prediction';
};
