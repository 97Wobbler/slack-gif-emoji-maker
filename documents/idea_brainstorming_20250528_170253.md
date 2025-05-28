# 아이디어 브레인스토밍 - 2025년 5월 28일 17시 02분 53초

## 📋 원본 아이디어
**그라디언트 배경 기본값 개선 및 스마트 색상 조합 기능**

사용자가 그라디언트 배경을 선택할 때 현재의 못생긴 빨강-파랑 기본값 대신, 어울리는 색상으로 자동 설정하거나 색상 조합 주사위 버튼을 통해 어울리는 색상을 자동 생성하는 기능

---

## 🎯 관련 아이디어

### 1. **스마트 색상 제안 시스템**
- **Problem / Need**: 그라디언트로 전환할 때 기본값이 보기 싫어서 사용자가 바로 이탈할 수 있는 문제 해결
- **UX / Flow Consideration**: 배경 타입을 그라디언트로 변경하는 순간, 현재 텍스트 색상을 기반으로 조화로운 그라디언트 색상을 자동으로 설정
- **Location / Impact Scope**: `src/components/SettingsPanel/BackgroundSetting.tsx`의 onChange 핸들러, `src/App.tsx`의 setBgType 로직
- **Rationale**: 사용자의 수동 작업을 최소화하면서도 즉시 만족스러운 결과를 제공

### 2. **프리셋 색상 팔레트 제공**
- **Problem / Need**: 색상 조합에 대한 디자인 지식이 없는 사용자도 쉽게 예쁜 이모지를 만들 수 있도록 지원
- **UX / Flow Consideration**: 배경 설정 섹션에 "추천 팔레트" 영역을 추가하여 원클릭으로 텍스트+배경 색상을 한 번에 적용
- **Location / Impact Scope**: `src/components/SettingsPanel/BackgroundSetting.tsx`에 새로운 팔레트 UI 추가, 팔레트 데이터를 별도 상수 파일로 관리
- **Rationale**: 디자이너가 큐레이션한 검증된 색상 조합으로 실패 확률을 최소화

### 3. **색상 조합 주사위 기능** ⭐
- **Problem / Need**: 사용자가 색상 선택에 고민하는 시간을 줄이고, 새로운 색상 조합을 발견할 기회 제공
- **UX / Flow Consideration**: 주사위 아이콘 버튼을 추가하여 클릭 시 텍스트 색상과 배경 색상(단색/그라디언트 모두)을 자동으로 설정
- **Location / Impact Scope**: `src/components/SettingsPanel/` 내에 새로운 `ColorRandomizer.tsx` 컴포넌트 생성, 색상 생성 로직을 `src/utils/colorUtils.ts`로 분리
- **Rationale**: 게임화 요소를 추가하여 재미있게 색상 조합을 탐색할 수 있도록 함

### 4. **대비도 기반 자동 조정**
- **Problem / Need**: 텍스트가 배경에 묻혀서 잘 안 보이는 경우 자동으로 가독성을 개선
- **UX / Flow Consideration**: 색상 변경 시 실시간으로 대비도를 계산하고, 기준치 이하일 경우 경고 표시 또는 자동 조정 제안
- **Location / Impact Scope**: `src/utils/accessibilityUtils.ts` 새로 생성, `src/components/SettingsPanel/ColorInput.tsx`에 대비도 표시 기능 추가
- **Rationale**: 접근성과 가독성을 보장하여 실제 사용 가능한 이모지 품질 향상

### 5. **상황별 색상 추천**
- **Problem / Need**: 사용자가 원하는 분위기나 감정을 표현할 수 있는 색상을 쉽게 찾을 수 있도록 지원
- **UX / Flow Consideration**: "밝고 활기찬", "차분하고 프로페셔널한", "귀엽고 파스텔" 등의 무드 버튼을 제공하여 해당 스타일의 색상 조합 적용
- **Location / Impact Scope**: `src/components/SettingsPanel/MoodSelector.tsx` 새로 생성, 무드별 색상 팔레트 데이터 관리
- **Rationale**: 사용자의 의도와 맥락에 맞는 색상 선택을 도와 더 만족스러운 결과물 생성

---

## ✅ 추천 우선순위 체크리스트

- [x] **3. 색상 조합 주사위 기능** - 구현 난이도가 적당하면서도 즉각적인 재미와 효과를 제공 ✅ **완료!**
- [ ] **1. 스마트 색상 제안 시스템** - 사용자 경험 개선 효과가 크고 기술적으로 흥미로운 도전
- [ ] **2. 프리셋 색상 팔레트 제공** - 안정적이고 확실한 효과를 보장하는 기본적인 해결책

### 🏆 첫 번째 프로토타입 추천
~~**색상 조합 주사위 기능**을 먼저 구현하는 것을 추천합니다.~~ ✅ **구현 완료!**

### 🎯 다음 추천: 프리셋 색상 팔레트 제공
이제 **프리셋 색상 팔레트 제공** 기능을 다음 단계로 구현하는 것을 추천합니다. 이유:
- 주사위 기능과 상호 보완적인 역할
- 디자이너가 큐레이션한 안정적인 색상 조합 제공
- 사용자의 선택권을 더욱 확장 