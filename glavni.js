import { ucitajZadatke, spremiZadatke } from './pohrana.js';

// process.argv[0] je putanja do Node-a, process.argv[1] je putanja do skripte
// Argumenti kreću od indeksa 2
const [, , naredba, ...argumenti] = process.argv;

async function pokreni() {
  const zadaci = await ucitajZadatke();

  switch (naredba) {
    case 'dodaj': {
      const naslov = argumenti.join(' ').trim();
      
      if (!naslov) {
        console.error('Pogreška: Nedostaje Vam naslov zadatka, obavezno dodajte naslov!');
        process.exit(1);
      }

      // Određivanje novog ID-a (ako nema zadataka, kreće od 1, inače max id + 1)
      const noviId = zadaci.length > 0 ? Math.max(...zadaci.map(z => z.id)) + 1 : 1;

      const noviZadatak = {
        id: noviId,
        naslov: naslov,
        gotovo: false
      };

      zadaci.push(noviZadatak);
      await spremiZadatke(zadaci);
      console.log(`Dodan je Vaš novi zadatak [${noviId}]: "${naslov}"`);
      break;
    }

    case 'popis': {
      if (zadaci.length === 0) {
        console.log('Popis zadataka je prazan, molimo, dodajte neke zadatke.');
        return;
      }

      zadaci.forEach(z => {
        const oznaka = z.gotovo ? 'x' : ' ';
        console.log(`${z.id}. [${oznaka}] ${z.naslov}`);
      });
      break;
    }

    case 'gotovo': {
      const idArg = argumenti[0];
      const idBroj = Number(idArg);

      // Provjera je li ID poslan i je li valjani broj
      if (!idArg || isNaN(idBroj)) {
        console.error('Pogreška: ID zadatka mora biti valjani cijeli broj, ne može biti decimalan ili negativan.');
        process.exit(1);
      }

      const zadatak = zadaci.find(z => z.id === idBroj);

      if (!zadatak) {
        console.error(` Velika Greška: Zadatak sa  ID-jem ${idBroj} ne postoji u ovom popisu.`);
        process.exit(1);
      }

      zadatak.gotovo = true;
      await spremiZadatke(zadaci);
      console.log(`Zadatak s brojem:${idBroj} označen je kao gotovo!`);
      break;
    }

    default: {
      console.error(`Greška: Naredba koju ste unijeli ne postoji. "${naredba || ''}". Naredbe koje ovaj program podržava su:
         dodaj, popis, gotovo!`);
      process.exit(1);
    }
  }
}

pokreni();