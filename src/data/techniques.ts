import { Technique } from '../types';

export const TECHNIQUES: Technique[] = [
  // ========================================
  // QUEDAS (Takedowns)
  // ========================================
  {
    id: 'queda-double-leg',
    name: 'Double Leg',
    category: 'Quedas',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-quedas', requirementName: 'Quedas' },
      { belt: 'roxa', requirementId: 'roxa-quedas', requirementName: '06 Quedas com nomes' },
      { belt: 'marrom', requirementId: 'marrom-quedas', requirementName: '08 Quedas com nomes' },
      { belt: 'preta', requirementId: 'preta-quedas', requirementName: '08 Quedas com nomes' }
    ]
  },
  {
    id: 'queda-single-leg',
    name: 'Single Leg',
    category: 'Quedas',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-quedas', requirementName: 'Quedas' },
      { belt: 'roxa', requirementId: 'roxa-quedas', requirementName: '06 Quedas com nomes' },
      { belt: 'marrom', requirementId: 'marrom-quedas', requirementName: '08 Quedas com nomes' },
      { belt: 'preta', requirementId: 'preta-quedas', requirementName: '08 Quedas com nomes' }
    ]
  },
  {
    id: 'queda-osoto-gari',
    name: 'Osoto Gari',
    category: 'Quedas',
    countsToward: [
      { belt: 'roxa', requirementId: 'roxa-quedas', requirementName: '06 Quedas com nomes' },
      { belt: 'marrom', requirementId: 'marrom-quedas', requirementName: '08 Quedas com nomes' },
      { belt: 'preta', requirementId: 'preta-quedas', requirementName: '08 Quedas com nomes' }
    ]
  },
  {
    id: 'queda-seoi-nage',
    name: 'Seoi Nage',
    category: 'Quedas',
    countsToward: [
      { belt: 'roxa', requirementId: 'roxa-quedas', requirementName: '06 Quedas com nomes' },
      { belt: 'marrom', requirementId: 'marrom-quedas', requirementName: '08 Quedas com nomes' },
      { belt: 'preta', requirementId: 'preta-quedas', requirementName: '08 Quedas com nomes' }
    ]
  },
  {
    id: 'queda-uchi-mata',
    name: 'Uchi Mata',
    category: 'Quedas',
    countsToward: [
      { belt: 'roxa', requirementId: 'roxa-quedas', requirementName: '06 Quedas com nomes' },
      { belt: 'marrom', requirementId: 'marrom-quedas', requirementName: '08 Quedas com nomes' },
      { belt: 'preta', requirementId: 'preta-quedas', requirementName: '08 Quedas com nomes' }
    ]
  },
  {
    id: 'queda-kouchi-gari',
    name: 'Kouchi Gari',
    category: 'Quedas',
    countsToward: [
      { belt: 'roxa', requirementId: 'roxa-quedas', requirementName: '06 Quedas com nomes' },
      { belt: 'marrom', requirementId: 'marrom-quedas', requirementName: '08 Quedas com nomes' },
      { belt: 'preta', requirementId: 'preta-quedas', requirementName: '08 Quedas com nomes' }
    ]
  },
  {
    id: 'queda-tomoe-nage',
    name: 'Tomoe Nage',
    category: 'Quedas',
    countsToward: [
      { belt: 'marrom', requirementId: 'marrom-quedas', requirementName: '08 Quedas com nomes' },
      { belt: 'preta', requirementId: 'preta-quedas', requirementName: '08 Quedas com nomes' }
    ]
  },
  {
    id: 'queda-harai-goshi',
    name: 'Harai Goshi',
    category: 'Quedas',
    countsToward: [
      { belt: 'marrom', requirementId: 'marrom-quedas', requirementName: '08 Quedas com nomes' },
      { belt: 'preta', requirementId: 'preta-quedas', requirementName: '08 Quedas com nomes' }
    ]
  },

  // ========================================
  // PASSAGEM DE GUARDA (Guard Passes)
  // ========================================
  {
    id: 'passagem-guarda-fechada',
    name: 'Passagem guarda fechada',
    position: 'Guarda Fechada',
    category: 'Passagem',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-passagem', requirementName: 'Passagem' },
      { belt: 'roxa', requirementId: 'roxa-passagens', requirementName: '04 Passagens de guarda' },
      { belt: 'marrom', requirementId: 'marrom-passagens', requirementName: '07 Passagens de guarda' },
      { belt: 'preta', requirementId: 'preta-passagens', requirementName: '07 Passagens de guarda' }
    ]
  },
  {
    id: 'passagem-meia-joelho',
    name: 'Passada de meia guarda com joelho espetado',
    position: 'Meia Guarda',
    category: 'Passagem',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-passagem', requirementName: 'Passagem' },
      { belt: 'roxa', requirementId: 'roxa-passagens', requirementName: '04 Passagens de guarda' },
      { belt: 'marrom', requirementId: 'marrom-passagens', requirementName: '07 Passagens de guarda' },
      { belt: 'preta', requirementId: 'preta-passagens', requirementName: '07 Passagens de guarda' }
    ]
  },
  {
    id: 'passagem-meia-montada',
    name: 'Passagem de meia guarda para montada',
    position: 'Meia Guarda',
    category: 'Passagem',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-passagem', requirementName: 'Passagem' },
      { belt: 'roxa', requirementId: 'roxa-passagens', requirementName: '04 Passagens de guarda' },
      { belt: 'marrom', requirementId: 'marrom-passagens', requirementName: '07 Passagens de guarda' },
      { belt: 'preta', requirementId: 'preta-passagens', requirementName: '07 Passagens de guarda' }
    ]
  },
  {
    id: 'passagem-aberta-toreador',
    name: 'Passagem de guarda aberta toreador',
    position: 'Guarda Aberta',
    category: 'Passagem',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-passagem', requirementName: 'Passagem' },
      { belt: 'roxa', requirementId: 'roxa-passagens', requirementName: '04 Passagens de guarda' },
      { belt: 'marrom', requirementId: 'marrom-passagens', requirementName: '07 Passagens de guarda' },
      { belt: 'preta', requirementId: 'preta-passagens', requirementName: '07 Passagens de guarda' }
    ]
  },
  {
    id: 'passagem-over-under',
    name: 'Over-Under Pass',
    position: 'Guarda Aberta',
    category: 'Passagem',
    countsToward: [
      { belt: 'marrom', requirementId: 'marrom-passagens', requirementName: '07 Passagens de guarda' },
      { belt: 'preta', requirementId: 'preta-passagens', requirementName: '07 Passagens de guarda' }
    ]
  },
  {
    id: 'passagem-leg-drag',
    name: 'Leg Drag Pass',
    position: 'Guarda Aberta',
    category: 'Passagem',
    countsToward: [
      { belt: 'marrom', requirementId: 'marrom-passagens', requirementName: '07 Passagens de guarda' },
      { belt: 'preta', requirementId: 'preta-passagens', requirementName: '07 Passagens de guarda' }
    ]
  },
  {
    id: 'passagem-5050',
    name: 'Passagem 50/50',
    position: '50/50',
    category: 'Passagem',
    countsToward: [
      { belt: 'marrom', requirementId: 'marrom-passagens', requirementName: '07 Passagens de guarda' },
      { belt: 'preta', requirementId: 'preta-passagens', requirementName: '07 Passagens de guarda' }
    ]
  },

  // ========================================
  // CEM KILOS (100kg / Side Control)
  // ========================================
  {
    id: 'americana-cem-kilos',
    name: 'Americana',
    position: 'Cem Kilos',
    category: 'Cem Kilos',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-cem-kilos', requirementName: 'Cem Kilos' },
      { belt: 'roxa', requirementId: 'roxa-final-100kg', requirementName: '03 Finalizações no 100kg' }
    ]
  },
  {
    id: 'katagatame-cem-kilos',
    name: 'Katagatame',
    position: 'Cem Kilos',
    category: 'Cem Kilos',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-cem-kilos', requirementName: 'Cem Kilos' },
      { belt: 'roxa', requirementId: 'roxa-final-100kg', requirementName: '03 Finalizações no 100kg' },
      { belt: 'marrom', requirementId: 'marrom-estrang-100kg', requirementName: '03 Estrangulamentos no 100kg' },
      { belt: 'preta', requirementId: 'preta-estrang-100kg', requirementName: '03 Estrangulamentos no 100kg' }
    ]
  },
  {
    id: 'kimura-cem-kilos',
    name: 'Kimura',
    position: 'Cem Kilos',
    category: 'Cem Kilos',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-cem-kilos', requirementName: 'Cem Kilos' },
      { belt: 'roxa', requirementId: 'roxa-final-100kg', requirementName: '03 Finalizações no 100kg' }
    ]
  },
  {
    id: 'kimura-norte-sul',
    name: 'Kimura norte sul',
    position: 'Norte Sul',
    category: 'Cem Kilos',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-cem-kilos', requirementName: 'Cem Kilos' },
      { belt: 'roxa', requirementId: 'roxa-final-100kg', requirementName: '03 Finalizações no 100kg' }
    ]
  },
  {
    id: 'armlock-cem-kilos',
    name: 'Arm lock',
    position: 'Cem Kilos',
    category: 'Cem Kilos',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-cem-kilos', requirementName: 'Cem Kilos' },
      { belt: 'roxa', requirementId: 'roxa-armlocks', requirementName: '03 Arm Locks em diferentes posições' },
      { belt: 'roxa', requirementId: 'roxa-final-100kg', requirementName: '03 Finalizações no 100kg' },
      { belt: 'marrom', requirementId: 'marrom-armlocks', requirementName: '04 Arm Locks em diferentes posições' },
      { belt: 'preta', requirementId: 'preta-armlocks', requirementName: '04 Arm Locks em diferentes posições' }
    ]
  },
  {
    id: 'estrang-lapel-cem-kilos',
    name: 'Estrangulamento de Lapela',
    position: 'Cem Kilos',
    category: 'Cem Kilos',
    countsToward: [
      { belt: 'marrom', requirementId: 'marrom-estrang-100kg', requirementName: '03 Estrangulamentos no 100kg' },
      { belt: 'preta', requirementId: 'preta-estrang-100kg', requirementName: '03 Estrangulamentos no 100kg' }
    ]
  },
  {
    id: 'estrang-paper-cutter',
    name: 'Paper Cutter Choke',
    position: 'Cem Kilos',
    category: 'Cem Kilos',
    countsToward: [
      { belt: 'marrom', requirementId: 'marrom-estrang-100kg', requirementName: '03 Estrangulamentos no 100kg' },
      { belt: 'preta', requirementId: 'preta-estrang-100kg', requirementName: '03 Estrangulamentos no 100kg' }
    ]
  },

  // ========================================
  // JOELHO NA BARRIGA (Knee on Belly)
  // ========================================
  {
    id: 'armlock-joelho-barriga',
    name: 'Arm lock',
    position: 'Joelho na Barriga',
    category: 'Joelho na Barriga',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-joelho-barriga', requirementName: 'Joelho na Barriga' },
      { belt: 'roxa', requirementId: 'roxa-armlocks', requirementName: '03 Arm Locks em diferentes posições' },
      { belt: 'marrom', requirementId: 'marrom-armlocks', requirementName: '04 Arm Locks em diferentes posições' },
      { belt: 'marrom', requirementId: 'marrom-final-joelho', requirementName: '03 Finalizações com joelho na barriga' },
      { belt: 'preta', requirementId: 'preta-armlocks', requirementName: '04 Arm Locks em diferentes posições' },
      { belt: 'preta', requirementId: 'preta-final-joelho', requirementName: '03 Finalizações com joelho na barriga' }
    ]
  },
  {
    id: 'estrang-cruzado-joelho',
    name: 'Estrangulamento cruzado',
    position: 'Joelho na Barriga',
    category: 'Joelho na Barriga',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-joelho-barriga', requirementName: 'Joelho na Barriga' },
      { belt: 'marrom', requirementId: 'marrom-final-joelho', requirementName: '03 Finalizações com joelho na barriga' },
      { belt: 'preta', requirementId: 'preta-final-joelho', requirementName: '03 Finalizações com joelho na barriga' }
    ]
  },
  {
    id: 'estrang-cruzado-joelho-lapela',
    name: 'Estrangulamento cruzado com lapela',
    position: 'Joelho na Barriga',
    category: 'Joelho na Barriga',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-joelho-barriga', requirementName: 'Joelho na Barriga' },
      { belt: 'marrom', requirementId: 'marrom-final-joelho', requirementName: '03 Finalizações com joelho na barriga' },
      { belt: 'preta', requirementId: 'preta-final-joelho', requirementName: '03 Finalizações com joelho na barriga' }
    ]
  },

  // ========================================
  // MONTADA (Mount)
  // ========================================
  {
    id: 'americana-montada',
    name: 'Americana',
    position: 'Montada',
    category: 'Montada',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-montada', requirementName: 'Montada' }
    ]
  },
  {
    id: 'ezequiel-montada',
    name: 'Ezequiel',
    position: 'Montada',
    category: 'Montada',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-montada', requirementName: 'Montada' },
      { belt: 'roxa', requirementId: 'roxa-estrang-montada', requirementName: '03 Estrangulamentos na montada' }
    ]
  },
  {
    id: 'armlock-montada',
    name: 'Arm lock',
    position: 'Montada',
    category: 'Montada',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-montada', requirementName: 'Montada' },
      { belt: 'roxa', requirementId: 'roxa-armlocks', requirementName: '03 Arm Locks em diferentes posições' },
      { belt: 'marrom', requirementId: 'marrom-armlocks', requirementName: '04 Arm Locks em diferentes posições' },
      { belt: 'preta', requirementId: 'preta-armlocks', requirementName: '04 Arm Locks em diferentes posições' }
    ]
  },
  {
    id: 'estrang-cruzado-montada',
    name: 'Estrangulamento Cruzado',
    position: 'Montada',
    category: 'Montada',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-montada', requirementName: 'Montada' },
      { belt: 'roxa', requirementId: 'roxa-estrang-montada', requirementName: '03 Estrangulamentos na montada' }
    ]
  },
  {
    id: 'triangulo-montada',
    name: 'Triangulo',
    position: 'Montada',
    category: 'Montada',
    countsToward: [
      { belt: 'roxa', requirementId: 'roxa-triangulos', requirementName: '02 Triângulos' },
      { belt: 'marrom', requirementId: 'marrom-triangulos', requirementName: '02 Triângulos' },
      { belt: 'preta', requirementId: 'preta-triangulos', requirementName: '02 Triângulos' }
    ]
  },
  {
    id: 'estrang-smother-montada',
    name: 'Abafamento (S-mount)',
    position: 'Montada',
    category: 'Montada',
    countsToward: [
      { belt: 'roxa', requirementId: 'roxa-estrang-montada', requirementName: '03 Estrangulamentos na montada' }
    ]
  },

  // ========================================
  // GUARDA FECHADA (Closed Guard)
  // ========================================
  {
    id: 'armlock-guarda-fechada',
    name: 'Arm lock',
    position: 'Guarda Fechada',
    category: 'Guarda Fechada',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-guarda-fechada', requirementName: 'Guarda Fechada' },
      { belt: 'roxa', requirementId: 'roxa-armlocks', requirementName: '03 Arm Locks em diferentes posições' },
      { belt: 'marrom', requirementId: 'marrom-armlocks', requirementName: '04 Arm Locks em diferentes posições' },
      { belt: 'preta', requirementId: 'preta-armlocks', requirementName: '04 Arm Locks em diferentes posições' }
    ]
  },
  {
    id: 'omoplata-guarda-fechada',
    name: 'Omoplata',
    position: 'Guarda Fechada',
    category: 'Guarda Fechada',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-guarda-fechada', requirementName: 'Guarda Fechada' },
      { belt: 'roxa', requirementId: 'roxa-omoplatas', requirementName: '02 Omoplatas' },
      { belt: 'marrom', requirementId: 'marrom-omoplatas', requirementName: '02 Omoplatas' },
      { belt: 'preta', requirementId: 'preta-omoplatas', requirementName: '02 Omoplatas' }
    ]
  },
  {
    id: 'triangulo-guarda-fechada',
    name: 'Triangulo',
    position: 'Guarda Fechada',
    category: 'Guarda Fechada',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-guarda-fechada', requirementName: 'Guarda Fechada' },
      { belt: 'roxa', requirementId: 'roxa-triangulos', requirementName: '02 Triângulos' },
      { belt: 'marrom', requirementId: 'marrom-triangulos', requirementName: '02 Triângulos' },
      { belt: 'preta', requirementId: 'preta-triangulos', requirementName: '02 Triângulos' }
    ]
  },
  {
    id: 'kimura-guarda-fechada',
    name: 'Kimura',
    position: 'Guarda Fechada',
    category: 'Guarda Fechada',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-guarda-fechada', requirementName: 'Guarda Fechada' }
    ]
  },
  {
    id: 'estrang-cruzado-guarda-fechada',
    name: 'Estrangulamento Cruzado',
    position: 'Guarda Fechada',
    category: 'Guarda Fechada',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-guarda-fechada', requirementName: 'Guarda Fechada' },
      { belt: 'roxa', requirementId: 'roxa-estrang-guarda', requirementName: '03 Estrangulamentos na guarda' }
    ]
  },
  {
    id: 'omoplata-meia-guarda',
    name: 'Omoplata',
    position: 'Meia Guarda',
    category: 'Guarda Fechada',
    countsToward: [
      { belt: 'roxa', requirementId: 'roxa-omoplatas', requirementName: '02 Omoplatas' },
      { belt: 'marrom', requirementId: 'marrom-omoplatas', requirementName: '02 Omoplatas' },
      { belt: 'preta', requirementId: 'preta-omoplatas', requirementName: '02 Omoplatas' }
    ]
  },
  {
    id: 'estrang-guillotine-guarda',
    name: 'Guilhotina',
    position: 'Guarda',
    category: 'Guarda Fechada',
    countsToward: [
      { belt: 'roxa', requirementId: 'roxa-estrang-guarda', requirementName: '03 Estrangulamentos na guarda' }
    ]
  },
  {
    id: 'estrang-loop-choke',
    name: 'Loop Choke',
    position: 'Guarda Fechada',
    category: 'Guarda Fechada',
    countsToward: [
      { belt: 'roxa', requirementId: 'roxa-estrang-guarda', requirementName: '03 Estrangulamentos na guarda' }
    ]
  },

  // ========================================
  // MEIA GUARDA (Half Guard)
  // ========================================
  {
    id: 'raspagem-meia-esgrima',
    name: 'Raspagem com esgrima',
    position: 'Meia Guarda',
    category: 'Meia Guarda',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-meia-guarda', requirementName: 'Meia Guarda' },
      { belt: 'roxa', requirementId: 'roxa-rasp-meia', requirementName: '02 Raspagem da meia guarda' },
      { belt: 'marrom', requirementId: 'marrom-rasp-meia', requirementName: '03 Raspagens da meia guarda' },
      { belt: 'preta', requirementId: 'preta-rasp-meia', requirementName: '03 Raspagens da meia guarda' }
    ]
  },
  {
    id: 'raspagem-meia-esgrima-costa',
    name: 'Raspagem esgrima com pegada de costa',
    position: 'Meia Guarda',
    category: 'Meia Guarda',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-meia-guarda', requirementName: 'Meia Guarda' },
      { belt: 'roxa', requirementId: 'roxa-rasp-meia', requirementName: '02 Raspagem da meia guarda' },
      { belt: 'marrom', requirementId: 'marrom-rasp-meia', requirementName: '03 Raspagens da meia guarda' },
      { belt: 'preta', requirementId: 'preta-rasp-meia', requirementName: '03 Raspagens da meia guarda' }
    ]
  },
  {
    id: 'raspagem-deep-half',
    name: 'Deep Half Sweep',
    position: 'Meia Guarda',
    category: 'Meia Guarda',
    countsToward: [
      { belt: 'marrom', requirementId: 'marrom-rasp-meia', requirementName: '03 Raspagens da meia guarda' },
      { belt: 'preta', requirementId: 'preta-rasp-meia', requirementName: '03 Raspagens da meia guarda' }
    ]
  },

  // ========================================
  // COSTAS (Back)
  // ========================================
  {
    id: 'mata-leao-costas',
    name: 'Mata-Leão',
    position: 'Costas',
    category: 'Costas',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-costas', requirementName: 'Costas' },
      { belt: 'marrom', requirementId: 'marrom-final-costas', requirementName: '04 Finalizações nas costas' },
      { belt: 'preta', requirementId: 'preta-final-costas', requirementName: '04 Finalizações nas costas' }
    ]
  },
  {
    id: 'estrang-cruzado-costas',
    name: 'Estrangulamento Cruzado',
    position: 'Costas',
    category: 'Costas',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-costas', requirementName: 'Costas' },
      { belt: 'marrom', requirementId: 'marrom-final-costas', requirementName: '04 Finalizações nas costas' },
      { belt: 'preta', requirementId: 'preta-final-costas', requirementName: '04 Finalizações nas costas' }
    ]
  },
  {
    id: 'arco-flexa-costas',
    name: 'Arco e Flexa',
    position: 'Costas',
    category: 'Costas',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-costas', requirementName: 'Costas' },
      { belt: 'marrom', requirementId: 'marrom-final-costas', requirementName: '04 Finalizações nas costas' },
      { belt: 'preta', requirementId: 'preta-final-costas', requirementName: '04 Finalizações nas costas' }
    ]
  },
  {
    id: 'estrang-short-choke',
    name: 'Short Choke',
    position: 'Costas',
    category: 'Costas',
    countsToward: [
      { belt: 'marrom', requirementId: 'marrom-final-costas', requirementName: '04 Finalizações nas costas' },
      { belt: 'preta', requirementId: 'preta-final-costas', requirementName: '04 Finalizações nas costas' }
    ]
  },
  {
    id: 'costas-berimbolo',
    name: 'Berimbolo',
    position: 'Costas',
    category: 'Costas',
    countsToward: [
      { belt: 'roxa', requirementId: 'roxa-costas', requirementName: '02 Idas para as costas, sendo 01 berimbolo' },
      { belt: 'marrom', requirementId: 'marrom-costas', requirementName: '03 Idas para as costas, sendo 01 berimbolo' },
      { belt: 'preta', requirementId: 'preta-costas', requirementName: '03 Idas para as costas, sendo 01 berimbolo' }
    ]
  },
  {
    id: 'costas-turtle-attack',
    name: 'Ida para costas (turtle)',
    position: 'Costas',
    category: 'Costas',
    countsToward: [
      { belt: 'roxa', requirementId: 'roxa-costas', requirementName: '02 Idas para as costas, sendo 01 berimbolo' },
      { belt: 'marrom', requirementId: 'marrom-costas', requirementName: '03 Idas para as costas, sendo 01 berimbolo' },
      { belt: 'preta', requirementId: 'preta-costas', requirementName: '03 Idas para as costas, sendo 01 berimbolo' }
    ]
  },
  {
    id: 'costas-mount-transition',
    name: 'Montada para costas',
    position: 'Costas',
    category: 'Costas',
    countsToward: [
      { belt: 'marrom', requirementId: 'marrom-costas', requirementName: '03 Idas para as costas, sendo 01 berimbolo' },
      { belt: 'preta', requirementId: 'preta-costas', requirementName: '03 Idas para as costas, sendo 01 berimbolo' }
    ]
  },

  // ========================================
  // RASPAGEM (Sweeps)
  // ========================================
  {
    id: 'raspagem-guarda-fechada-montada',
    name: 'Raspagem da guarda fechada pra montada',
    position: 'Guarda Fechada',
    category: 'Raspagem',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-raspagem', requirementName: 'Raspagem' },
      { belt: 'roxa', requirementId: 'roxa-rasp-pe', requirementName: '02 Raspagem com oponente em pé' },
      { belt: 'marrom', requirementId: 'marrom-rasp-pe', requirementName: '03 Raspagens com oponente em pé' },
      { belt: 'preta', requirementId: 'preta-rasp-pe', requirementName: '03 Raspagens com oponente em pé' }
    ]
  },
  {
    id: 'raspagem-tesoura',
    name: 'Raspagem tesoura',
    category: 'Raspagem',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-raspagem', requirementName: 'Raspagem' },
      { belt: 'roxa', requirementId: 'roxa-rasp-joelhos', requirementName: '02 Raspagem com oponente de joelhos' },
      { belt: 'marrom', requirementId: 'marrom-rasp-joelhos', requirementName: '03 Raspagens com oponente de joelhos' },
      { belt: 'preta', requirementId: 'preta-rasp-joelhos', requirementName: '03 Raspagens com oponente de joelhos' }
    ]
  },
  {
    id: 'raspagem-kimura',
    name: 'Raspagem Kimura',
    category: 'Raspagem',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-raspagem', requirementName: 'Raspagem' },
      { belt: 'roxa', requirementId: 'roxa-rasp-joelhos', requirementName: '02 Raspagem com oponente de joelhos' },
      { belt: 'marrom', requirementId: 'marrom-rasp-joelhos', requirementName: '03 Raspagens com oponente de joelhos' },
      { belt: 'preta', requirementId: 'preta-rasp-joelhos', requirementName: '03 Raspagens com oponente de joelhos' }
    ]
  },
  {
    id: 'raspagem-gancho',
    name: 'Raspagem de gancho',
    category: 'Raspagem',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-raspagem', requirementName: 'Raspagem' },
      { belt: 'roxa', requirementId: 'roxa-rasp-pe', requirementName: '02 Raspagem com oponente em pé' },
      { belt: 'marrom', requirementId: 'marrom-rasp-pe', requirementName: '03 Raspagens com oponente em pé' },
      { belt: 'preta', requirementId: 'preta-rasp-pe', requirementName: '03 Raspagens com oponente em pé' }
    ]
  },
  {
    id: 'raspagem-flower',
    name: 'Flower Sweep',
    category: 'Raspagem',
    countsToward: [
      { belt: 'marrom', requirementId: 'marrom-rasp-joelhos', requirementName: '03 Raspagens com oponente de joelhos' },
      { belt: 'preta', requirementId: 'preta-rasp-joelhos', requirementName: '03 Raspagens com oponente de joelhos' }
    ]
  },
  {
    id: 'raspagem-butterfly',
    name: 'Butterfly Sweep',
    category: 'Raspagem',
    countsToward: [
      { belt: 'marrom', requirementId: 'marrom-rasp-pe', requirementName: '03 Raspagens com oponente em pé' },
      { belt: 'preta', requirementId: 'preta-rasp-pe', requirementName: '03 Raspagens com oponente em pé' }
    ]
  },
  {
    id: 'raspagem-5050',
    name: 'Raspagem 50/50',
    position: '50/50',
    category: 'Raspagem',
    countsToward: [
      { belt: 'marrom', requirementId: 'marrom-rasp-5050', requirementName: '01 Raspagem da guarda 50/50' },
      { belt: 'preta', requirementId: 'preta-rasp-5050', requirementName: '01 Raspagem da guarda 50/50' }
    ]
  },
  {
    id: 'raspagem-lapela',
    name: 'Raspagem Lapela',
    position: 'Guarda de Lapela',
    category: 'Raspagem',
    countsToward: [
      { belt: 'marrom', requirementId: 'marrom-rasp-lapela', requirementName: '01 Raspagem da guarda de lapela' },
      { belt: 'preta', requirementId: 'preta-rasp-lapela', requirementName: '01 Raspagem da guarda de lapela' }
    ]
  },

  // ========================================
  // SAÍDAS (Escapes)
  // ========================================
  {
    id: 'saida-montada-upa',
    name: 'Saída da Montada (Upa)',
    category: 'Saídas',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-saidas', requirementName: 'Saídas' },
      { belt: 'roxa', requirementId: 'roxa-saidas-montada', requirementName: '02 Saídas da montada' },
      { belt: 'marrom', requirementId: 'marrom-saidas', requirementName: '03 Saídas da montada' },
      { belt: 'preta', requirementId: 'preta-saidas', requirementName: '03 Saídas da montada' }
    ]
  },
  {
    id: 'saida-100-kilos',
    name: 'Saída dos 100 Kilos',
    category: 'Saídas',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-saidas', requirementName: 'Saídas' }
    ]
  },
  {
    id: 'saida-costas',
    name: 'Saída das Costas',
    category: 'Saídas',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-saidas', requirementName: 'Saídas' },
      { belt: 'roxa', requirementId: 'roxa-saidas-costas', requirementName: '02 Saída de pegada pelas costas' }
    ]
  },
  {
    id: 'saida-triangulo',
    name: 'Saída do Triangulo',
    category: 'Saídas',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-saidas', requirementName: 'Saídas' }
    ]
  },
  {
    id: 'saida-armlock-guarda',
    name: 'Saída do Arm Lock da guarda fechada',
    category: 'Saídas',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-saidas', requirementName: 'Saídas' }
    ]
  },
  {
    id: 'saida-armlock-costas',
    name: 'Saída do Arm Lock com as costas no chão',
    category: 'Saídas',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-saidas', requirementName: 'Saídas' }
    ]
  },
  {
    id: 'reposicao-guarda-fechada',
    name: 'Reposição de guarda fechada',
    category: 'Saídas',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-saidas', requirementName: 'Saídas' }
    ]
  },
  {
    id: 'saida-montada-elbow',
    name: 'Elbow Escape',
    category: 'Saídas',
    countsToward: [
      { belt: 'roxa', requirementId: 'roxa-saidas-montada', requirementName: '02 Saídas da montada' },
      { belt: 'marrom', requirementId: 'marrom-saidas', requirementName: '03 Saídas da montada' },
      { belt: 'preta', requirementId: 'preta-saidas', requirementName: '03 Saídas da montada' }
    ]
  },
  {
    id: 'saida-montada-shrimp',
    name: 'Shrimp to Half Guard',
    category: 'Saídas',
    countsToward: [
      { belt: 'marrom', requirementId: 'marrom-saidas', requirementName: '03 Saídas da montada' },
      { belt: 'preta', requirementId: 'preta-saidas', requirementName: '03 Saídas da montada' }
    ]
  },
  {
    id: 'saida-costas-roll',
    name: 'Back Escape (rolling)',
    category: 'Saídas',
    countsToward: [
      { belt: 'roxa', requirementId: 'roxa-saidas-costas', requirementName: '02 Saída de pegada pelas costas' }
    ]
  },

  // ========================================
  // FUNDAMENTOS (Fundamentals - Blue Belt Only)
  // ========================================
  {
    id: 'fund-amarrar-faixa',
    name: 'Amarrar Faixa',
    category: 'Fundamentos',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-fundamentos', requirementName: 'Fundamentos' }
    ]
  },
  {
    id: 'fund-pontuacoes',
    name: 'Pontuações',
    category: 'Fundamentos',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-fundamentos', requirementName: 'Fundamentos' }
    ]
  },
  {
    id: 'fund-saida-quadril',
    name: 'Saída de quadril',
    category: 'Fundamentos',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-fundamentos', requirementName: 'Fundamentos' }
    ]
  },
  {
    id: 'fund-rolamento-frente',
    name: 'Rolamento de frente',
    category: 'Fundamentos',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-fundamentos', requirementName: 'Fundamentos' }
    ]
  },
  {
    id: 'fund-rolamento-costas',
    name: 'Rolamento de costas',
    category: 'Fundamentos',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-fundamentos', requirementName: 'Fundamentos' }
    ]
  },
  {
    id: 'fund-sprawl',
    name: 'Sprawl',
    category: 'Fundamentos',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-fundamentos', requirementName: 'Fundamentos' }
    ]
  },
  {
    id: 'fund-chamar-guarda-fechada',
    name: 'Chamar na guarda fechada',
    category: 'Fundamentos',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-fundamentos', requirementName: 'Fundamentos' }
    ]
  },
  {
    id: 'fund-chamar-guarda-aberta',
    name: 'Chamar na guarda aberta',
    category: 'Fundamentos',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-fundamentos', requirementName: 'Fundamentos' }
    ]
  },
  {
    id: 'fund-chamar-meia-guarda',
    name: 'Chamar na meia guarda',
    category: 'Fundamentos',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-fundamentos', requirementName: 'Fundamentos' }
    ]
  },

  // ========================================
  // ATAQUE DE PÉ (Standing Attacks)
  // ========================================
  {
    id: 'ataque-botinha-passagem',
    name: 'Botinha na passagem de guarda',
    category: 'Ataque de Pé',
    countsToward: [
      { belt: 'azul', requirementId: 'azul-ataque-pe', requirementName: 'Ataque de Pé' },
      { belt: 'marrom', requirementId: 'marrom-final-pe', requirementName: '03 Finalizações no pé' },
      { belt: 'preta', requirementId: 'preta-final-pe', requirementName: '03 Finalizações no pé' }
    ]
  },
  {
    id: 'ataque-guillotine-pe',
    name: 'Guilhotina em pé',
    category: 'Ataque de Pé',
    countsToward: [
      { belt: 'marrom', requirementId: 'marrom-final-pe', requirementName: '03 Finalizações no pé' },
      { belt: 'preta', requirementId: 'preta-final-pe', requirementName: '03 Finalizações no pé' }
    ]
  },
  {
    id: 'ataque-kimura-pe',
    name: 'Kimura em pé',
    category: 'Ataque de Pé',
    countsToward: [
      { belt: 'marrom', requirementId: 'marrom-final-pe', requirementName: '03 Finalizações no pé' },
      { belt: 'preta', requirementId: 'preta-final-pe', requirementName: '03 Finalizações no pé' }
    ]
  },

  // ========================================
  // BAIANAS (Purple+ only)
  // ========================================
  {
    id: 'baiana-leve',
    name: 'Baiana (leve)',
    category: 'Baianas',
    countsToward: [
      { belt: 'roxa', requirementId: 'roxa-baianas', requirementName: '02 Baianas (leve + pesado)' },
      { belt: 'marrom', requirementId: 'marrom-baianas', requirementName: '02 Baianas (leve + pesado)' },
      { belt: 'preta', requirementId: 'preta-baianas', requirementName: '02 Baianas (leve + pesado)' }
    ]
  },
  {
    id: 'baiana-pesado',
    name: 'Baiana (pesado)',
    category: 'Baianas',
    countsToward: [
      { belt: 'roxa', requirementId: 'roxa-baianas', requirementName: '02 Baianas (leve + pesado)' },
      { belt: 'marrom', requirementId: 'marrom-baianas', requirementName: '02 Baianas (leve + pesado)' },
      { belt: 'preta', requirementId: 'preta-baianas', requirementName: '02 Baianas (leve + pesado)' }
    ]
  },

  // ========================================
  // LEG LOCKS (Brown/Black only)
  // ========================================
  {
    id: 'leglock-straight-ankle',
    name: 'Straight Ankle Lock',
    category: 'Finalizações',
    countsToward: [
      { belt: 'marrom', requirementId: 'marrom-leglock', requirementName: '02 Leg Lock' },
      { belt: 'preta', requirementId: 'preta-leglock', requirementName: '02 Leg Lock' }
    ]
  },
  {
    id: 'leglock-kneebar',
    name: 'Kneebar',
    category: 'Finalizações',
    countsToward: [
      { belt: 'marrom', requirementId: 'marrom-leglock', requirementName: '02 Leg Lock' },
      { belt: 'preta', requirementId: 'preta-leglock', requirementName: '02 Leg Lock' }
    ]
  },

  // ========================================
  // 50/50 GUARD
  // ========================================
  {
    id: 'final-5050-footlock',
    name: 'Finalização 50/50',
    position: '50/50',
    category: 'Finalizações',
    countsToward: [
      { belt: 'marrom', requirementId: 'marrom-final-5050', requirementName: '01 Finalização da guarda 50/50' },
      { belt: 'preta', requirementId: 'preta-final-5050', requirementName: '01 Finalização da guarda 50/50' }
    ]
  }
];

// Helper function to get techniques for a specific belt
export function getTechniquesForBelt(beltId: string): Technique[] {
  return TECHNIQUES.filter(tech =>
    tech.countsToward.some(ct => ct.belt === beltId)
  );
}

// Helper function to get techniques by category for a belt
export function getTechniquesByCategory(beltId: string): Map<string, Technique[]> {
  const techniques = getTechniquesForBelt(beltId);
  const grouped = new Map<string, Technique[]>();

  techniques.forEach(tech => {
    const category = tech.category;
    if (!grouped.has(category)) {
      grouped.set(category, []);
    }
    grouped.get(category)!.push(tech);
  });

  return grouped;
}
