# Frontend F - 음성 인터페이스 전용 프론트엔드

이 프론트엔드는 GPTGPT1 프로젝트의 음성 기반 인터페이스를 제공하는 React 애플리케이션입니다. 사용자의 음성 입력을 처리하고 AI 응답을 음성으로 출력하는 전용 인터페이스를 구현합니다.

## 주요 기능

### 실시간 음성 인식 및 대화

-   WebRTC 기반 실시간 오디오 스트리밍
-   음성 활성화 감지 (VAD)를 통한 자동 음성 인식 시작/종료
-   실시간 텍스트 변환 피드백

### 음성 합성 출력

-   AI 응답을 네이버 클로바 TTS를 통한 자연스러운 음성으로 변환
-   다양한 음성 옵션 및 설정 지원
-   음성 재생 제어 (일시 정지, 재개, 속도 조절)

### 고급 오디오 처리

-   노이즈 캔슬링 및 음질 향상
-   마이크 입력 레벨 자동 조정
-   음성 활성화 시각적 피드백

### 대화 인터페이스

-   전체 대화 기록 시각화
-   대화 내용 저장 및 내보내기
-   다크/라이트 모드 지원

### 접근성 기능

-   키보드 단축키 지원
-   고대비 모드
-   스크린 리더 호환성
-   반응형 디자인

## 기술 스택

-   **프레임워크**: React 19
-   **언어**: TypeScript
-   **상태 관리**: React Context API
-   **스타일링**: Styled Components
-   **오디오 처리**:
    -   Web Audio API
    -   MediaRecorder API
    -   WebRTC
-   **UI 컴포넌트**: 커스텀 컴포넌트 라이브러리
-   **HTTP 클라이언트**: Axios
-   **WebSocket**: 실시간 통신
-   **테스트**: Jest, React Testing Library

## 설치 및 실행 방법

### 요구사항

-   Node.js 18+
-   npm 9+ 또는 yarn 1.22+

### 설치

1. 저장소에서 프로젝트를 클론한 후 frontend_F 디렉토리로 이동합니다.

```bash
cd gptgpt1/frontend_F
```

2. 의존성 패키지를 설치합니다.

```bash
npm install
# 또는
yarn install
```

### 환경 설정

`.env` 파일을 frontend_F 디렉토리에 생성하고 다음 변수를 설정합니다:

```
REACT_APP_API_URL=http://localhost:10000
REACT_APP_WS_URL=ws://localhost:10000
REACT_APP_AUDIO_SAMPLE_RATE=16000
REACT_APP_ENABLE_VAD=true
REACT_APP_TTS_VOICE=nara
```

### 개발 서버 실행

```bash
npm start
# 또는
yarn start
```

개발 서버는 기본적으로 http://localhost:3000에서 실행됩니다.

### 프로덕션 빌드

```bash
npm run build
# 또는
yarn build
```

빌드된 파일은 `build` 디렉토리에 생성됩니다.

## 주요 컴포넌트

### 1. AudioRecorder

오디오 입력을 처리하고 녹음을 관리하는 컴포넌트입니다. WebRTC 및 MediaRecorder API를 사용하여 오디오 스트림을 캡처하고 처리합니다.

```tsx
<AudioRecorder
    onRecordingStart={handleRecordingStart}
    onRecordingEnd={handleRecordingEnd}
    onAudioData={handleAudioData}
    vadEnabled={true}
    vadSensitivity={3}
/>
```

### 2. AudioPlayer

AI 응답을 음성으로 재생하는 컴포넌트입니다. 다양한 제어 기능과 시각적 피드백을 제공합니다.

```tsx
<AudioPlayer
    src={audioUrl}
    autoPlay={true}
    controls={true}
    onEnded={handleAudioEnded}
/>
```

### 3. ConversationView

대화 기록을 시각적으로 표시하는 컴포넌트입니다. 사용자 메시지와 AI 응답을 구분하여 보여줍니다.

```tsx
<ConversationView
    messages={conversationHistory}
    highlightCurrentMessage={true}
    onExport={handleExportConversation}
/>
```

### 4. VoiceVisualizer

음성 입력 및 출력의 음량 레벨을 시각적으로 표시하는 컴포넌트입니다.

```tsx
<VoiceVisualizer
    audioStream={microphoneStream}
    isActive={isRecording}
    colorScheme="blue"
/>
```

### 5. SettingsPanel

오디오 관련 설정을 조정할 수 있는 패널 컴포넌트입니다.

```tsx
<SettingsPanel
    onVoiceChange={handleVoiceChange}
    onSpeechRateChange={handleSpeechRateChange}
    onVadSensitivityChange={handleVadSensitivityChange}
/>
```

## 폴더 구조

```
frontend_F/
├── public/                 # 정적 파일
│   ├── index.html          # HTML 템플릿
│   ├── favicon.ico         # 파비콘
│   └── sounds/             # 알림음 파일
├── src/                    # 소스 코드
│   ├── components/         # React 컴포넌트
│   │   ├── AudioPlayer/    # 오디오 재생 컴포넌트
│   │   ├── AudioRecorder/  # 오디오 녹음 컴포넌트
│   │   ├── ConversationView/ # 대화 표시 컴포넌트
│   │   ├── Settings/       # 설정 관련 컴포넌트
│   │   ├── UI/             # 일반 UI 컴포넌트
│   │   └── VoiceVisualizer/ # 음성 시각화 컴포넌트
│   ├── contexts/           # React 컨텍스트
│   │   ├── AudioContext.tsx # 오디오 관련 상태 관리
│   │   └── ConversationContext.tsx # 대화 상태 관리
│   ├── hooks/              # 커스텀 훅
│   │   ├── useAudioRecording.ts # 오디오 녹음 훅
│   │   ├── useVoiceActivation.ts # VAD 활용 훅
│   │   └── useWebSocket.ts # 웹소켓 연결 훅
│   ├── services/           # API 통신 및 서비스
│   │   ├── api.ts          # API 클라이언트
│   │   ├── audioProcessor.ts # 오디오 처리 유틸리티
│   │   └── webSocketService.ts # 웹소켓 관리
│   ├── utils/              # 유틸리티 함수
│   │   ├── audioHelpers.ts # 오디오 관련 유틸리티
│   │   └── formatters.ts   # 데이터 포맷팅 유틸리티
│   ├── types/              # TypeScript 타입 정의
│   │   └── index.ts        # 공통 타입 정의
│   ├── App.tsx             # 앱 루트 컴포넌트
│   ├── index.tsx           # 앱 진입점
│   └── styles.css          # 글로벌 스타일
├── .env                    # 환경 변수
├── package.json            # 의존성 정의
├── tsconfig.json           # TypeScript 설정
└── README.md               # 이 파일
```

## 사용법

### 1. 기본 사용법

1. 페이지에 접속하면 마이크 접근 권한을 요청합니다.
2. 마이크 권한을 허용한 후, 중앙의 마이크 버튼을 눌러 대화를 시작합니다.
3. 음성 활성화 감지 기능이 활성화된 경우, 말을 시작하면 자동으로 녹음이 시작됩니다.
4. 말을 멈추면 자동으로 녹음이 종료되고 서버로 음성이 전송됩니다.
5. 서버의 응답은 자동으로 음성으로 변환되어 재생됩니다.
6. 대화 기록은 화면에 표시되며, 필요시 저장할 수 있습니다.

### 2. 단축키

-   `Space`: 녹음 시작/중지
-   `Esc`: 현재 오디오 재생 중지
-   `Ctrl+S`: 현재 대화 저장
-   `Ctrl+,`: 설정 패널 열기

### 3. 설정 옵션

-   **음성 선택**: AI 응답을 위한 다양한 TTS 음성 선택
-   **음성 속도**: 음성 재생 속도 조정 (0.5x-2.0x)
-   **VAD 감도**: 음성 활성화 감지 감도 조정
-   **마이크 볼륨**: 입력 마이크 볼륨 조정
-   **테마**: 라이트/다크 모드 전환

## 웹소켓 프로토콜

Frontend F는 실시간 오디오 스트리밍을 위해 백엔드와 WebSocket 통신을 사용합니다.

### 연결 설정

```typescript
const socket = new WebSocket(
    `${WS_URL}/realtime_stream?company_name=${companyName}`
);
```

### 메시지 형식

1. **클라이언트에서 서버로 (오디오 데이터)**

```json
{
    "type": "audio_data",
    "data": "base64EncodedAudioData",
    "sample_rate": 16000,
    "is_last": false
}
```

2. **서버에서 클라이언트로 (텍스트 변환)**

```json
{
    "type": "transcription",
    "text": "음성 인식 결과 텍스트",
    "is_final": true
}
```

3. **서버에서 클라이언트로 (AI 응답)**

```json
{
    "type": "response",
    "text": "AI 응답 텍스트",
    "audio_url": "TTS 오디오 URL 또는 base64 데이터"
}
```

## 성능 최적화

### 오디오 처리 최적화

-   오디오 데이터는 16kHz 샘플링 레이트, 16비트 모노로 처리됩니다.
-   실시간 처리를 위해 청크 단위로 오디오 데이터를 전송합니다.
-   웹 워커를 사용하여 오디오 처리를 메인 스레드에서 분리합니다.

### 네트워크 최적화

-   오디오 데이터는 base64로 인코딩하여 WebSocket으로 전송합니다.
-   연결 상태에 따라 데이터 전송 속도를 동적으로 조절합니다.
-   연결 재시도 메커니즘을 구현하여 일시적인 네트워크 문제를 처리합니다.

### React 최적화

-   React.memo와 useMemo를 사용하여 불필요한 리렌더링을 방지합니다.
-   대량의 대화 기록은 가상화 목록으로 처리하여 성능을 유지합니다.
-   이미지와 오디오 파일은 지연 로딩을 사용합니다.

## 문제 해결

### 오디오 녹음 문제

-   **마이크가 감지되지 않음**: 브라우저 권한을 확인하고 마이크 접근을 허용해주세요.
-   **VAD가 작동하지 않음**: 배경 소음이 낮은 환경에서 시도하거나 VAD 감도를 높이세요.
-   **오디오 품질 문제**: 좋은 품질의 마이크를 사용하고 잡음이 적은 환경에서 사용하세요.

### 연결 문제

-   **웹소켓 연결 실패**: 백엔드 서버가 실행 중인지 확인하고 방화벽 설정을 확인하세요.
-   **응답 지연**: 네트워크 상태를 확인하고 서버 부하 상태를 모니터링하세요.
-   **오디오 파일이 재생되지 않음**: 브라우저의 오디오 출력 설정을 확인하세요.

### 브라우저 호환성

-   Chrome, Firefox, Edge 최신 버전에서 최적의 성능을 제공합니다.
-   Safari는 일부 Web Audio API 기능에 제한이 있을 수 있습니다.
-   모바일 브라우저에서는 일부 기능이 제한될 수 있습니다.

## 기여 방법

1. 이 저장소를 포크합니다.
2. 새로운 기능 브랜치를 만듭니다 (`git checkout -b feature/amazing-feature`).
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`).
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`).
5. Pull Request를 생성합니다.

## 라이선스

이 프로젝트는 [라이선스 명시] 하에 배포됩니다.
