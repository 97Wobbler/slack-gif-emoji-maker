# GIF 이모지 메이커 텍스트 애니메이션 효과 아이디어

## 배경
현재 텍스트에 대해서는 오른쪽에서 왼쪽으로의 슬라이딩 효과만 지원되고 있습니다. 이미지에 다양한 효과가 적용되는 것처럼, 텍스트에도 다양한 애니메이션 효과를 추가하여 더욱 역동적이고 개성 있는 GIF 이모지를 만들 수 있도록 하고자 합니다.

## 제안 아이디어

### A. 텍스트 전용 효과

### 1. 타이핑 효과 (Type Writer)
- **문제/필요성**: 텍스트가 한 번에 나타나는 것보다 더 자연스럽고 동적인 표현이 필요함
- **UX/플로우**: 텍스트가 한 글자씩 타이핑되듯이 나타나는 효과
- **영향 범위**: TextEffect 컴포넌트 수정 필요
- **근거**: 채팅이나 메시징 상황에서 자주 사용되는 효과로, 대화형 이모지에 적합

### 2. 페이드 인/아웃 + 크기 변화
- **문제/필요성**: 감정이나 강조를 더 효과적으로 표현할 필요가 있음
- **UX/플로우**: 텍스트가 서서히 나타나면서 크기가 커지거나, 반대로 작아지면서 사라지는 효과
- **영향 범위**: TextEffect 컴포넌트에 opacity와 scale 애니메이션 추가
- **근거**: 감정의 고조나 감소를 시각적으로 표현하기에 적합

### 3. 바운스 효과
- **문제/필요성**: 더 활기차고 재미있는 텍스트 표현이 필요함
- **UX/플로우**: 텍스트가 통통 튀는 듯한 효과나, 각 글자가 순차적으로 위아래로 움직이는 효과
- **영향 범위**: TextEffect 컴포넌트에 transform 애니메이션 추가
- **근거**: 즐거움, 신남 등의 긍정적인 감정을 표현하기에 적합

### 4. 색상 변화 효과
- **문제/필요성**: 텍스트의 시각적 주목도를 높일 필요가 있음
- **UX/플로우**: 텍스트 색상이 그라데이션처럼 변화하거나, 무지개색으로 변하는 효과
- **영향 범위**: TextEffect 컴포넌트에 color 애니메이션 추가
- **근거**: 화려하고 눈에 띄는 효과로, 축하나 특별한 순간을 강조하기에 적합

### B. 이미지 효과의 텍스트 적용

### 1. 회전 효과
- **문제/필요성**: 텍스트에도 회전 움직임을 통한 다이나믹한 표현이 필요함
- **UX/플로우**: 이미지처럼 텍스트도 360도 회전하거나 좌우로 흔들리는 효과
- **영향 범위**: TextEffect 컴포넌트에 rotation 애니메이션 추가
- **근거**: 이미지에서 잘 작동하는 회전 효과를 텍스트에도 적용하여 일관된 사용자 경험 제공

### 2. 진동/떨림 효과
- **문제/필요성**: 강조나 긴장감을 표현하는 효과가 필요함
- **UX/플로우**: 텍스트가 좌우 또는 상하로 빠르게 흔들리는 효과
- **영향 범위**: TextEffect 컴포넌트에 shake 애니메이션 추가
- **근거**: 이미지의 진동 효과가 텍스트에도 적용되면 감정 표현이 더욱 풍부해짐

### 3. 줌 인/아웃 효과
- **문제/필요성**: 텍스트의 크기 변화를 통한 강조가 필요함
- **UX/플로우**: 텍스트가 점점 커지거나 작아지는 효과
- **영향 범위**: TextEffect 컴포넌트에 scale 애니메이션 추가
- **근거**: 이미지의 줌 효과를 텍스트에 적용하여 주목도 조절 가능

### 4. 블러/선명도 효과
- **문제/필요성**: 텍스트의 가독성을 조절하여 다양한 연출이 필요함
- **UX/플로우**: 텍스트가 흐려졌다가 선명해지는 효과
- **영향 범위**: TextEffect 컴포넌트에 blur 필터 추가
- **근거**: 이미지의 블러 효과를 텍스트에 적용하여 드라마틱한 장면 전환 가능

## 우선순위 추천
- [x] 1. 타이핑 효과 (가장 기본적이면서도 활용도가 높음)
- [x] 2. 회전 효과 (이미지 효과와의 일관성 확보)
- [x] 3. 진동/떨림 효과 (감정 표현에 효과적)
- [ ] 4. 바운스 효과
- [ ] 5. 줌 인/아웃 효과
- [ ] 6. 페이드 인/아웃 + 크기 변화
- [ ] 7. 색상 변화 효과
- [ ] 8. 블러/선명도 효과

첫 번째 프로토타입으로는 **타이핑 효과**와 **회전 효과**를 함께 구현하는 것을 추천드립니다. 타이핑 효과는 텍스트만의 고유한 특성을 살린 효과이고, 회전 효과는 이미지 효과와의 일관성을 보여줄 수 있는 좋은 예시가 될 것 같습니다. 

## UI 개선 계획

### 1. 텍스트 효과 선택 UI
- **현재 문제점**: 
  - 텍스트 효과가 늘어남에 따라 단순한 드롭다운으로는 효과를 직관적으로 이해하기 어려움
  - 효과의 미리보기가 없어 사용자가 적용 전에 결과를 예측하기 어려움

- **개선 방안**:
  1. 효과 프리뷰 갤러리
     - 각 효과를 적용한 미리보기를 그리드 형태로 표시
     - 마우스 호버 시 실제 애니메이션 재생
     - 효과 이름과 간단한 설명 포함
  
  2. 효과 카테고리화
     - '텍스트 전용' / '이미지 공통' 등 카테고리별로 그룹화
     - 탭 또는 아코디언 메뉴로 구성하여 쉽게 탐색 가능

### 2. 효과 커스터마이징 패널
- **현재 문제점**:
  - 효과별로 다양한 옵션이 필요하나 현재는 기본값만 제공
  - 사용자가 효과를 자신의 필요에 맞게 조절할 수 없음

- **개선 방안**:
  1. 공통 컨트롤 패널
     - 애니메이션 속도 조절 슬라이더
     - 반복 횟수 설정
     - 지연 시간 설정
  
  2. 효과별 커스텀 컨트롤
     - 타이핑 효과: 글자 간 간격, 커서 스타일
     - 회전 효과: 회전 각도, 회전 방향
     - 진동 효과: 진동 강도, 진동 방향
     - 블러 효과: 블러 강도

### 3. 모바일 대응
- **현재 문제점**:
  - 데스크톱 중심의 UI로 모바일에서 조작이 불편
  - 터치 인터페이스에 최적화되지 않음

- **개선 방안**:
  1. 반응형 레이아웃
     - 모바일에서는 세로 스크롤 중심의 UI로 전환
     - 터치에 최적화된 큰 크기의 컨트롤
  
  2. 제스처 지원
     - 슬라이드로 효과 전환
     - 핀치로 크기 조절
     - 회전 제스처로 회전 효과 조절

## 구현 우선순위
1. 텍스트 효과 선택 UI (프리뷰 갤러리)
2. 기본적인 효과 커스터마이징 패널
3. 모바일 대응
4. 고급 커스터마이징 옵션

이러한 UI 개선은 단계적으로 진행하며, 사용자 피드백을 받아 지속적으로 개선해 나갈 예정입니다. 