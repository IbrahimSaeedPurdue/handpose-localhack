function lerp (v, w, t) {
    return v + (w - v) * t;
}

//draw green boundary around the hand
export const drawHand = (prediction, ctx) => {

    //ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "green";
    ctx.strokeStyle = 'rgba(171, 235, 52, 1)';
    //console.log(ctx);
    //console.log(prediction);

    if (prediction.length > 0){
        prediction.forEach(hand => {

            let x1 = hand.boundingBox.topLeft[0];
            let x2 = hand.boundingBox.bottomRight[0];
            let y1 = hand.boundingBox.topLeft[1];
            let y2 = hand.boundingBox.bottomRight[1];

            ctx.lineWidth = lerp(0, 20, hand.handInViewConfidence);
            console.log("confidence: " + hand.handInViewConfidence);
            ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
        });
    }
}

//draw green boundary around the hand, but using mediapipe's data format
export const drawHandMP = (image, classification, marks, ctx) => {

    let w = image.width;
    let h = image.height;

    let score = classification.score;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "green";
    ctx.strokeStyle = 'rgba(171, 235, 52, 1)';
    //console.log(ctx);
    //console.log(prediction);

    //find the minimum and maximum boundaries from the landmarks, and use that to get boundary of the hand
    if (marks.length > 0){

        let x1 = 100000000, x2 = -100000000, y1 = 1000000000, y2 = -1000000000;

        for (let i = 0; i < marks.length; i++){
            if (marks[i].x < x1){
                x1 = marks[i].x;
            }
            if (marks[i].x > x2){
                x2 = marks[i].x;
            }
            if (marks[i].y < y1){
                y1 = marks[i].y;
            }
            if (marks[i].y > y2){
                y2 = marks[i].y;
            }
        }

        x1 *= w;
        x2 *= w;
        y1 *= h;
        y2 *= h;

        ctx.lineWidth = lerp(0, 20, score);
        //console.log("confidence: " + score);
        console.log(x1, y1, x2, y2);
        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
    }
}

//draw red boundary around the entire webcam, when no hand is detected
export const drawRed = (ctx) => {
    //console.log("no hand shown " + ctx.width + ", " + ctx.height);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 10;
    ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}