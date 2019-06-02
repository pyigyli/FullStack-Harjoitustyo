# Työpäiväkirja

Työpäiväkirjan tarkoituksena on dokumentoida mietteitä ja huomioita, sekä selittää ajatukseni eri päätöksistä, joita olen projektin aikana tehnyt

#### 23.5.2019
- Itse en ole suuri fani sille, että projektin eri osat hajautetaan useaan eri kansioon, joten halusin toteuttaa sovelluksen monorepona, vaikka tiesin, että tämä voi aiheuttaa ongelmia tulevaisuudessa.

#### 24.5.2019
- Monorepo aiheutti ongelmia. Koska käytän TypeScriptiä, olisi toivottavaa luoda protokollalle oma repositio, joka voidaan asettaa front- ja backendille riippuvuudeksi. Tämä ei kuitenkaan näytä onnistuvan monorepo-systeemissäni, joten en luo erillistä protokollaa. Toisaalta tämä suoraviivaistaa tilanteita, joissa joudun päivittämään serverin ja clientin välisten viestien tyypityksiä. Sen sijaan, että joutuisin puskemaan protokollan githubiin ja suorittamaan `yarn upgrade`, voin vain copy-pastata tyypitykset molempiin projekteihin.

- Haluaisin mieluiten käyttää MongoDB:tä tietojen tallentamiseen, mutta ilmeisesti ei-maksaville käyttäjille annetaan käyttöön vain yksi ilmainen klusteri, jota käytän Full Stack -kurssin harjoitustehtäviin. Koska haluan tälle projektille ihan ikioman datapankin, taidan päätyä käyttämään herokun omaa SQliteä. Saa nähdä...

#### 25.5.2019
- Päädyin käyttämään tietojen tallentamiseen firebasea, joka on vapaa-ajan projekteista joksikseen tuttu. En kuitenkaan aijo siirtää hostaamista sinne. Heroku on mielestäni tähän tarkoitukseen parempi.

#### 2.6.2019
- Tein tärkeän oivalluksen huomatessani, ettei muuttumatonta tietoa kannata tallentaa tietokantaan, mistä sen noutaminen on turhan monimutkaista, kun voin yhtä hyvin kovakoodata ne protokollaan asiakkaan ja palvelimen käytettäväksi. Kun tekee yhtä asiaa liian kauan, voi unohtaa helposti, että muitakin vaihtoehtoja on tarjolla.
