# claude-discord-hook

Claude Code의 알림과 권한 요청을 Discord Bot으로 받고, 승인/거부를 원격으로 제어할 수 있는 스킬입니다.

## 기능

| 상황 | Discord 메시지 |
|------|---------------|
| 작업 완료 | 프로젝트명 / 마지막 응답 요약 |
| 시스템 알림 | 알림 메시지 |
| 권한 요청 (Bash, Edit 등) | 승인/거부 버튼 포함 메시지 |
| `!run` 명령 | Discord에서 Claude Code에 명령 전송 |

### Discord → Claude Code 원격 실행

- `!run <명령>` — Claude Code에 명령 전송
- `!run project명: <명령>` — 특정 프로젝트에 명령 전송
- `!cancel` — 실행 중인 작업 취소
- `!projects` — 등록된 프로젝트 목록 확인

다중 프로젝트 등록 시 **버튼으로 프로젝트 선택** 가능. 실행 중 **실시간 진행 상황** 업데이트.

## 빠른 설치

```bash
node scripts/setup.js
```

자세한 설치 방법은 [SKILL.md](./SKILL.md)를 참고하세요.
