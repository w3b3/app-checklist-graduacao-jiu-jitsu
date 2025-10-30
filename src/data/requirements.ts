import { Requirement } from '../types';

export const REQUIREMENTS: Requirement[] = [
  // FAIXA AZUL - Detailed techniques
  // Quedas
  { id: 'azul-quedas-1', belt: 'azul', category: 'Quedas', name: 'Double Leg' },
  { id: 'azul-quedas-2', belt: 'azul', category: 'Quedas', name: 'Single Leg' },

  // Passagem
  { id: 'azul-passagem-1', belt: 'azul', category: 'Passagem', name: 'Passagem guarda fechada' },
  { id: 'azul-passagem-2', belt: 'azul', category: 'Passagem', name: 'Passada de meia guarda com joelho espetado' },
  { id: 'azul-passagem-3', belt: 'azul', category: 'Passagem', name: 'Passagem de meia guarda para montada' },
  { id: 'azul-passagem-4', belt: 'azul', category: 'Passagem', name: 'Passagem de guarda aberta toreador' },

  // Cem Kilos
  { id: 'azul-cemkilos-1', belt: 'azul', category: 'Cem Kilos', name: 'Americana' },
  { id: 'azul-cemkilos-2', belt: 'azul', category: 'Cem Kilos', name: 'Katagatame' },
  { id: 'azul-cemkilos-3', belt: 'azul', category: 'Cem Kilos', name: 'Kimura' },
  { id: 'azul-cemkilos-4', belt: 'azul', category: 'Cem Kilos', name: 'Kimura norte sul' },
  { id: 'azul-cemkilos-5', belt: 'azul', category: 'Cem Kilos', name: 'Arm lock' },

  // Joelho na Barriga
  { id: 'azul-joelho-1', belt: 'azul', category: 'Joelho na Barriga', name: 'Arm lock' },
  { id: 'azul-joelho-2', belt: 'azul', category: 'Joelho na Barriga', name: 'Estrangulamento cruzado' },
  { id: 'azul-joelho-3', belt: 'azul', category: 'Joelho na Barriga', name: 'Estrangulamento cruzado com lapela' },

  // Montada
  { id: 'azul-montada-1', belt: 'azul', category: 'Montada', name: 'Americana' },
  { id: 'azul-montada-2', belt: 'azul', category: 'Montada', name: 'Ezequiel' },
  { id: 'azul-montada-3', belt: 'azul', category: 'Montada', name: 'Arm lock' },
  { id: 'azul-montada-4', belt: 'azul', category: 'Montada', name: 'Estrangulamento Cruzado' },

  // Guarda Fechada
  { id: 'azul-guarda-1', belt: 'azul', category: 'Guarda Fechada', name: 'Arm lock' },
  { id: 'azul-guarda-2', belt: 'azul', category: 'Guarda Fechada', name: 'Omoplata' },
  { id: 'azul-guarda-3', belt: 'azul', category: 'Guarda Fechada', name: 'Triangulo' },
  { id: 'azul-guarda-4', belt: 'azul', category: 'Guarda Fechada', name: 'Kimura' },
  { id: 'azul-guarda-5', belt: 'azul', category: 'Guarda Fechada', name: 'Estrangulamento Cruzado' },

  // Meia Guarda
  { id: 'azul-meia-1', belt: 'azul', category: 'Meia Guarda', name: 'Raspagem com esgrima' },
  { id: 'azul-meia-2', belt: 'azul', category: 'Meia Guarda', name: 'Raspagem esgrima com pegada de costa' },

  // Costas
  { id: 'azul-costas-1', belt: 'azul', category: 'Costas', name: 'Mata-Leão' },
  { id: 'azul-costas-2', belt: 'azul', category: 'Costas', name: 'Estrangulamento Cruzado' },
  { id: 'azul-costas-3', belt: 'azul', category: 'Costas', name: 'Arco e Flexa' },

  // Raspagem
  { id: 'azul-raspagem-1', belt: 'azul', category: 'Raspagem', name: 'Raspagem da guarda fechada pra montada' },
  { id: 'azul-raspagem-2', belt: 'azul', category: 'Raspagem', name: 'Raspagem tesoura' },
  { id: 'azul-raspagem-3', belt: 'azul', category: 'Raspagem', name: 'Raspagem Kimura' },
  { id: 'azul-raspagem-4', belt: 'azul', category: 'Raspagem', name: 'Raspagem de gancho' },

  // Saídas
  { id: 'azul-saidas-1', belt: 'azul', category: 'Saídas', name: 'Saída da Montada' },
  { id: 'azul-saidas-2', belt: 'azul', category: 'Saídas', name: 'Saída dos 100 Kilos' },
  { id: 'azul-saidas-3', belt: 'azul', category: 'Saídas', name: 'Saída das Costas' },
  { id: 'azul-saidas-4', belt: 'azul', category: 'Saídas', name: 'Saída do Triangulo' },
  { id: 'azul-saidas-5', belt: 'azul', category: 'Saídas', name: 'Saída do Arm Lock da guarda fechada' },
  { id: 'azul-saidas-6', belt: 'azul', category: 'Saídas', name: 'Saída do Arm Lock com as costas no chão' },
  { id: 'azul-saidas-7', belt: 'azul', category: 'Saídas', name: 'Reposição de guarda fechada' },

  // Fundamentos
  { id: 'azul-fund-1', belt: 'azul', category: 'Fundamentos', name: 'Amarrar Faixa' },
  { id: 'azul-fund-2', belt: 'azul', category: 'Fundamentos', name: 'Pontuações' },
  { id: 'azul-fund-3', belt: 'azul', category: 'Fundamentos', name: 'Saída de quadril' },
  { id: 'azul-fund-4', belt: 'azul', category: 'Fundamentos', name: 'Rolamento de frente' },
  { id: 'azul-fund-5', belt: 'azul', category: 'Fundamentos', name: 'Rolamento de costas' },
  { id: 'azul-fund-6', belt: 'azul', category: 'Fundamentos', name: 'Sprawl' },
  { id: 'azul-fund-7', belt: 'azul', category: 'Fundamentos', name: 'Chamar na guarda fechada' },
  { id: 'azul-fund-8', belt: 'azul', category: 'Fundamentos', name: 'Chamar na guarda aberta' },
  { id: 'azul-fund-9', belt: 'azul', category: 'Fundamentos', name: 'Chamar na meia guarda' },

  // Ataque de Pé
  { id: 'azul-ataque-1', belt: 'azul', category: 'Ataque de Pé', name: 'Botinha na passagem de guarda' },

  // FAIXA ROXA - Count-based requirements
  { id: 'roxa-baianas', belt: 'roxa', category: 'Baianas', name: '02 Baianas (leve + pesado)', targetCount: 2 },
  { id: 'roxa-quedas', belt: 'roxa', category: 'Quedas', name: '06 Quedas com nomes', targetCount: 6 },
  { id: 'roxa-rasp-joelhos', belt: 'roxa', category: 'Raspagem', name: '02 Raspagem com oponente de joelhos', targetCount: 2 },
  { id: 'roxa-rasp-pe', belt: 'roxa', category: 'Raspagem', name: '02 Raspagem com oponente em pé', targetCount: 2 },
  { id: 'roxa-rasp-meia', belt: 'roxa', category: 'Raspagem', name: '02 Raspagem da meia guarda', targetCount: 2 },
  { id: 'roxa-passagens', belt: 'roxa', category: 'Passagem', name: '04 Passagens de guarda', targetCount: 4 },
  { id: 'roxa-armlocks', belt: 'roxa', category: 'Finalizações', name: '03 Arm Locks em diferentes posições', targetCount: 3 },
  { id: 'roxa-triangulos', belt: 'roxa', category: 'Finalizações', name: '02 Triângulos', targetCount: 2 },
  { id: 'roxa-omoplatas', belt: 'roxa', category: 'Finalizações', name: '02 Omoplatas', targetCount: 2 },
  { id: 'roxa-estrang-guarda', belt: 'roxa', category: 'Finalizações', name: '03 Estrangulamentos na guarda', targetCount: 3 },
  { id: 'roxa-estrang-montada', belt: 'roxa', category: 'Finalizações', name: '03 Estrangulamentos na montada', targetCount: 3 },
  { id: 'roxa-final-100kg', belt: 'roxa', category: 'Finalizações', name: '03 Finalizações no 100kg', targetCount: 3 },
  { id: 'roxa-saidas-montada', belt: 'roxa', category: 'Saídas', name: '02 Saídas da montada', targetCount: 2 },
  { id: 'roxa-saidas-costas', belt: 'roxa', category: 'Saídas', name: '02 Saída de pegada pelas costas', targetCount: 2 },
  { id: 'roxa-costas', belt: 'roxa', category: 'Costas', name: '02 Idas para as costas, sendo 01 berimbolo', targetCount: 2 },

  // FAIXA MARROM - Count-based requirements
  { id: 'marrom-baianas', belt: 'marrom', category: 'Baianas', name: '02 Baianas (leve + pesado)', targetCount: 2 },
  { id: 'marrom-quedas', belt: 'marrom', category: 'Quedas', name: '08 Quedas com nomes', targetCount: 8 },
  { id: 'marrom-rasp-joelhos', belt: 'marrom', category: 'Raspagem', name: '03 Raspagens com oponente de joelhos', targetCount: 3 },
  { id: 'marrom-rasp-pe', belt: 'marrom', category: 'Raspagem', name: '03 Raspagens com oponente em pé', targetCount: 3 },
  { id: 'marrom-rasp-meia', belt: 'marrom', category: 'Raspagem', name: '03 Raspagens da meia guarda', targetCount: 3 },
  { id: 'marrom-rasp-5050', belt: 'marrom', category: 'Raspagem', name: '01 Raspagem da guarda 50/50', targetCount: 1 },
  { id: 'marrom-rasp-lapela', belt: 'marrom', category: 'Raspagem', name: '01 Raspagem da guarda de lapela', targetCount: 1 },
  { id: 'marrom-passagens', belt: 'marrom', category: 'Passagem', name: '07 Passagens de guarda (01 da meia guarda, 01 da guarda 50/50, 01 da guarda de lapela)', targetCount: 7 },
  { id: 'marrom-armlocks', belt: 'marrom', category: 'Finalizações', name: '04 Arm Locks em diferentes posições', targetCount: 4 },
  { id: 'marrom-triangulos', belt: 'marrom', category: 'Finalizações', name: '02 Triângulos', targetCount: 2 },
  { id: 'marrom-omoplatas', belt: 'marrom', category: 'Finalizações', name: '02 Omoplatas', targetCount: 2 },
  { id: 'marrom-final-joelho', belt: 'marrom', category: 'Finalizações', name: '03 Finalizações com joelho na barriga', targetCount: 3 },
  { id: 'marrom-final-costas', belt: 'marrom', category: 'Finalizações', name: '04 Finalizações nas costas', targetCount: 4 },
  { id: 'marrom-final-5050', belt: 'marrom', category: 'Finalizações', name: '01 Finalização da guarda 50/50', targetCount: 1 },
  { id: 'marrom-final-pe', belt: 'marrom', category: 'Finalizações', name: '03 Finalizações no pé', targetCount: 3 },
  { id: 'marrom-leglock', belt: 'marrom', category: 'Finalizações', name: '02 Leg Lock', targetCount: 2 },
  { id: 'marrom-estrang-100kg', belt: 'marrom', category: 'Finalizações', name: '03 Estrangulamentos no 100kg', targetCount: 3 },
  { id: 'marrom-saidas', belt: 'marrom', category: 'Saídas', name: '03 Saídas da montada', targetCount: 3 },
  { id: 'marrom-costas', belt: 'marrom', category: 'Costas', name: '03 Idas para as costas, sendo 01 berimbolo', targetCount: 3 },

  // FAIXA PRETA - Same as Marrom with explanation requirement
  { id: 'preta-baianas', belt: 'preta', category: 'Baianas', name: '02 Baianas (leve + pesado)', targetCount: 2 },
  { id: 'preta-quedas', belt: 'preta', category: 'Quedas', name: '08 Quedas com nomes', targetCount: 8 },
  { id: 'preta-rasp-joelhos', belt: 'preta', category: 'Raspagem', name: '03 Raspagens com oponente de joelhos', targetCount: 3 },
  { id: 'preta-rasp-pe', belt: 'preta', category: 'Raspagem', name: '03 Raspagens com oponente em pé', targetCount: 3 },
  { id: 'preta-rasp-meia', belt: 'preta', category: 'Raspagem', name: '03 Raspagens da meia guarda', targetCount: 3 },
  { id: 'preta-rasp-5050', belt: 'preta', category: 'Raspagem', name: '01 Raspagem da guarda 50/50', targetCount: 1 },
  { id: 'preta-rasp-lapela', belt: 'preta', category: 'Raspagem', name: '01 Raspagem da guarda de lapela', targetCount: 1 },
  { id: 'preta-passagens', belt: 'preta', category: 'Passagem', name: '07 Passagens de guarda (01 da meia guarda, 01 da guarda 50/50, 01 da guarda de lapela)', targetCount: 7 },
  { id: 'preta-armlocks', belt: 'preta', category: 'Finalizações', name: '04 Arm Locks em diferentes posições', targetCount: 4 },
  { id: 'preta-triangulos', belt: 'preta', category: 'Finalizações', name: '02 Triângulos', targetCount: 2 },
  { id: 'preta-omoplatas', belt: 'preta', category: 'Finalizações', name: '02 Omoplatas', targetCount: 2 },
  { id: 'preta-final-joelho', belt: 'preta', category: 'Finalizações', name: '03 Finalizações com joelho na barriga', targetCount: 3 },
  { id: 'preta-final-costas', belt: 'preta', category: 'Finalizações', name: '04 Finalizações nas costas', targetCount: 4 },
  { id: 'preta-final-5050', belt: 'preta', category: 'Finalizações', name: '01 Finalização da guarda 50/50', targetCount: 1 },
  { id: 'preta-final-pe', belt: 'preta', category: 'Finalizações', name: '03 Finalizações no pé', targetCount: 3 },
  { id: 'preta-leglock', belt: 'preta', category: 'Finalizações', name: '02 Leg Lock', targetCount: 2 },
  { id: 'preta-estrang-100kg', belt: 'preta', category: 'Finalizações', name: '03 Estrangulamentos no 100kg', targetCount: 3 },
  { id: 'preta-saidas', belt: 'preta', category: 'Saídas', name: '03 Saídas da montada', targetCount: 3 },
  { id: 'preta-costas', belt: 'preta', category: 'Costas', name: '03 Idas para as costas, sendo 01 berimbolo', targetCount: 3 },
];

// Helper function to get requirements by belt
export function getRequirementsByBelt(beltId: string): Requirement[] {
  return REQUIREMENTS.filter(req => req.belt === beltId);
}

// Helper function to group requirements by category
export function groupRequirementsByCategory(requirements: Requirement[]): Map<string, Requirement[]> {
  const grouped = new Map<string, Requirement[]>();

  requirements.forEach(req => {
    const category = req.category;
    if (!grouped.has(category)) {
      grouped.set(category, []);
    }
    grouped.get(category)!.push(req);
  });

  return grouped;
}
