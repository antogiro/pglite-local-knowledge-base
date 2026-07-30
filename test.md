# Schritt-für-Schritt-Testanleitung

## 1. Testdokumente anlegen

Füge nacheinander die folgenden 3 Test-Dokumente über das Formular **„Neues Dokument hinzufügen“** ein:

### Dokument 1
- **Titel:** Kaffeezubereitung
- **Inhalt:** Für einen perfekten Espresso benötigt man fein gemahlene Kaffeebohnen, etwa 9 Bar Druck und heißes Wasser bei ca. 92 Grad Celsius.

Klicke auf **Speichern**.  
Beim ersten Speichern lädt `@xenova/transformers` kurz das Modell herunter, achte auf die Statusmeldung.

### Dokument 2
- **Titel:** PostgreSQL Datenbank
- **Inhalt:** Relationale Datenbanken speichern strukturierte Daten in Tabellen mit Zeilen und Spalten und nutzen SQL für Abfragen.

Klicke auf **Speichern**.

### Dokument 3
- **Titel:** WebAssembly im Browser
- **Inhalt:** WASM ermöglicht es, kompilierte Sprachen wie C, C++ oder Rust direkt in JavaScript-Laufzeitumgebungen auszuführen.

Klicke auf **Speichern**.

## 2. Semantische Suche testen

Jetzt testen wir die Ähnlichkeitssuche. Das Spannende dabei: Wir verwenden Wörter, die im Originaltext gar nicht vorkommen.

### Test A: Suche nach „Siebträger und Barista“
Gib im Suchfeld ein: **Siebträger und Barista**.  
Klicke auf **Suchen**.

**Erwartetes Ergebnis:**  
Kaffeezubereitung sollte ganz oben stehen, mit einer hohen Ähnlichkeit von z. B. > 60–70 %, obwohl die Begriffe **„Siebträger“** oder **„Barista“** nie im Text standen.

### Test B: Suche nach „Datenbanken und SQL“
Gib im Suchfeld ein: **Tabellen und Abfragesprachen**.  
Klicke auf **Suchen**.

**Erwartetes Ergebnis:**  
PostgreSQL Datenbank landet ganz oben.

## 3. Persistence-Test

Da wir PGlite mit `opfs://` konfiguriert haben, bleiben deine Daten im Browser gespeichert — selbst wenn der Server stoppt oder die Seite neu geladen wird.

1. Lade die Seite im Browser neu, z. B. mit **F5** oder **Strg + R**.
2. Gib direkt im Suchfeld ohne neues Anlegen von Dokumenten **Heißgetränk** ein und klicke auf **Suchen**.

Du solltest sofort wieder dein Kaffee-Dokument als Treffer sehen. Die Daten liegen persistent im lokalen Browser-Speicher.