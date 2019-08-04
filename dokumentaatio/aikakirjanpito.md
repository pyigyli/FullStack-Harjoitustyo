# työaikakirjanpito

| päivä  | aika | mitä tein  |
| :----: |:-----| :-----|
| 23.5.  | 5    | - TypeScript-frontend ja -backend aloitettu.<br> - Webpack otettu käyttöön.<br> - Dokumentaatio aloitettu. |
| 24.5.  | 7    | - WebSocket-viestintä palvelimen ja clientin välillä toteutettu.<br> - Sovellus siirretty Herokuun.<br> - Projektien konfigurointeja näperrelty.<br> - Käyttöliittymään lisätty pari käytännössä tyhjää sivua ja header-valikko niiden vaihtamiseen. |
| 25.5.  | 7    | - Firebasen Realtime Database otettu käyttöön.<br> - Käyttäjän luominen ja kirjautuminen mahdollista.<br> |
| 26.5.  | 9    | - Käyttäjältä tokenia (eli kirjautumista) vaativat toiminnat mahdollistettu.<br> - Uloskirjautuminen toteutettu.<br> - Käyttäjän luomisen ja kirjautumisen validoinnit toteutettu.<br> - Virheilmoitusten näyttäminen käyttäjälle toteutettu.<br> - Käyttöliittymän ulkoasua paranneltu ja komponentteja lisätty. |
| 27.5.  | 6    | - Kylänäkymän toteutus aloitettu.<br> - Kyläverkon hakeminen tietokannasta toteutettu. |
| 28.5.  | 5    | - Kylänäkymän kyläverkon ulkoasun toimintoja toteutettu.<br> - Kenttänäkymän kenttäverkon haku tietokannasta ja esitys frontendissä toteutettu.<br> - Käyttäjän ja hänen kyläänsä liittyvien tietojen haku toteutettu.<br> - Profiilipalkki aloitettu. |
| 29.5.  | 1    | - Pientä koodin tyylin refaktorointia ja edistystä komponenttien kanssa. |
| 30.5.  | 7    | - Käyttöliittymän ulkoasua edistetty.<br> - Näkymien vaihtumisen yhteydessä haettavan datan hakutapaa parannettu. |
| 31.5.  | 6    | - Tietokannan kanssa kommunikoivaa koodia refaktoroitu ja suoraviivaistettu.<br> - Kenttänäkymän kenttäverkon ruutujen tason nostamisen toiminto osittain toteutettu. |
| 1.6.   | 3    | - Kenttäverkon ruudun tason nostaminen korjattu ja edistetty. |
| 2.6.   | 5    | - Rakennusten ja resurssikenttien data refaktoroitu sijaitsemaan protokollassa, eikä tietokannassa.<br> - Resurssipeltoja voi nyt nostaa tasolle 3 asti.<br> - Resurssien lukumäärän kasvamista ajan kanssa korjattu. |
| 3.6.   | 5    | - Resurssien kasvu ajan kanssa refaktoroitu formaatista "millisekunttia seuraavaan" formaattiin "resurssia tunnissa".<br> - Resurssikenttien tasoa ei voi nostaa, jos resurssit eivät riitä.<br> - Resurssien kasvua tasapainotettu.<br> - Kyläruudukon laajentaminen toteutettu. |
| 4.6.   | 6    | - Kyläruudukon ulkoasua ja rakennusten rakentamista edistetty. |
| 5.6.   | 8    | - Kyläruudukkoon voi rakentaa uusia rakennuksia, joiden sijainnin ja orientaation voi päättää itse.<br> - Kyläruudukon rakennettavien rakennusten listan ulkoasu toteutettu. |
| 6.6.   | 5    | - Rakennusta ei voi asettaa, ellei valittu paikka ole vapaa.<br> - Asiakas ei enää pyydä palvelimelta jatkuvasti käyttäjän dataa.<br> - Rakennuksen tason nostamista edistetty. |
| 7.6.   | 4    | - Rakennusten tason nostaminen toteutettu.<br> - Useamman ruudun peittävien rakennusten ulkoasu kyläruudukossa korjattu.<br> - Index-näkymä toteutettu. |
| 8.6.   | 7    | - Olemassa olevien rakennusten uudelleen sijoittaminen toteutettu.<br> - Rakennusten tuhoaminen kyläverkossa toteutettu. |
| 9.6.   | 2    | - Kenttänäkymän ruudukon eri ruutujen klikkaaminen korjattu ja toteutettu. |
| 10.6.  | 8    | - Karttanäkymä aloitettu. |
| 11.6.  | 3    | - Karttanäkymää edistetty. |
| 12.6.  | 3    | - Karttanäkymän ruudun klikkaaminen esittää kylän tiedot.<br> - Kenttä-, kylä- sekä karttaruudukon ruuduille lisätty efektejä, kun kursoria liikutetaan sopivalle ruudulle. |
| 13.6.  | 7    | - Karttanäkymä toteutettu.<br> - Viestinäkymä aloitettu.<br> - Viestin lähettäminen osittain toteutettu. |
| 14.6.  | 6    | - Viestien lähettäminen toteutettu.<br> - Viestien poistaminen toteutettu. |
| 15.6.  | 5    | - Viestinäkymän ulkoasu valmis.<br> - Lukemattomat ja luetut viestit toteutettu.<br> - Viestien lähettämiselle asetettu sopivia validointeja. |
| 16.6.  | 1    | - Koodin tyyliä refaktoroitu. |
| 17.6.  | 1    | - Varastorakennus toteutettu, joka lisää kolmen yleisresurssin maksimikapasiteettia. Myös rakennuksen poistaminen toteutettu. |
| 18.6.  | 2    | - Viljasiilo toteutettu.<br> - Jokaiselle rakennukselle oma ruudun taustaväri.<br> - Rakennuksiin liittyviä bugeja korjattu. |
| 26.6.  | 3    | - Kasarmi ja lähetystö alustettu.<br> - Kaupungintalo toteutettu.<br> - Rakennuksilla voi olla nyt vaatimuksia, jotka pitää rakentaa ennen kuin kyseinen rakennus voidaan rakentaa. |
| 27.6.  | 5    | - Rakennusta tai peltoa ei voi enää rakentaa/kehittää, mikäli sen rakentaminen/päivittäminen laskisi viljan tuotanto-kulutus-nopeuden negatiiviseksi.<br> - Lähetystö toteutettu.<br> - Käyttäjä voi valita haluaako hän kylänsä pysyvän rauhassa hyökkääjiltä, jolloin hän ei voi itsekkään hyökätä muihin pelaajiin vai olevan valmiina taisteluihin. |
| 29.6.  | 1    | - Rakennettavien rakennusten listaan lisätty filtteröintiä ja 'näytä lisää'/'näytä vähemmän' -nappi. |
| 30.6.  | 2    | - Kasarmi ja joukkojen kouluttaminen aloitettu. |
| 5.7.   | 4    | - Kasarmi ja joukkojen kouluttaminen toteutettu.<br> - Kylässä olevien joukkojen määrä nähtävissä kenttänäkymässä. |
| 6.7.   | 9    | - Hevostalli ja hesvosjoukkojen kouluttaminen toteutettu.<br> - Rakennusten sisältöjen esittämistä refaktoroitu.<br> - Uusien resurssipeltojen tutkiminen ja Joukkojen lähettäminen sotaretkelle muihin kyliin aloitettu. |
| 7.7.   | 5    | - Joukkojen lähettäminen toteutettu.<br> - Joukkojen takaisin kääntyminen perille pääsemisen jälkeen osittain toteutettu.<br> - Matkalla olevat joukot nähtävillä kenttänäkymässä. |
| 8.7.   | 3    | - Lähetetyt joukot osaavat voiton jälkeen kääntyä takaisin kotikylään.<br> - Lähetetyt joukot osaavat häviön jälkeen kuolla.<br> - Kahden eri kylän joukkojen sotiminen toteutettu. |
| 11.7.  | 7    | - Lähetetyt joukot osaavat taistelusta selvittyään saapua takaisin kotikylään.<br> - Taistelun pelilogiikkaa toteutettu.<br> - Hyökkääjän viestilaatikkoon lähetetään raportti taistelusta, kun taistelu on tapahtunut. |
| 12.7.  | 5    | - Lukemattomien viestien olemassaolo muuttaa yläpalkin ikonin väriä.<br> - Rivinvaihto viesteissä korjattu.<br> - Hyökätylle pelaajalle lähetetään myös raportti taistelun tapahtuessa.<br> - Toisen pelaajan kylään hyökkääminen toteutettu. |
| 13.7.  | 4    | - Joukkojen välisten taistelujen bugeja korjattu.<br> - Hyökkäävät joukot näkyvät myös kohteen kenttänäkymässä.<br> - Taistelun tulos lasketaan nyt myös silloinkin, jos hyökkäyksen kohdekäyttäjä on taistelun ajankohdan jälkeen ensimmäinen, joka pyytää serveriltä tietojaan. |
| 14.7.  | 7    | - Joukkojen välisestä taistelusta löytyneet bugit viimein korjattu. |
| 22.7.  | 2    | - Hyökkäyksen tapahtuessa taistelusta selviävät hyökkääjät varastavat puolustavan pelaajan resursseja. |
| 23.7.  | 3    | - Kahden pelaajan välisestä taistelusta korjattu lisää bugeja.<br> - Kahden pelaajan väliset taistelut täysin toteutettu. |
| 25.7.  | 3    | - Profiilisivu aloitettu. |
| 27.7.  | 2    | - Pitkäaikaisia pieniä bugeja korjattu ja puutteita paikattu. |
| 28.7.  | 4    | - Käyttäjä voi nyt poistaa tilinsä.<br> - Profiilisivun bio toteutettu. |
| 3.8.   | 5    | - Profiilisivun käyttäjän tiedot toteutettu.<br> - Viestin lähetys toiselle käyttäjälle profiilisivun kautta toteutettu.<br> - Profiilisivu toteutettu.<br> - Kenttänäkymän tutkimattomien kenttien valtaaminen toteutettu. |
| 4.8.   | 2    | - Sovelluksen toimintojen toimivuuden tarkastus ja viimeiset löydetyt bugikorjaukset.<br> - Dokumentaatiota lisätty.<br> - Sovellus kurssin näkökulmasta valmis. |
| Yhteensä | 210    |