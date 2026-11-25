import { readFile, writeFile } from 'node:fs/promises';

const NAZIV_DATOTEKE = 'zadaci.json';

/**
 * Ucitava zadatke iz JSON datoteke.
 * Ako datoteka ne postoji, vratit ce prazan niz.
 * Ako je sadržaj neispravan JSON, ispisuje poruku i vraca prazan niz bez rušenja.
 */
export async function ucitajZadatke() {
  try {
    const sadrzaj = await readFile(NAZIV_DATOTEKE, 'utf-8');
    return JSON.parse(sadrzaj);
  } catch (greska) {
    if (greska.code === 'ENOENT') {
      // Datoteka jos ne postoji.
      return [];
    }
    // if JSON nije valjan
    console.error('Upozorenje: Datoteka zadaci.json sadrzi neispravan format. Vracam prazan popis zadataka.');
    return [];
  }
}

/**
 * Sprema polje zadataka u JSON datoteku asinkrono.
 */
export async function spremiZadatke(zadaci) {
  try {
    await writeFile(NAZIV_DATOTEKE, JSON.stringify(zadaci, null, 2), 'utf-8');
  } catch (greska) {
    console.error('Dogodila se pogreska prilikom spremanja zadataka:', greska.message);
    process.exit(1);
  }
}