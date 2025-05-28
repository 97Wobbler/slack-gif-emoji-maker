// 색상 관련 유틸리티 함수들

export interface ColorCombination {
  textColor: string;
  bgColor: string;
  bgGradient: [string, string];
}

/**
 * HEX 색상을 HSL로 변환
 */
export function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h * 360, s, l];
}

/**
 * HSL을 HEX 색상으로 변환
 */
export function hslToHex(h: number, s: number, l: number): string {
  h = h / 360;
  
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * 두 색상 간의 대비도 계산 (WCAG 기준)
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  const getLuminance = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const sRGB = [r, g, b].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * 랜덤한 아름다운 색상 조합 생성
 */
export function generateRandomColorCombination(): ColorCombination {
  // 다양한 색상 조합 스타일
  const styles = [
    'complementary', // 보색
    'analogous',     // 유사색
    'triadic',       // 삼색조
    'monochromatic', // 단색조
    'pastel',        // 파스텔
    'vivid',         // 비비드
    'dark',          // 다크
    'light'          // 라이트
  ];

  const style = styles[Math.floor(Math.random() * styles.length)];
  
  switch (style) {
    case 'complementary':
      return generateComplementaryColors();
    case 'analogous':
      return generateAnalogousColors();
    case 'triadic':
      return generateTriadicColors();
    case 'monochromatic':
      return generateMonochromaticColors();
    case 'pastel':
      return generatePastelColors();
    case 'vivid':
      return generateVividColors();
    case 'dark':
      return generateDarkColors();
    case 'light':
      return generateLightColors();
    default:
      return generateComplementaryColors();
  }
}

/**
 * 보색 조합 생성
 */
function generateComplementaryColors(): ColorCombination {
  const baseHue = Math.random() * 360;
  const complementHue = (baseHue + 180) % 360;
  
  const textColor = hslToHex(baseHue, 0.7 + Math.random() * 0.3, 0.2 + Math.random() * 0.3);
  const bgColor1 = hslToHex(complementHue, 0.6 + Math.random() * 0.3, 0.7 + Math.random() * 0.2);
  const bgColor2 = hslToHex(complementHue + 30, 0.6 + Math.random() * 0.3, 0.8 + Math.random() * 0.15);
  
  return {
    textColor,
    bgColor: bgColor1,
    bgGradient: [bgColor1, bgColor2]
  };
}

/**
 * 유사색 조합 생성
 */
function generateAnalogousColors(): ColorCombination {
  const baseHue = Math.random() * 360;
  const range = 30 + Math.random() * 30; // 30-60도 범위
  
  const textColor = hslToHex(baseHue, 0.8 + Math.random() * 0.2, 0.15 + Math.random() * 0.25);
  const bgColor1 = hslToHex((baseHue + range) % 360, 0.5 + Math.random() * 0.3, 0.75 + Math.random() * 0.2);
  const bgColor2 = hslToHex((baseHue + range + 20) % 360, 0.5 + Math.random() * 0.3, 0.8 + Math.random() * 0.15);
  
  return {
    textColor,
    bgColor: bgColor1,
    bgGradient: [bgColor1, bgColor2]
  };
}

/**
 * 삼색조 조합 생성
 */
function generateTriadicColors(): ColorCombination {
  const baseHue = Math.random() * 360;
  const hue2 = (baseHue + 120) % 360;
  const hue3 = (baseHue + 240) % 360;
  
  const textColor = hslToHex(baseHue, 0.8 + Math.random() * 0.2, 0.2 + Math.random() * 0.3);
  const bgColor1 = hslToHex(hue2, 0.6 + Math.random() * 0.3, 0.7 + Math.random() * 0.2);
  const bgColor2 = hslToHex(hue3, 0.6 + Math.random() * 0.3, 0.75 + Math.random() * 0.2);
  
  return {
    textColor,
    bgColor: bgColor1,
    bgGradient: [bgColor1, bgColor2]
  };
}

/**
 * 단색조 조합 생성
 */
function generateMonochromaticColors(): ColorCombination {
  const baseHue = Math.random() * 360;
  const saturation = 0.6 + Math.random() * 0.4;
  
  const textColor = hslToHex(baseHue, saturation, 0.15 + Math.random() * 0.25);
  const bgColor1 = hslToHex(baseHue, saturation * 0.7, 0.75 + Math.random() * 0.2);
  const bgColor2 = hslToHex(baseHue, saturation * 0.5, 0.85 + Math.random() * 0.1);
  
  return {
    textColor,
    bgColor: bgColor1,
    bgGradient: [bgColor1, bgColor2]
  };
}

/**
 * 파스텔 조합 생성
 */
function generatePastelColors(): ColorCombination {
  const baseHue = Math.random() * 360;
  const complementHue = (baseHue + 150 + Math.random() * 60) % 360;
  
  const textColor = hslToHex(baseHue, 0.6 + Math.random() * 0.3, 0.25 + Math.random() * 0.3);
  const bgColor1 = hslToHex(complementHue, 0.4 + Math.random() * 0.3, 0.8 + Math.random() * 0.15);
  const bgColor2 = hslToHex((complementHue + 20) % 360, 0.3 + Math.random() * 0.3, 0.85 + Math.random() * 0.1);
  
  return {
    textColor,
    bgColor: bgColor1,
    bgGradient: [bgColor1, bgColor2]
  };
}

/**
 * 비비드 조합 생성
 */
function generateVividColors(): ColorCombination {
  const baseHue = Math.random() * 360;
  const complementHue = (baseHue + 180 + Math.random() * 60 - 30) % 360;
  
  const textColor = hslToHex(baseHue, 0.9 + Math.random() * 0.1, 0.2 + Math.random() * 0.2);
  const bgColor1 = hslToHex(complementHue, 0.8 + Math.random() * 0.2, 0.6 + Math.random() * 0.2);
  const bgColor2 = hslToHex((complementHue + 30) % 360, 0.8 + Math.random() * 0.2, 0.7 + Math.random() * 0.2);
  
  return {
    textColor,
    bgColor: bgColor1,
    bgGradient: [bgColor1, bgColor2]
  };
}

/**
 * 다크 조합 생성
 */
function generateDarkColors(): ColorCombination {
  const baseHue = Math.random() * 360;
  const complementHue = (baseHue + 120 + Math.random() * 120) % 360;
  
  const textColor = hslToHex(baseHue, 0.7 + Math.random() * 0.3, 0.8 + Math.random() * 0.15);
  const bgColor1 = hslToHex(complementHue, 0.6 + Math.random() * 0.3, 0.15 + Math.random() * 0.2);
  const bgColor2 = hslToHex((complementHue + 30) % 360, 0.6 + Math.random() * 0.3, 0.25 + Math.random() * 0.2);
  
  return {
    textColor,
    bgColor: bgColor1,
    bgGradient: [bgColor1, bgColor2]
  };
}

/**
 * 라이트 조합 생성
 */
function generateLightColors(): ColorCombination {
  const baseHue = Math.random() * 360;
  const complementHue = (baseHue + 150 + Math.random() * 60) % 360;
  
  const textColor = hslToHex(baseHue, 0.8 + Math.random() * 0.2, 0.2 + Math.random() * 0.25);
  const bgColor1 = hslToHex(complementHue, 0.3 + Math.random() * 0.4, 0.9 + Math.random() * 0.08);
  const bgColor2 = hslToHex((complementHue + 20) % 360, 0.2 + Math.random() * 0.4, 0.92 + Math.random() * 0.06);
  
  return {
    textColor,
    bgColor: bgColor1,
    bgGradient: [bgColor1, bgColor2]
  };
}

/**
 * 색상 조합의 대비도 검증 및 조정
 */
export function ensureGoodContrast(combination: ColorCombination): ColorCombination {
  const { textColor, bgColor, bgGradient } = combination;
  
  // 단색 배경과의 대비도 확인
  let adjustedBgColor = bgColor;
  let contrastRatio = calculateContrastRatio(textColor, bgColor);
  
  if (contrastRatio < 4.5) {
    // 대비도가 낮으면 배경을 조정
    const [h, s, l] = hexToHsl(bgColor);
    const [, , textL] = hexToHsl(textColor);
    
    // 텍스트가 밝으면 배경을 어둡게, 텍스트가 어두우면 배경을 밝게
    const newL = textL > 0.5 ? Math.max(0.1, l - 0.4) : Math.min(0.9, l + 0.4);
    adjustedBgColor = hslToHex(h, s, newL);
  }
  
  // 그라디언트 색상도 유사하게 조정
  const [grad1H, grad1S, grad1L] = hexToHsl(bgGradient[0]);
  const [grad2H, grad2S, grad2L] = hexToHsl(bgGradient[1]);
  const [, , textL] = hexToHsl(textColor);
  
  const adjustGradientL = (l: number) => {
    return textL > 0.5 ? Math.max(0.1, l - 0.2) : Math.min(0.9, l + 0.2);
  };
  
  const adjustedGradient: [string, string] = [
    hslToHex(grad1H, grad1S, adjustGradientL(grad1L)),
    hslToHex(grad2H, grad2S, adjustGradientL(grad2L))
  ];
  
  return {
    textColor,
    bgColor: adjustedBgColor,
    bgGradient: adjustedGradient
  };
} 