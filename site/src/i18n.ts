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
  upsellTitle: string;
  upsellBody: string;
  upsellClose: string;
  /** `{belt}` is replaced with the belt name. */
  completeTitle: string;
  completeBody: string;
  completeNote: string;
  appStoreAlt: string;
  playAlt: string;
  playBadge: string;
}

export const APP_STORE_URL = 'https://apps.apple.com/app/id6754972177';
export const PLAY_URL = 'https://play.google.com/store/apps/details?id=com.brothersfight.bjjchecklist';

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
  upsellTitle: 'Leve o checklist no bolso',
  upsellBody: 'O app Minha Próxima Faixa funciona offline e guarda suas notas e links de vídeo.',
  upsellClose: 'Fechar aviso',
  completeTitle: 'Faixa {belt} completa!',
  completeBody: 'Quer levar seu progresso para o app? Ele funciona offline e guarda suas notas e vídeos.',
  completeNote: 'O app é separado do site: o que você marcou aqui fica neste navegador e não é copiado para ele.',
  appStoreAlt: 'Baixar na App Store',
  playAlt: 'Disponível no Google Play',
  playBadge: '/badges/google-play.svg',
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
  upsellTitle: 'Take the checklist with you',
  upsellBody: 'The My Next Belt app works offline and keeps your notes and video links.',
  upsellClose: 'Dismiss',
  completeTitle: '{belt} belt complete!',
  completeBody: 'Want to take your progress to the app? It works offline and keeps your notes and videos.',
  completeNote: 'The app is separate from this site: what you ticked here stays in this browser and is not copied to it.',
  appStoreAlt: 'Download on the App Store',
  playAlt: 'Get it on Google Play',
  playBadge: '/badges/google-play-en.svg',
};

/** Picks the dictionary from an <html lang> value; anything not English falls back to Portuguese. */
export function stringsFor(lang: string): Strings {
  return /^en(-|$)/i.test(lang) ? enUS : ptBR;
}
