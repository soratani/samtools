import { isNum, isUndefined } from "./type";

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

export function rgbToHex(_color: string) {
  let arr = _color.replace('rgb(', '').replace(')', '').split(',');
  let r = +arr[0];
  let g = +arr[1];
  let b = +arr[2];
  return '#' + (r << 16 | g << 8 | b).toString(16);
}

export function rgbaToHex(_color: string) {
  return _color.replace('rgba(', '').replace(')', '').split(',').reduce((a, chanel, i) => {
    let hexNum = "";
    if (i === 3) {
      hexNum = Number(Math.round(Number(chanel) * 255)).toString(16);
    } else {
      hexNum = Number(chanel).toString(16)
    }
    return `${a}${hexNum.length === 1 ? '0' + hexNum : hexNum}`;
  }, '#')
}

export function hexToRgb(_color: string) {
  try {
    if(!_color.startsWith('#')) return '';
    let hex: any = _color.replace('#','');
    hex = hex.length < 6 ? repeatLetter(hex, 2):hex;
    hex = `0x${hex}`;
    return `rgb(${hex >> 16},${hex >> 8 & 0xff},${hex & 0xff})`
  } catch (error) {
    return ''
  }
}

export function hex(_color: string) {
  if(!_color) return '';
  if(_color.startsWith('rgba(')) return rgbaToHex(_color);
  if(_color.startsWith('rgb(')) return rgbToHex(_color);
  return ''
}

export function completionHex(color: string) {
  let _color = color;
  _color = _color.startsWith('#') ? _color.replace(/\#/g, '') : _color;
  if (_color.length > 3) return `#${_color}`;
  return _color.split('').reduce((a, b) => `${a}${b}${b}`, '#');
}

/**
 * 明度计算
 * @param hex 
 * @param lum 
 * @returns 
 */
function colorLight(hex: string, lum: number) {
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

function colorDark(hex: string, lum: number) {
  let rgb = hexToRgb(hex).replace('rgb(', '').replace(')','').split(',');
  lum = lum || 0;
  for (var i = 0; i < 3; i++) rgb[i] = Math.floor(Number(rgb[i]) * (1 - lum)) as any;
  return rgbToHex(`rgb(${rgb.join(',')})`)
}

/**
 * 颜色统一为hex
 * @param str 
 * @param num 
 * @returns 
 */
export function color(str: string, num?: number, dark?: boolean) {
  let _color = str;
  if (str.startsWith('rgba(') || str.startsWith('rgb(')) {
    _color = hexToRgb(hex(str));
  }
  if (isUndefined(num)) return str;
  return dark ? colorDark(_color, num): colorLight(_color, num);
}

export function opacity(code: string, num?: number): string {
  if (!isNum(num)) return code;
  let _color = code.toLowerCase();
  if (_color && /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(_color)) {
    if (_color.length === 4) {
      var colorNew = '#';
      for (var i = 1; i < 4; i += 1) {
        colorNew += _color.slice(i, i + 1).concat(_color.slice(i, i + 1));
      }
      _color = colorNew;
    }
    var colorChange = [];
    for (var j = 1; j < 7; j += 2) {
      colorChange.push(parseInt('0x' + _color.slice(j, j + 2)));
    }
    return color(`rgba(${colorChange.join(',')},${num})`);
  }
  if (_color.startsWith('rgb(')) {
    let numbers = _color.match(/(\d(\.\d+)?)+/g) as any;
    numbers = numbers.slice(0, 3).concat(num);
    return color('rgba(' + numbers.join(',') + ')');
  }
  if(_color.startsWith('rgba(')) {
    return opacity(rgbaToHex(_color), num);
  }
  return _color;
}

export function complementaryColor(code: string) {
  const _color = color(code).slice(1);
  const ind = parseInt(_color, 16);
  let iter = ((1 << 4 * _color.length) - 1 - ind).toString(16);
  if(iter.length >= _color.length) return `#${iter}`;
  iter = new Array(_color.length - 1).fill('0').reduce((a,b) => b + a, iter) as string;
  return '#' + iter;
}