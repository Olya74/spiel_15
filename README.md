# spiel_15

## set board und picture 

1.matrix bekommen

2.data-set benutzen

3.sort funktion Fisher-Yates

## canvas 

## file upload und als img angezeigt



### Schaltflächen hinzugefügt

### Problem behoben,bei dem das Bild beim ersten Laden der Seite angezeigt wurde

1.function el.onload -> el.addEventListener

## Was wird gemacht:

### timer

1.setInterval

2.clearInterval

## responsibility

## audio element 

## 03.12.2024 new branch 

### Arbeit im branch_1

1.header,currentSrcArr, localStorage  -> Ergebnis: img nur bis zum Neustart des Brausers gespeichert 

## 04.12.2024

### ich bin mit folgenden Probleme gestoßen

1.Wert vom input lesen

2.bei speicherung img vom lokal computer muss ich img in blob Daten.Wenn die Seite neu geladen wird ist alles gut.Die Bilder werden angezeigt.Aber nach dem Schließen der Seite ist es unmöglich,sie darzustellen.

## 05.12.2024

1.Fix bag :Beim Vershieben der Sortierung am Anfand des Spiels kommt es zu Duplikaten.Beim Sort überschnitten sich Stile.Dazu war node.style.transform in setNodesStyleWithPicture() :  entfrnt

2.funktionen für Stop und Play musik

3.funktionen für timer :stop,start

#### für Anzeige beim Spiel

```createInfo('Guest',0,0);
 setTimeout(()=>{
     document.getElementById('info').remove();
 }
 ,3000);
```
### info block createt