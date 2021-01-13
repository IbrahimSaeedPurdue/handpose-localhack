import { convertCompilerOptionsFromJson } from 'typescript';

function lerp (v, w, t) {
  return v + (w - v) * t;
}

// draw green boundary around the hand
export const drawHand = (prediction, ctx) => {
  // ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = 'green';
  ctx.strokeStyle = 'rgba(171, 235, 52, 1)';
  // console.log(ctx);
  // console.log(prediction);

  if (prediction.length > 0) {
    prediction.forEach(hand => {
      const x1 = hand.boundingBox.topLeft[0];
      const x2 = hand.boundingBox.bottomRight[0];
      const y1 = hand.boundingBox.topLeft[1];
      const y2 = hand.boundingBox.bottomRight[1];

      ctx.lineWidth = lerp(0, 20, hand.handInViewConfidence);
      // console.log('confidence: ' + hand.handInViewConfidence);
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
    });
  }
};

// draw green boundary around the hand, but using mediapipe's data format
// export const drawHandMP = (image, classification, marks, ctx) => {
//   const w = image.width;
//   const h = image.height;

//   const score = classification.score;

//   ctx.clearRect(0, 0, w, h);
//   ctx.fillStyle = 'green';
//   ctx.strokeStyle = 'rgba(171, 235, 52, 1)';
//   // console.log(ctx);
//   // console.log(prediction);

//   // find the minimum and maximum boundaries from the landmarks, and use that to get boundary of the hand
//   if (marks.length > 0) {
//     let x1 = 100000000; let x2 = -100000000; let y1 = 1000000000; let y2 = -1000000000;

//     for (let i = 0; i < marks.length; i++) {
//       if (marks[i].x < x1) {
//         x1 = marks[i].x;
//       }
//       if (marks[i].x > x2) {
//         x2 = marks[i].x;
//       }
//       if (marks[i].y < y1) {
//         y1 = marks[i].y;
//       }
//       if (marks[i].y > y2) {
//         y2 = marks[i].y;
//       }
//     }

//     x1 *= w;
//     x2 *= w;
//     y1 *= h;
//     y2 *= h;

//     ctx.lineWidth = lerp(0, 20, score);
//     // console.log("confidence: " + score);
//     // console.log(x1, y1, x2, y2);
//     ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
//   }
// };

export const drawHandMP = (image, classification, marks, ctx) => {
  if (marks.length === 0) return;

  // all inclusive
  // 0 - base
  // thumb 0 - 4
  // index 5 - 8
  // middle 9 - 12
  // ring 13 - 16
  // pinky 17 - 21
  const fingers = [
    { range: [1, 4], color: 'red' },
    { range: [5, 8], color: 'blue' },
    { range: [9, 12], color: 'yellow' },
    { range: [13, 16], color: 'orange' },
    { range: [17, marks.length - 1], color: 'lime' }
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

// draw red boundary around the entire webcam, when no hand is detected
export const drawRed = (ctx) => {
  // console.log("no hand shown " + ctx.width + ", " + ctx.height);
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 10;
  ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};
