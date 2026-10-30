export interface Strings {
  progress: string;
  noteAndLink: string;
  notePlaceholder: string;
  linkPlaceholder: string;
  saveFailed: string;
  reset: string;
  resetConfirm: string;
  loadFailed: string;
  /** Where this language's requirements.json lives. */
  dataUrl: string;
}

const ptBR: Strings = {
  progress: 'Progresso',
  noteAndLink: 'Nota e link',
  notePlaceholder: 'Sua anotação',
  linkPlaceholder: 'Link de vídeo (YouTube, etc.)',
  saveFailed: 'Não foi possível salvar neste navegador. Seu progresso pode se perder ao recarregar.',
  reset: 'Zerar esta faixa',
  resetConfirm: 'Zerar todo o progresso desta faixa?',
  loadFailed: 'Não foi possível carregar o checklist. Recarregue a página.',
  dataUrl: '/checklist/requirements.json',
};

const enUS: Strings = {
  progress: 'Progress',
  noteAndLink: 'Note and link',
  notePlaceholder: 'Your note',
  linkPlaceholder: 'Video link (YouTube, etc.)',
  saveFailed: 'Could not save in this browser. Your progress may be lost when you reload.',
  reset: 'Reset this belt',
  resetConfirm: 'Reset all progress for this belt?',
  loadFailed: 'Could not load the checklist. Please reload the page.',
  dataUrl: '/en/checklist/requirements.json',
};

/** Picks the dictionary from an <html lang> value; anything not English falls back to Portuguese. */
export function stringsFor(lang: string): Strings {
  return /^en(-|$)/i.test(lang) ? enUS : ptBR;
}
