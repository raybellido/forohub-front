import { describe, expect, it } from 'vitest';

import { componerAvatarUrl, inicialesDe } from './avatar';

describe('componerAvatarUrl', () => {
  it('compone la URL de dicebear con el seed escapado', () => {
    expect(componerAvatarUrl('adventurer', 'Ana García')).toBe(
      'https://api.dicebear.com/9.x/adventurer/svg?seed=Ana%20Garc%C3%ADa',
    );
  });
});

describe('inicialesDe', () => {
  it('extrae las iniciales de las dos primeras palabras', () => {
    expect(inicialesDe('María De la Cruz')).toBe('MD');
  });

  it('usa una sola inicial si hay una palabra', () => {
    expect(inicialesDe('Juan')).toBe('J');
  });

  it('maneja cadenas vacías', () => {
    expect(inicialesDe('')).toBe('');
  });
});