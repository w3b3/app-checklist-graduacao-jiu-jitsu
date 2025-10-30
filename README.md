# App Checklist Graduação Jiu-Jitsu

## Product Vision
- Deliver a pocket checklist so BJJ students can understand every belt requirement and track their preparation progress.
- Keep the first release extremely focused: a single-screen experience with belt filters, requirement checkboxes, and a simple progress visualization.
- Allow lightweight evidence capture (notes or video link) and celebrate completion with a shareable certificate image.

## Target Users & Devices
- Primary: Students training for blue, purple, brown, and black belt exams at Brothers Fight (iOS and Android phones).
- Secondary: Professors who need a quick way to review a student's progress in person.

## MVP Scope (Ship Today)
- Single shared codebase using Expo (React Native) for fast delivery to both platforms.
- Local requirement catalog bundled as JSON; no backend dependency for the first release.
- Belt selector tabs (Azul, Roxa, Marrom, Preta).
- Requirement list displaying: requirement name, count target (if applicable), status checkbox, optional note/video URL field, and "view details" action placeholder for future media.
- Animated progress bar (0–100%) that updates as checkboxes are toggled.
- “Reset belt progress” action per belt.
- Completion screen with generated certificate graphic (basic template with belt color, student name, completion date) and native share sheet invocation.
- Offline-first; persistence via AsyncStorage.

## Out of Scope (Future)
- Instructor accounts or backend sync.
- Embedded training videos or photo capture; link field only.
- Push notifications.
- Detailed analytics.

## Data Model Draft
```ts
type Requirement = {
  id: string;
  belt: "azul" | "roxa" | "marrom" | "preta";
  category: string;
  name: string;
  targetCount?: number;
  notes?: string;
  mediaUrl?: string;
};
```

Requirements are grouped by belt; black belt requirements mirror brown belt items but demand documented explanations.

## Belt Requirement Catalog

### Faixa Azul
- **Quedas**: Double Leg; Single Leg.
- **Passagem**: Passagem guarda fechada; Passada de meia guarda com joelho espetado; Passagem de meia guarda para montada; Passagem de guarda aberta toreador.
- **Cem Kilos**: Americana; Katagatame; Kimura; Kimura norte sul; Arm lock.
- **Joelho na Barriga**: Arm lock; Estrangulamento cruzado; Estrangulamento cruzado com lapela.
- **Montada**: Americana; Ezequiel; Arm lock; Estrangulamento Cruzado.
- **Guarda Fechada**: Arm lock; Omoplata; Triangulo; Kimura; Estrangulamento Cruzado.
- **Meia Guarda**: Raspagem com esgrima; Raspagem esgrima com pegada de costa.
- **Costas**: Mata-Leão; Estrangulamento Cruzado; Arco e Flexa.
- **Raspagem**: Raspagem da guarda fechada pra montada; Raspagem tesoura; Raspagem Kimura; Raspagem de gancho.
- **Saídas**: Saída da Montada; Saída dos 100 Kilos; Saída das Costas; Saída do Triangulo; Saída do Arm Lock da guarda fechada; Saída do Arm Lock com as costas no chão; Reposição de guarda fechada.
- **Fundamentos**: Amarrar Faixa; Pontuações; Saída de quadril; Rolamento de frente; Rolamento de costas; Sprawl; Chamar na guarda fechada; Chamar na guarda aberta; Chamar na meia guarda.
- **Ataque de Pé**: Botinha na passagem de guarda.

### Faixa Roxa
- 02 Baianas (leve + pesado).
- 06 Quedas com nomes.
- 02 Raspagem com oponente de joelhos.
- 02 Raspagem com oponente em pé.
- 02 Raspagem da meia guarda.
- 04 Passagens de guarda.
- 03 Arm Locks em diferentes posições.
- 02 Triângulos.
- 02 Omoplatas.
- 03 Estrangulamentos na guarda.
- 03 Estrangulamentos na montada.
- 03 Finalizações no 100kg.
- 02 Saídas da montada.
- 02 Saída de pegada pelas costas.
- 02 Idas para as costas, sendo 01 berimbolo.

### Faixa Marrom
- 02 Baianas (leve + pesado).
- 08 Quedas com nomes.
- 03 Raspagens com oponente de joelhos.
- 03 Raspagens com oponente em pé.
- 03 Raspagens da meia guarda.
- 01 Raspagem da guarda 50/50.
- 01 Raspagem da guarda de lapela.
- 07 Passagens de guarda, sendo: 01 da meia guarda; 01 da guarda 50/50; 01 da guarda de lapela.
- 04 Arm Locks em diferentes posições.
- 02 Triângulos.
- 02 Omoplatas.
- 03 Finalizações com joelho na barriga.
- 04 Finalizações nas costas.
- 01 Finalização da guarda 50/50.
- 03 Finalizações no pé.
- 02 Leg Lock.
- 03 Estrangulamentos no 100kg.
- 03 Saídas da montada.
- 03 Idas para as costas, sendo 01 berimbolo.

### Faixa Preta
- Mesma relação de técnicas da faixa marrom, com exigência de explicação detalhada de cada movimento.

## Implementation Plan
- **Project setup**: Initialize Expo managed workflow, typescript template, eslint/prettier, and folder structure (`src/assets`, `src/data`, `src/screens`, `src/components`).
- **Static catalog**: Encode belt requirements in `src/data/requirements.ts` matching the structure above; include belt metadata (color, display name).
- **State & persistence**: Build store using Zustand or React Context + reducer; persist belt progress to AsyncStorage.
- **UI scaffolding**: Create belt selector tabs, requirement list component with checkbox and optional note/link modal, and empty state placeholder.
- **Progress feedback**: Implement animated progress bar (Reanimated or simple Animated API) and per-belt completion stats chip.
- **Certificate flow**: Build completion modal that renders certificate view (React Native SVG or View snapshot), use `expo-sharing` to trigger native share sheet.
- **Polish & QA**: Add splash screen/icon placeholders, smoke test on iOS/Android simulators, document manual testing checklist in repo.

## Immediate Next Steps
- Confirm requirement translations or additional media needs with stakeholders.
- Lock UI wireframe (can be low-fidelity sketch) before coding.
- Begin Expo project setup and commit baseline scaffolding.

