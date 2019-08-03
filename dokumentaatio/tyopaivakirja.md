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

#### 10.6.2019
- Itseäni mietityttää kartan toteuttaminen. Kylien etäisyys toisiinsa määrää kylien välillä tapahtuvien toimintojen nopeuden, joten helpoin tapa ei ehkä ole kaikista järkevin, koska tiedän, ettei tällaiseen opiskelijaprojektiin liity kuin muutama testikäyttäjä. Haluanko luoda ison kartan, jonne teoriassa voisi mahtua tuhansia pelaajia? Haluanko luoda pienen kartan, johon mahtuu maksimissaan sen verran pelaajia, että iso pelaajamäärä ei olisi ikinä mahdollista? Taidan kuitenkin yrittää luoda kartan, joka laajenee pelaajamäärän lisääntyessä. Haluan myös, että kartta pyörii kierroksen ympäri, jotta kylän sijainti kartalla on mahdollisimman tasapuolinen. Se kuitenkin monimutkaistaa toteutusta kovasti.

- Minulla ei myöskään ole mitään hajua, kuinka pahasti esimerkiksi 1000x1000 kokoisen kartan hakeminen ja lähettäminen tukkii serveriä, joka joutuu pahimmassa tapauksessa käsittelemään satoja pyyntöjä sekunnissa. *(olettaen että peli olisi oikeasti suosittu MMOG)* Saatan ehkä suorittaa kartan toteutuksen huolella ja ladata karttaa sitä mukaan, kun kartan näkymää liikutetaan.

- Loppujen lopuksi päädyin 500*500 kokoiseen karttaan, johon siis mahtuisi yhteensä 250000 pelaajaa. Itsestään kasvava kartta olisi ollut turhan monimutkainen toteuttaa, joten en halunnut enää myöhemmin edes yrittää.

#### 6.7.2019
- Olen ainakin tämän projektin aikana oppinut, miten asioita kannattaa heti alusta asti jakaa selkeisiin moduuleihin. Tämä projekti ei onneksi käytä hirveästi laskukaavoja pelilogiikassaan ja tässä vaiheessa en enää jaksa alkaa refaktoroimaan koodiani tämän parantamiseksi, mutta tulevaisuuden projekteissa kaikki matemaattiset kaavat olisi erittäin kätevä pitää yhdessä paikassa, josta ne voidaan importata ja niiden eri muuttujia on helppo muuttaa.

#### 14.7.2019
- Jokainen bugi, jonka ratkaisemiseen menee 4-5 päivää, on uusi peukalosääntö, jota ei tule unohtamaan. Tänään opimme, että kannattaa varmistaa, ettei käyttäjä voi lähettää uutta pyyntöä tietokantaan, ennen kuin ensimmäinen pyyntö on toteutettu. Saattaa vähentää tietokannan tietojen yliajamista.

#### 3.8.2019
- Tätä projektia tehdessä oppii tai oikeastaan hoksaa niin paljon uusia käytäntöjä, joita ei kuitenkaan tässä vaiheessa enää kannata toteuttaa, koska tämä projekti on niin lähellä valmista, enkä jaksa enää niin raskasta määrää refaktorointia. Suuri hoksaaminen tänään oli, että olisi kiva toteuttaa lataustila, jonka aikana front-end odottaa, että serveri ja tietokanta lähettää jonkin vastauksen ja vasta tämän jälkeen sivu päivittyy. Tällöin edellinen data ei näy hetken aikaa käyttäjän ruudulla ja nopeasti päivity oikeaksi halutuksi dataksi. Ei kuitenkaan enää jaksa toteuttaa, koska olen saanut jo kurssin työmäärän täyteen ja haluan siityä tästä projektista kipeästi uusiin.