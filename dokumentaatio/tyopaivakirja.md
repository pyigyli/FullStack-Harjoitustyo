# Työpäiväkirja

**Työpäiväkirjan tarkoituksena on dokumentoida mietteitä ja huomioita, sekä selittää ajatukseni eri päätöksistä, joita olen projektin aikana tehnyt**

#### 23.5.2019
- Itse en ole suuri fani sille, että projektin eri osat hajautetaan useaan eri kansioon, joten halusin toteuttaa sovelluksen monorepona, vaikka tiesin, että tämä voi aiheuttaa ongelmia tulevaisuudessa.

#### 24.5.2019
- Monorepo aiheutti ongelmia. Koska käytän TypeScriptiä, olisi toivottavaa luoda protokollalle oma repositio, joka voidaan asettaa front- ja backendille riippuvuudeksi. Tämä ei kuitenkaan näytä onnistuvan monorepo-systeemissäni, joten en luo erillistä protokollaa. Toisaalta tämä suoraviivaistaa tilanteita, joissa joudun päivittämään serverin ja clientin välisten viestien tyypityksiä. Sen sijaan, että joutuisin puskemaan protokollan githubiin ja suorittamaan `yarn upgrade`, voin vain copy-pastata tyypitykset molempiin projekteihin.