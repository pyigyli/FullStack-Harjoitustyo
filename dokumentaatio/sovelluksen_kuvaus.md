# Sovelluksen kuvaus

## Sovelluksen arkkitehtuuri
- Sovelluksessa on TypeScriptillä ja Reactilla toteutettu front-end.
- Sovelluksessa on TypeScriptillä ja Nodella toteutettu back-end.
- Sovellus käyttää tietokantanaan firebasea.
- Sovellus on julkaistu Herokuun.

## Sovelluksen käyttö ja ominaisuuksia
#### Käyttäjätilin luominen ja sisäänkirjautuminen
- Käyttäjä voi liittyä peliin luomalla uuden tilin. Käyttäjä voi kirjautua ulos ja palata myöhemmin peliin takaisin kirjautumalla uudelleen sisään.
#### Kenttänäkymä
- Käyttäjä voi nostaa resurssikenttien tasoa, mikä lisää resurssien tuotantonopeutta.
- Kun pelaaja on kehittänyt kylänsä siihen pisteeseen, että hän voi kehittää joukkoja, näkee hän joukkonsa määrän kenttänäkymässä.
- Kun pelaaja on lähettänyt joukkonsa hyökkäämään, näkee hän joukkojen matkustamisajan kenttänäkymässä.
- Kun toinen pelaaja hyökkää hänen kyläänsä, näkee hän hyökkäävien joukkojen matkustusajan.
- Pelaaja voi lähettää joukkonsa tutkimusmatkalle läheisiin kenttiin, jotka hän voi vallata ja muuttaa uusiksi resurssikentiksi, mikäli tarpeeksi suuri määrä lähetetystä joukosta selviää matkalta takaisin.
#### Kylänäkymä
- Pelaaja voi laajentaa kyläänsä yhteensä kaksi kertaa, jolloin kylän rakennusalueen koko kasvaa.
- Pelaaja voi rakentaa useita eri rakennuksia valitsemalla niille sopivan vapaan tilan kyläruudukosta.
- Pelaaja voi liikuttaa rakennettuja rakennuksia.
- Pelaaja voi tuhota rakennettuja rakennuksia.
- Kun pelaaja on rakentanut sopivia rakennuksia, voi hän näistä rakennuksista käsin esimerkiksi kasvattaa resurssivarastojen kapasiteettia tai kouluttaa joukkoja.
#### Karttanäkymä
- Pelaaja voi liikuttaa kartan näkymää ja nähdä missä kartan koordinaateissa sijaitsee muiden pelaajien kyliä.
- Pelaaja voi lähettää muiden pelaajien kyliin hyökkäyksiä.
- Pelaaja voi siirtyä toisen pelaajan profiilinäkymään.
#### Viestinäkymä
- Pelaaja voi lukea hänelle saapuneet viestit ja taisteluraportit.
- Pelaaja voi lähettää muille pelaajille viestejä.
- Pelaaja voi poistaa viestejään.
#### Profiilinäkymä
- Pelaaja voi muuttaa bioaan omassa profiilissaan.
- Pelaaja voi poistaa käyttäjätilinsä omasta profiilistaan.
- Pelaaja voi lähettää toiselle pelaajalle viestin hänen profiilistaan käsin.