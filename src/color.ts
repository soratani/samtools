import { isUndefined } from "./type";

function repeatWord(word: string, num: number) {
  var result = '';
  for (let i = 0; i < num; i++) {
    result += word;
  }
  return result;
}
function repeatLetter(word: string, num: number) {
  var result = '';
  for (let letter of word) {
    result += repeatWord(letter, num);
  }
  return result;
}

function rgba(color: string) {
  try {
    let hexNum: any = (color.startsWith('#') ? color : `#${color}`).substring(1);
    hexNum = '0x' + (hexNum.length < 6 ? repeatLetter(hexNum, 2) : hexNum);
    var r = hexNum >> 16;
    var g = hexNum >> 8 & '0xff' as any;
    var b = hexNum & '0xff' as any;
    return `rgb(${r},${g},${b})`;
  } catch (error) {
    return ''
  }
}

function hex(color: string) {
  if (color.indexOf("#") != -1) {
    return color;
  }
  let arr = color.split(',');
  let r = +arr[0].split('(')[1];
  let g = +arr[1];
  let b = +arr[2].split(')')[0];
  let value: any = (1 << 24) + r * (1 << 16) + g * (1 << 8) + b;
  value = value.toString(16);
  return '#' + value.slice(1);
}


function colorLuminance(hex: string, lum: number) {
  hex = String(hex).replace(/[^0-9a-f]/gi, '');
  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  lum = lum || 0;
  var rgb = "#", c, i;
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i * 2, 2), 16);
    c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
    rgb += ("00" + c).substr(c.length);
  }

  return rgb;
}


export function color(str: string, num?: number) {
  let _color = str;
  if (str.startsWith('rgba')) {
    _color = hex(str);
  }
  if(isUndefined(num)) return _color;
  return colorLuminance(_color, num);
}