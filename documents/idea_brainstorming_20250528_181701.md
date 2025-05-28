# 이동 속도 설정 개선 브레인스토밍

## 배경/문제 맥락
- 현재 px/sec 단위는 사용자에게 직관적이지 않음
- 속도 범위가 너무 넓어 적절한 속도를 찾기 어려울 수 있음
- 기본값이 너무 느림 (50 px/sec)

## 구현된 개선사항

### 슬라이더 기반 직관적 속도 조절
- **Problem / Need**: 사용자가 px/sec 단위를 이해하기 어렵고, 너무 세밀한 조절이 불필요함
- **UX / Flow Consideration**: 
  - 슬라이더 UI 유지
  - 정확한 수치(px/sec) 표시 제거
  - 25단위로 조절 가능 (100, 125, 150, ..., 275, 300)
  - 기본값 200으로 설정
- **Location / Impact Scope**: 
  - `src/components/SettingsPanel/SpeedSetting.tsx` 컴포넌트 수정
  - `src/App.tsx`의 기본값 수정
- **Rationale**: 
  - 직관적인 슬라이더 조작으로 속도 조절 가능
  - 불필요한 기술적 수치를 숨겨 사용자 경험 개선
  - 25단위 스텝으로 적절한 세밀도 제공
  - 100~300px/sec 범위로 실용적인 속도 범위 설정

## 변경된 코드
```tsx
// SpeedSetting.tsx
export function SpeedSetting({ speed, setSpeed }: SpeedSettingProps) {
  return (
    <div>
      <label htmlFor="speed" className="block text-sm font-medium mb-2">
        이동 속도
      </label>
      <input
        type="range"
        id="speed"
        min="100"
        max="300"
        step="25"
        value={speed}
        onChange={e => setSpeed(Number(e.target.value))}
        className="w-full"
      />
    </div>
  )
}

// App.tsx
const [speed, setSpeed] = useState(200)
```

## 결과
- 사용자는 정확한 px/sec 값을 신경 쓸 필요 없이 슬라이더로 직관적인 속도 조절 가능
- 25단위 스텝으로 충분히 세밀한 조절이 가능하면서도 불필요하게 미세한 조절은 방지
- 실용적인 속도 범위(100~300px/sec)와 적절한 기본값(200px/sec) 설정

## 제안된 아이디어

### 1. 단순화된 속도 설정
- **Problem / Need**: 사용자가 px/sec 단위를 이해하기 어렵고, 너무 많은 선택지로 인해 결정이 어려움
- **UX / Flow Consideration**: 3단계 속도 설정으로 단순화 (느리게: 100px/sec, 보통: 200px/sec, 빠르게: 300px/sec)
- **Location / Impact Scope**: 
  - `src/components/SettingsPanel/SpeedSetting.tsx` 컴포넌트 수정
  - `src/App.tsx`의 기본값 수정
- **Rationale**: 사용자가 직관적으로 이해할 수 있는 단순한 선택지 제공

### 2. 상대적 속도 표시
- **Problem / Need**: 기술적인 단위(px/sec)가 사용자에게 의미가 없음
- **UX / Flow Consideration**: 슬라이더는 유지하되, 기본값(200px/sec) 대비 상대적인 속도를 퍼센트로 표시
- **Location / Impact Scope**: 
  - `src/components/SettingsPanel/SpeedSetting.tsx` 컴포넌트 수정
  - 속도 계산 로직 추가
- **Rationale**: 기존 UI의 장점(세밀한 조절)을 유지하면서 더 이해하기 쉬운 표시 방식 제공

### 3. 텍스트 길이 기반 자동 속도 조절
- **Problem / Need**: 텍스트 길이에 따라 적절한 속도가 다를 수 있음
- **UX / Flow Consideration**: 텍스트 입력 시 길이를 기반으로 최적의 속도를 자동 계산
- **Location / Impact Scope**: 
  - `src/utils/speedCalculator.ts` 새로운 유틸리티 파일 생성
  - `src/App.tsx`에 자동 계산 로직 통합
- **Rationale**: 사용자 입력에 따른 지능적인 기본값 제공으로 UX 향상

## ✅ 추천 우선순위 체크리스트

- [x] **단순화된 속도 설정** - 가장 직관적이고 구현이 간단함
- [ ] **상대적 속도 표시** - 기존 UI를 크게 바꾸지 않으면서도 개선 가능
- [ ] **텍스트 길이 기반 자동 속도 조절** - 고급 기능으로 나중에 추가 가능

## 권장 구현 순서
1. 먼저 "단순화된 속도 설정"을 구현하여 기본적인 사용성 개선
2. 사용자 피드백에 따라 추가 개선 사항 구현 여부 결정 