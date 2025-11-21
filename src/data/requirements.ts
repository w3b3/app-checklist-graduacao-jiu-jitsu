import { Requirement, BeltId, TechniqueType } from '../types';

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

  // FAIXA ROXA - Individual requirements (split from count-based)
  // Baianas
  { id: 'roxa-baianas-1', belt: 'roxa', category: 'Baianas', name: 'Baiana leve' },
  { id: 'roxa-baianas-2', belt: 'roxa', category: 'Baianas', name: 'Baiana pesado' },

  // Quedas
  { id: 'roxa-quedas-1', belt: 'roxa', category: 'Quedas', name: 'Queda 1' },
  { id: 'roxa-quedas-2', belt: 'roxa', category: 'Quedas', name: 'Queda 2' },
  { id: 'roxa-quedas-3', belt: 'roxa', category: 'Quedas', name: 'Queda 3' },
  { id: 'roxa-quedas-4', belt: 'roxa', category: 'Quedas', name: 'Queda 4' },
  { id: 'roxa-quedas-5', belt: 'roxa', category: 'Quedas', name: 'Queda 5' },
  { id: 'roxa-quedas-6', belt: 'roxa', category: 'Quedas', name: 'Queda 6' },

  // Raspagem
  { id: 'roxa-rasp-joelhos-1', belt: 'roxa', category: 'Raspagem', name: 'Raspagem com oponente de joelhos 1' },
  { id: 'roxa-rasp-joelhos-2', belt: 'roxa', category: 'Raspagem', name: 'Raspagem com oponente de joelhos 2' },
  { id: 'roxa-rasp-pe-1', belt: 'roxa', category: 'Raspagem', name: 'Raspagem com oponente em pé 1' },
  { id: 'roxa-rasp-pe-2', belt: 'roxa', category: 'Raspagem', name: 'Raspagem com oponente em pé 2' },
  { id: 'roxa-rasp-meia-1', belt: 'roxa', category: 'Raspagem', name: 'Raspagem da meia guarda 1' },
  { id: 'roxa-rasp-meia-2', belt: 'roxa', category: 'Raspagem', name: 'Raspagem da meia guarda 2' },

  // Passagem
  { id: 'roxa-passagens-1', belt: 'roxa', category: 'Passagem', name: 'Passagem de guarda 1' },
  { id: 'roxa-passagens-2', belt: 'roxa', category: 'Passagem', name: 'Passagem de guarda 2' },
  { id: 'roxa-passagens-3', belt: 'roxa', category: 'Passagem', name: 'Passagem de guarda 3' },
  { id: 'roxa-passagens-4', belt: 'roxa', category: 'Passagem', name: 'Passagem de guarda 4' },

  // Finalizações
  { id: 'roxa-armlocks-1', belt: 'roxa', category: 'Finalizações', name: 'Arm Lock 1' },
  { id: 'roxa-armlocks-2', belt: 'roxa', category: 'Finalizações', name: 'Arm Lock 2' },
  { id: 'roxa-armlocks-3', belt: 'roxa', category: 'Finalizações', name: 'Arm Lock 3' },
  { id: 'roxa-triangulos-1', belt: 'roxa', category: 'Finalizações', name: 'Triângulo 1' },
  { id: 'roxa-triangulos-2', belt: 'roxa', category: 'Finalizações', name: 'Triângulo 2' },
  { id: 'roxa-omoplatas-1', belt: 'roxa', category: 'Finalizações', name: 'Omoplata 1' },
  { id: 'roxa-omoplatas-2', belt: 'roxa', category: 'Finalizações', name: 'Omoplata 2' },
  { id: 'roxa-estrang-guarda-1', belt: 'roxa', category: 'Finalizações', name: 'Estrangulamento na guarda 1' },
  { id: 'roxa-estrang-guarda-2', belt: 'roxa', category: 'Finalizações', name: 'Estrangulamento na guarda 2' },
  { id: 'roxa-estrang-guarda-3', belt: 'roxa', category: 'Finalizações', name: 'Estrangulamento na guarda 3' },
  { id: 'roxa-estrang-montada-1', belt: 'roxa', category: 'Finalizações', name: 'Estrangulamento na montada 1' },
  { id: 'roxa-estrang-montada-2', belt: 'roxa', category: 'Finalizações', name: 'Estrangulamento na montada 2' },
  { id: 'roxa-estrang-montada-3', belt: 'roxa', category: 'Finalizações', name: 'Estrangulamento na montada 3' },
  { id: 'roxa-final-100kg-1', belt: 'roxa', category: 'Finalizações', name: 'Finalização no 100kg 1' },
  { id: 'roxa-final-100kg-2', belt: 'roxa', category: 'Finalizações', name: 'Finalização no 100kg 2' },
  { id: 'roxa-final-100kg-3', belt: 'roxa', category: 'Finalizações', name: 'Finalização no 100kg 3' },

  // Saídas
  { id: 'roxa-saidas-montada-1', belt: 'roxa', category: 'Saídas', name: 'Saída da montada 1' },
  { id: 'roxa-saidas-montada-2', belt: 'roxa', category: 'Saídas', name: 'Saída da montada 2' },
  { id: 'roxa-saidas-costas-1', belt: 'roxa', category: 'Saídas', name: 'Saída de pegada pelas costas 1' },
  { id: 'roxa-saidas-costas-2', belt: 'roxa', category: 'Saídas', name: 'Saída de pegada pelas costas 2' },

  // Costas
  { id: 'roxa-costas-1', belt: 'roxa', category: 'Costas', name: 'Ida para as costas - Berimbolo' },
  { id: 'roxa-costas-2', belt: 'roxa', category: 'Costas', name: 'Ida para as costas 2' },

  // FAIXA MARROM - Individual requirements (split from count-based)
  // Baianas
  { id: 'marrom-baianas-1', belt: 'marrom', category: 'Baianas', name: 'Baiana leve' },
  { id: 'marrom-baianas-2', belt: 'marrom', category: 'Baianas', name: 'Baiana pesado' },

  // Quedas
  { id: 'marrom-quedas-1', belt: 'marrom', category: 'Quedas', name: 'Queda 1' },
  { id: 'marrom-quedas-2', belt: 'marrom', category: 'Quedas', name: 'Queda 2' },
  { id: 'marrom-quedas-3', belt: 'marrom', category: 'Quedas', name: 'Queda 3' },
  { id: 'marrom-quedas-4', belt: 'marrom', category: 'Quedas', name: 'Queda 4' },
  { id: 'marrom-quedas-5', belt: 'marrom', category: 'Quedas', name: 'Queda 5' },
  { id: 'marrom-quedas-6', belt: 'marrom', category: 'Quedas', name: 'Queda 6' },
  { id: 'marrom-quedas-7', belt: 'marrom', category: 'Quedas', name: 'Queda 7' },
  { id: 'marrom-quedas-8', belt: 'marrom', category: 'Quedas', name: 'Queda 8' },

  // Raspagem
  { id: 'marrom-rasp-joelhos-1', belt: 'marrom', category: 'Raspagem', name: 'Raspagem com oponente de joelhos 1' },
  { id: 'marrom-rasp-joelhos-2', belt: 'marrom', category: 'Raspagem', name: 'Raspagem com oponente de joelhos 2' },
  { id: 'marrom-rasp-joelhos-3', belt: 'marrom', category: 'Raspagem', name: 'Raspagem com oponente de joelhos 3' },
  { id: 'marrom-rasp-pe-1', belt: 'marrom', category: 'Raspagem', name: 'Raspagem com oponente em pé 1' },
  { id: 'marrom-rasp-pe-2', belt: 'marrom', category: 'Raspagem', name: 'Raspagem com oponente em pé 2' },
  { id: 'marrom-rasp-pe-3', belt: 'marrom', category: 'Raspagem', name: 'Raspagem com oponente em pé 3' },
  { id: 'marrom-rasp-meia-1', belt: 'marrom', category: 'Raspagem', name: 'Raspagem da meia guarda 1' },
  { id: 'marrom-rasp-meia-2', belt: 'marrom', category: 'Raspagem', name: 'Raspagem da meia guarda 2' },
  { id: 'marrom-rasp-meia-3', belt: 'marrom', category: 'Raspagem', name: 'Raspagem da meia guarda 3' },
  { id: 'marrom-rasp-5050', belt: 'marrom', category: 'Raspagem', name: 'Raspagem da guarda 50/50' },
  { id: 'marrom-rasp-lapela', belt: 'marrom', category: 'Raspagem', name: 'Raspagem da guarda de lapela' },

  // Passagem
  { id: 'marrom-passagens-1', belt: 'marrom', category: 'Passagem', name: 'Passagem de guarda 1' },
  { id: 'marrom-passagens-2', belt: 'marrom', category: 'Passagem', name: 'Passagem de guarda 2' },
  { id: 'marrom-passagens-3', belt: 'marrom', category: 'Passagem', name: 'Passagem de guarda 3' },
  { id: 'marrom-passagens-4', belt: 'marrom', category: 'Passagem', name: 'Passagem de guarda 4' },
  { id: 'marrom-passagens-5', belt: 'marrom', category: 'Passagem', name: 'Passagem da meia guarda' },
  { id: 'marrom-passagens-6', belt: 'marrom', category: 'Passagem', name: 'Passagem da guarda 50/50' },
  { id: 'marrom-passagens-7', belt: 'marrom', category: 'Passagem', name: 'Passagem da guarda de lapela' },

  // Finalizações
  { id: 'marrom-armlocks-1', belt: 'marrom', category: 'Finalizações', name: 'Arm Lock 1' },
  { id: 'marrom-armlocks-2', belt: 'marrom', category: 'Finalizações', name: 'Arm Lock 2' },
  { id: 'marrom-armlocks-3', belt: 'marrom', category: 'Finalizações', name: 'Arm Lock 3' },
  { id: 'marrom-armlocks-4', belt: 'marrom', category: 'Finalizações', name: 'Arm Lock 4' },
  { id: 'marrom-triangulos-1', belt: 'marrom', category: 'Finalizações', name: 'Triângulo 1' },
  { id: 'marrom-triangulos-2', belt: 'marrom', category: 'Finalizações', name: 'Triângulo 2' },
  { id: 'marrom-omoplatas-1', belt: 'marrom', category: 'Finalizações', name: 'Omoplata 1' },
  { id: 'marrom-omoplatas-2', belt: 'marrom', category: 'Finalizações', name: 'Omoplata 2' },
  { id: 'marrom-final-joelho-1', belt: 'marrom', category: 'Finalizações', name: 'Finalização com joelho na barriga 1' },
  { id: 'marrom-final-joelho-2', belt: 'marrom', category: 'Finalizações', name: 'Finalização com joelho na barriga 2' },
  { id: 'marrom-final-joelho-3', belt: 'marrom', category: 'Finalizações', name: 'Finalização com joelho na barriga 3' },
  { id: 'marrom-final-costas-1', belt: 'marrom', category: 'Finalizações', name: 'Finalização nas costas 1' },
  { id: 'marrom-final-costas-2', belt: 'marrom', category: 'Finalizações', name: 'Finalização nas costas 2' },
  { id: 'marrom-final-costas-3', belt: 'marrom', category: 'Finalizações', name: 'Finalização nas costas 3' },
  { id: 'marrom-final-costas-4', belt: 'marrom', category: 'Finalizações', name: 'Finalização nas costas 4' },
  { id: 'marrom-final-5050', belt: 'marrom', category: 'Finalizações', name: 'Finalização da guarda 50/50' },
  { id: 'marrom-final-pe-1', belt: 'marrom', category: 'Finalizações', name: 'Finalização no pé 1' },
  { id: 'marrom-final-pe-2', belt: 'marrom', category: 'Finalizações', name: 'Finalização no pé 2' },
  { id: 'marrom-final-pe-3', belt: 'marrom', category: 'Finalizações', name: 'Finalização no pé 3' },
  { id: 'marrom-leglock-1', belt: 'marrom', category: 'Finalizações', name: 'Leg Lock 1' },
  { id: 'marrom-leglock-2', belt: 'marrom', category: 'Finalizações', name: 'Leg Lock 2' },
  { id: 'marrom-estrang-100kg-1', belt: 'marrom', category: 'Finalizações', name: 'Estrangulamento no 100kg 1' },
  { id: 'marrom-estrang-100kg-2', belt: 'marrom', category: 'Finalizações', name: 'Estrangulamento no 100kg 2' },
  { id: 'marrom-estrang-100kg-3', belt: 'marrom', category: 'Finalizações', name: 'Estrangulamento no 100kg 3' },

  // Saídas
  { id: 'marrom-saidas-1', belt: 'marrom', category: 'Saídas', name: 'Saída da montada 1' },
  { id: 'marrom-saidas-2', belt: 'marrom', category: 'Saídas', name: 'Saída da montada 2' },
  { id: 'marrom-saidas-3', belt: 'marrom', category: 'Saídas', name: 'Saída da montada 3' },

  // Costas
  { id: 'marrom-costas-1', belt: 'marrom', category: 'Costas', name: 'Ida para as costas - Berimbolo' },
  { id: 'marrom-costas-2', belt: 'marrom', category: 'Costas', name: 'Ida para as costas 2' },
  { id: 'marrom-costas-3', belt: 'marrom', category: 'Costas', name: 'Ida para as costas 3' },

  // FAIXA PRETA - Individual requirements (split from count-based, expects detailed explanations)
  // Baianas
  { id: 'preta-baianas-1', belt: 'preta', category: 'Baianas', name: 'Baiana leve' },
  { id: 'preta-baianas-2', belt: 'preta', category: 'Baianas', name: 'Baiana pesado' },

  // Quedas
  { id: 'preta-quedas-1', belt: 'preta', category: 'Quedas', name: 'Queda 1' },
  { id: 'preta-quedas-2', belt: 'preta', category: 'Quedas', name: 'Queda 2' },
  { id: 'preta-quedas-3', belt: 'preta', category: 'Quedas', name: 'Queda 3' },
  { id: 'preta-quedas-4', belt: 'preta', category: 'Quedas', name: 'Queda 4' },
  { id: 'preta-quedas-5', belt: 'preta', category: 'Quedas', name: 'Queda 5' },
  { id: 'preta-quedas-6', belt: 'preta', category: 'Quedas', name: 'Queda 6' },
  { id: 'preta-quedas-7', belt: 'preta', category: 'Quedas', name: 'Queda 7' },
  { id: 'preta-quedas-8', belt: 'preta', category: 'Quedas', name: 'Queda 8' },

  // Raspagem
  { id: 'preta-rasp-joelhos-1', belt: 'preta', category: 'Raspagem', name: 'Raspagem com oponente de joelhos 1' },
  { id: 'preta-rasp-joelhos-2', belt: 'preta', category: 'Raspagem', name: 'Raspagem com oponente de joelhos 2' },
  { id: 'preta-rasp-joelhos-3', belt: 'preta', category: 'Raspagem', name: 'Raspagem com oponente de joelhos 3' },
  { id: 'preta-rasp-pe-1', belt: 'preta', category: 'Raspagem', name: 'Raspagem com oponente em pé 1' },
  { id: 'preta-rasp-pe-2', belt: 'preta', category: 'Raspagem', name: 'Raspagem com oponente em pé 2' },
  { id: 'preta-rasp-pe-3', belt: 'preta', category: 'Raspagem', name: 'Raspagem com oponente em pé 3' },
  { id: 'preta-rasp-meia-1', belt: 'preta', category: 'Raspagem', name: 'Raspagem da meia guarda 1' },
  { id: 'preta-rasp-meia-2', belt: 'preta', category: 'Raspagem', name: 'Raspagem da meia guarda 2' },
  { id: 'preta-rasp-meia-3', belt: 'preta', category: 'Raspagem', name: 'Raspagem da meia guarda 3' },
  { id: 'preta-rasp-5050', belt: 'preta', category: 'Raspagem', name: 'Raspagem da guarda 50/50' },
  { id: 'preta-rasp-lapela', belt: 'preta', category: 'Raspagem', name: 'Raspagem da guarda de lapela' },

  // Passagem
  { id: 'preta-passagens-1', belt: 'preta', category: 'Passagem', name: 'Passagem de guarda 1' },
  { id: 'preta-passagens-2', belt: 'preta', category: 'Passagem', name: 'Passagem de guarda 2' },
  { id: 'preta-passagens-3', belt: 'preta', category: 'Passagem', name: 'Passagem de guarda 3' },
  { id: 'preta-passagens-4', belt: 'preta', category: 'Passagem', name: 'Passagem de guarda 4' },
  { id: 'preta-passagens-5', belt: 'preta', category: 'Passagem', name: 'Passagem da meia guarda' },
  { id: 'preta-passagens-6', belt: 'preta', category: 'Passagem', name: 'Passagem da guarda 50/50' },
  { id: 'preta-passagens-7', belt: 'preta', category: 'Passagem', name: 'Passagem da guarda de lapela' },

  // Finalizações
  { id: 'preta-armlocks-1', belt: 'preta', category: 'Finalizações', name: 'Arm Lock 1' },
  { id: 'preta-armlocks-2', belt: 'preta', category: 'Finalizações', name: 'Arm Lock 2' },
  { id: 'preta-armlocks-3', belt: 'preta', category: 'Finalizações', name: 'Arm Lock 3' },
  { id: 'preta-armlocks-4', belt: 'preta', category: 'Finalizações', name: 'Arm Lock 4' },
  { id: 'preta-triangulos-1', belt: 'preta', category: 'Finalizações', name: 'Triângulo 1' },
  { id: 'preta-triangulos-2', belt: 'preta', category: 'Finalizações', name: 'Triângulo 2' },
  { id: 'preta-omoplatas-1', belt: 'preta', category: 'Finalizações', name: 'Omoplata 1' },
  { id: 'preta-omoplatas-2', belt: 'preta', category: 'Finalizações', name: 'Omoplata 2' },
  { id: 'preta-final-joelho-1', belt: 'preta', category: 'Finalizações', name: 'Finalização com joelho na barriga 1' },
  { id: 'preta-final-joelho-2', belt: 'preta', category: 'Finalizações', name: 'Finalização com joelho na barriga 2' },
  { id: 'preta-final-joelho-3', belt: 'preta', category: 'Finalizações', name: 'Finalização com joelho na barriga 3' },
  { id: 'preta-final-costas-1', belt: 'preta', category: 'Finalizações', name: 'Finalização nas costas 1' },
  { id: 'preta-final-costas-2', belt: 'preta', category: 'Finalizações', name: 'Finalização nas costas 2' },
  { id: 'preta-final-costas-3', belt: 'preta', category: 'Finalizações', name: 'Finalização nas costas 3' },
  { id: 'preta-final-costas-4', belt: 'preta', category: 'Finalizações', name: 'Finalização nas costas 4' },
  { id: 'preta-final-5050', belt: 'preta', category: 'Finalizações', name: 'Finalização da guarda 50/50' },
  { id: 'preta-final-pe-1', belt: 'preta', category: 'Finalizações', name: 'Finalização no pé 1' },
  { id: 'preta-final-pe-2', belt: 'preta', category: 'Finalizações', name: 'Finalização no pé 2' },
  { id: 'preta-final-pe-3', belt: 'preta', category: 'Finalizações', name: 'Finalização no pé 3' },
  { id: 'preta-leglock-1', belt: 'preta', category: 'Finalizações', name: 'Leg Lock 1' },
  { id: 'preta-leglock-2', belt: 'preta', category: 'Finalizações', name: 'Leg Lock 2' },
  { id: 'preta-estrang-100kg-1', belt: 'preta', category: 'Finalizações', name: 'Estrangulamento no 100kg 1' },
  { id: 'preta-estrang-100kg-2', belt: 'preta', category: 'Finalizações', name: 'Estrangulamento no 100kg 2' },
  { id: 'preta-estrang-100kg-3', belt: 'preta', category: 'Finalizações', name: 'Estrangulamento no 100kg 3' },

  // Saídas
  { id: 'preta-saidas-1', belt: 'preta', category: 'Saídas', name: 'Saída da montada 1' },
  { id: 'preta-saidas-2', belt: 'preta', category: 'Saídas', name: 'Saída da montada 2' },
  { id: 'preta-saidas-3', belt: 'preta', category: 'Saídas', name: 'Saída da montada 3' },

  // Costas
  { id: 'preta-costas-1', belt: 'preta', category: 'Costas', name: 'Ida para as costas - Berimbolo' },
  { id: 'preta-costas-2', belt: 'preta', category: 'Costas', name: 'Ida para as costas 2' },
  { id: 'preta-costas-3', belt: 'preta', category: 'Costas', name: 'Ida para as costas 3' },
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

// Map category names to technique types
export function getCategoryTechniqueType(category: string, belt: BeltId): TechniqueType {
  // Normalize category for case-insensitive matching
  const cat = category.toLowerCase();

  // Azul belt (12 categories)
  if (belt === 'azul') {
    // Finalizações: submissions and attacks
    if (cat.includes('cem kilos') || cat.includes('100') ||
        cat.includes('joelho') ||
        cat.includes('montada') ||
        cat.includes('guarda fechada') ||
        cat.includes('costas')) {
      return 'finalizacoes';
    }
    // Quedas: takedowns
    if (cat.includes('quedas') || cat.includes('ataque de pé')) {
      return 'quedas';
    }
    // Raspagens: sweeps
    if (cat.includes('raspagem') || cat.includes('meia guarda')) {
      return 'raspagens';
    }
    // Passagens: guard passes
    if (cat.includes('passagem')) {
      return 'passagens';
    }
    // Outros: escapes and fundamentals
    if (cat.includes('saídas') || cat.includes('saidas') || cat.includes('fundamentos')) {
      return 'outros';
    }
  }

  // Roxa, Marrom, Preta belts (7 categories with consistent structure)
  // Finalizações
  if (cat.includes('finalizações') || cat.includes('finalizacoes') || cat.includes('costas')) {
    return 'finalizacoes';
  }
  // Quedas
  if (cat.includes('quedas') || cat.includes('baianas')) {
    return 'quedas';
  }
  // Raspagens
  if (cat.includes('raspagem')) {
    return 'raspagens';
  }
  // Passagens
  if (cat.includes('passagem')) {
    return 'passagens';
  }
  // Outros (saídas)
  if (cat.includes('saídas') || cat.includes('saidas')) {
    return 'outros';
  }

  // Default fallback
  return 'outros';
}

// Get requirements filtered by belt and technique type
export function getRequirementsByBeltAndType(beltId: BeltId, techniqueType: TechniqueType): Requirement[] {
  const beltRequirements = getRequirementsByBelt(beltId);
  return beltRequirements.filter(req =>
    getCategoryTechniqueType(req.category, beltId) === techniqueType
  );
}
