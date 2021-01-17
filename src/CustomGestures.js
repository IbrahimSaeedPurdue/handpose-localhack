// Import dependencies
import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

export const zero = new GestureDescription('0');
export const one = new GestureDescription('1');
export const two = new GestureDescription('2');
export const three = new GestureDescription('3');
export const four = new GestureDescription('4');
export const five = new GestureDescription('5');

// zero
zero.addCurl(Finger.Thumb, FingerCurl.FullCurl, 1.0);
zero.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0);
zero.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
zero.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
zero.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

// one
one.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
one.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
one.addDirection(Finger.Index, FingerDirection.VerticalUp, 1.0);
one.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
one.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
one.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

// Two
two.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
two.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
two.addDirection(Finger.Index, FingerDirection.VerticalUp, 1.0);

two.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
two.addDirection(Finger.Middle, FingerDirection.VerticalUp, 1.0);

two.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
two.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

// Three
three.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);

three.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
three.addDirection(Finger.Index, FingerDirection.VerticalUp, 1.0);

three.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
three.addDirection(Finger.Middle, FingerDirection.VerticalUp, 1.0);

three.addCurl(Finger.Ring, FingerCurl.NoCurl, 1.0);
three.addDirection(Finger.Ring, FingerDirection.VerticalUp, 1.0);

three.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

// four
four.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);

four.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
four.addDirection(Finger.Index, FingerDirection.VerticalUp, 1.0);

four.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
four.addDirection(Finger.Middle, FingerDirection.VerticalUp, 1.0);

four.addCurl(Finger.Ring, FingerCurl.NoCurl, 1.0);
four.addDirection(Finger.Ring, FingerDirection.VerticalUp, 1.0);

four.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);
four.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 1.0);

// five
five.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
five.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
five.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
five.addCurl(Finger.Ring, FingerCurl.NoCurl, 1.0);
five.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);
