# Session Context

## User Prompts

### Prompt 1

Base directory for this skill: /home/devgo/.claude/skills/skill-creator

# Skill Creator

A skill for creating new skills and iteratively improving them.

At a high level, the process of creating a skill goes like this:

- Decide what you want the skill to do and roughly how it should do it
- Write a draft of the skill
- Create a few test prompts and run claude-with-access-to-the-skill on them
- Help the user evaluate the results both qualitatively and quantitatively
  - While the runs happen...

### Prompt 2

Tool loaded.

### Prompt 3

Tool loaded.

### Prompt 4

스킬은 전반적으로 만족하는데 항상 한번 만들고 끝나는게 아닌점을 알아줘.

잘 쓰고 있다가 나중에 만들어줬던 환경에 가서 기존의 만들어진 유즈케이스등을 업데이트할 때도 이 스킬을 쓰니까 그 부분도 인지해주고 스킬에 해당 내용 넣어줄래?

### Prompt 5

Tool loaded.

### Prompt 6

좋아. 스킬 잘 만든거 같아. 내가 직접 테스트해볼거니까 README.md 파일 업데이트하고 커밋해줘

### Prompt 7

이 스킬 안에서 직접 테스트해볼려고 tests 폴더 만들고 gitignore 했는데 괜찮나?

### Prompt 8

/home/devgo/my-skills/skills/usecase-diagram-gen/tests/usecase/extracted/source.txt

테스트에서 이렇게 잘 만들어줬는데 이거 스킬에 확실하게 명시 안되어있으면 이렇게 usecase/extracted/source.txt 로 만들라는 부분도 적어줄래? pdf 를 파싱했을 때

### Prompt 9

/home/devgo/my-skills/skills/usecase-diagram-gen/tests/usecase

지금 만들어준 결과물 만족스러운데, 유즈케이스들도 분명 의존성 순서라고해야할까 선행도메인 같은 순서가 있을텐데 파일 앞에 넘버링을 달아서 사용자가 보기 편하게 하는 부분도 들어갔으면 좋겠어 스킬에

### Prompt 10

- 만들어진 내용을 보고 판단하는데, 일단 rfp 같은 요구사항ID 를 포함하는 문서에서 유즈케이스를 만들어냈다면, 유즈케이스다이어그램에 해당 ID 를 추적할 수 있게 연결 해줘야해

- 유즈케이스 다이어그램들도 각 ID를 가져야해. 

이부분 스킬에 업데이트해줄래?

### Prompt 11

그리고 이건 궁금해서 물어보는건데 

https://github.com/github/awesome-copilot/blob/main/skills/plantuml-ascii/SKILL.md

github에서 이런 스킬 만들었는데 

PlantUML ASCII Art Diagram Generator 이걸로 대체하는건 어떻게 생각해?

### Prompt 12

Tool loaded.

### Prompt 13

Tool loaded.

### Prompt 14

[Request interrupted by user for tool use]

### Prompt 15

지금 내용 정리해서 커밋, 푸쉬해줘

### Prompt 16

혹시 궁금한게 있는데, 유즈케이스 다이어그램 대신에 와이어프레임을 짤 수 있게 하는 문서를 만드는걸로 방향을 옮기는건 어떤가?

정확한 문서명이 기억나지 않았는데, 내 궁극적인 목적은 화면을 빠르게 만들어보는거거든. 근데 그건 다른 작업에서 할거고 스킬에선 화면을 만들기 좋게 사용자에게 받은 그 정보들을 통해서 화면설계서? 라고 해야하나 그런걸 만들어내는건데 현업에선 어떤 문서를 바탕으로 만들지?

### Prompt 17

아마 당분간 유즈케이스를 관리하지 않을거같아서 이 스킬을 변경하는게 나을거 같아. 
근데 인포메이션 아키텍텨는 그럼 안만드는거야?

### Prompt 18

그럼 이것두 IA 같은거에 그 요구사항 문서에 이미 ID 체계가 있는경우 추적할 수 있어?

### Prompt 19

지금 스킬을 그렇게 바꿔줘 어차피 관리 안될거니까

