/**
 * 텍스트의 언어 구성을 분석하여 최적의 세로 정렬을 계산하는 유틸리티
 */

interface TextAnalysis {
  hasKorean: boolean
  hasEnglish: boolean
  hasDescenders: boolean // g, j, p, q, y 등 아래로 내려가는 글자
  hasAscenders: boolean // b, d, f, h, k, l, t 등 위로 올라가는 글자
}

export function analyzeText(text: string): TextAnalysis {
  const koreanRegex = /[가-힣]/
  const englishRegex = /[a-zA-Z]/
  const descendersRegex = /[gjpqy]/
  const ascendersRegex = /[bdfhklt]/

  return {
    hasKorean: koreanRegex.test(text),
    hasEnglish: englishRegex.test(text),
    hasDescenders: descendersRegex.test(text),
    hasAscenders: ascendersRegex.test(text)
  }
}

export function calculateOptimalVerticalOffset(
  text: string, 
  baseVerticalOffset: number = 0
): number {
  const analysis = analyzeText(text)
  
  // 기본 오프셋 (사용자가 설정한 값)
  let adjustment = baseVerticalOffset
  
  if (analysis.hasKorean && !analysis.hasEnglish) {
    // 한글만 있는 경우: 한글은 위쪽으로 치우쳐 보이므로 아래로 조정
    adjustment += 2
  } else if (analysis.hasEnglish && !analysis.hasKorean) {
    // 영어만 있는 경우
    if (analysis.hasDescenders && !analysis.hasAscenders) {
      // descender만 있는 경우 (g, j, p, q, y): 위로 조정
      adjustment -= 4
    } else if (analysis.hasAscenders && !analysis.hasDescenders) {
      // ascender만 있는 경우 (b, d, f, h, k, l, t): 아래로 조정
      adjustment += 2
    } else if (!analysis.hasDescenders && !analysis.hasAscenders) {
      // 소문자 a, c, e, i, m, n, o, r, s, u, v, w, x, z 등: 약간 아래로
      adjustment += 1
    }
    // ascender와 descender가 모두 있으면 기본값 유지
  }
  // 한글과 영어가 섞여있으면 기본값 유지 (가장 균형잡힌 상태)
  
  return adjustment
}

export function getOptimalTextBaseline(text: string): CanvasTextBaseline {
  const analysis = analyzeText(text)
  
  // 대부분의 경우 'middle'이 적절하지만, 
  // 특정 경우에는 다른 베이스라인이 더 나을 수 있음
  if (analysis.hasKorean && !analysis.hasEnglish) {
    return 'middle' // 한글은 middle이 적절
  } else if (analysis.hasEnglish && !analysis.hasKorean) {
    return 'middle' // 영어도 middle로 유지하되 offset으로 조정
  }
  
  return 'middle' // 기본값
} 