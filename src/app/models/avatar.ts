export interface EstiloAvatar {
  id: string;
  nombre: string;
}

export const ESTILOS_AVATAR: EstiloAvatar[] = [
  { id: 'adventurer', nombre: 'Aventurero' },
  { id: 'lorelei', nombre: 'Lorelei' },
  { id: 'micah', nombre: 'Micah' },
  { id: 'open-peeps', nombre: 'Open Peeps' },
  { id: 'big-smile', nombre: 'Gran sonrisa' },
  { id: 'croodles', nombre: 'Croodles' },
  { id: 'notionists', nombre: 'Notionistas' },
  { id: 'fun-emoji', nombre: 'Emoji' },
  { id: 'pixel-art', nombre: 'Pixel art' },
  { id: 'thumbs', nombre: 'Pulgares' },
  { id: 'bottts', nombre: 'Robots' },
  { id: 'identicon', nombre: 'Identicon' },
];

export const ESTILO_POR_DEFECTO = 'adventurer';

export function componerAvatarUrl(estilo: string, seed: string): string {
  return `https://api.dicebear.com/9.x/${estilo}/svg?seed=${encodeURIComponent(seed)}`;
}

export function inicialesDe(nombre: string): string {
  return nombre
    .split(' ')
    .slice(0, 2)
    .map((parte) => parte.charAt(0))
    .join('')
    .toUpperCase();
}