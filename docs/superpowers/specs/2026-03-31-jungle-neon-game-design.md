# Jungle Neon — Game Design Spec

Single-page HTML hra. Side-scrolling akce v neonové džungli. Hráč zabíjí brouky a dinosaury.

## Technologie

- Jeden HTML soubor, žádné závislosti
- Canvas 2D API pro rendering
- `requestAnimationFrame` game loop
- Neonové efekty přes `shadowBlur` / `shadowColor`

## Herní svět

- Nekonečně scrollující side-scroller (zleva doprava)
- Kamera sleduje hráče
- Procedurálně generovaný terén: rovná platforma s mezerami a výstupky
- Kusy terénu se přidávají napravo, staré se odstraňují nalevo mimo kameru
- 3 parallax vrstvy pozadí:
  1. Vzdálená (10% scroll speed): hvězdy/tečky
  2. Střední (40%): siluety stromů/hor, neonový obrys
  3. Blízká (70%): vegetace, liány, neonové detaily

## Hráč

- Neonová zelená silueta (#4CAF50) se záříním
- 3 životy, při zásahu krátká nesmrtelnost (blikání)

### Pohyb

- Šipky doleva/doprava: běh (konstantní rychlost)
- Šipka nahoru: skok (jednoduchý, žádný double jump)
- Gravitace a kolize s terénem
- Automatické otáčení podle směru pohybu

### Útoky

- **Z — melee**: krátký dosah, neonový zlatý oblouk (#FFD700), cooldown 0.3s
  - Účinný na brouky (1 hit kill)
  - Na dinosaury dává 1 dmg
- **X — střelba**: cyan projektil (#00BCD4) dopředu, cooldown 0.5s
  - Na dinosaury dává 2 dmg (2 zásahy = kill)
  - Na brouky funguje taky (1 hit kill), ale méně efektivní z hlediska cooldownu

## Nepřátelé

### Brouci (roháč obecný)

- Silueta roháče: oválné tělo s výrazným rohem/parožím dopředu, 6 nožiček
- Červený neon (#f44336)
- Malí, rychlí, pohybují se po zemi
- Spawní se napravo mimo obrazovku, běží směrem k hráči
- 1 HP
- 10 bodů za zabití
- Frekvence spawnu se postupně zvyšuje

### Dinosauři (T-Rex)

- Silueta T-Rexe: velká hlava, malé přední tlapky, masivní zadní nohy, ocas
- Oranžový neon (#ff5722)
- Větší, pomalejší
- Spawní se napravo, pomalu se přibližují
- 3 HP
- 50 bodů za zabití
- Začínají se objevovat po ~30s hry

### Společné chování

- Kontakt s hráčem ubere 1 život
- Při smrti: neonový explozní efekt (8-12 částic v barvě nepřítele)
- Pokud odejdou z levé strany obrazovky, zmizí

## Skóre a obtížnost

### HUD

- Vlevo: neonová srdíčka (životy)
- Uprostřed: skóre (neonové číslice)
- Vpravo: uběhnutá vzdálenost v metrech

### Bodování

- Brouk: 10 bodů
- Dinosaurus: 50 bodů
- Vzdálenost: 1 bod za metr

### Obtížnost (podle uběhnuté vzdálenosti)

- 0–500m: hlavně brouci, občas dinosaurus
- 500–1500m: víc brouků, pravidelní dinosauři
- 1500m+: hustý spawn obou, brouci ve skupinkách

### Game Over

- Ztráta všech 3 životů
- Obrazovka s finálním skóre
- "Press ENTER to restart"
- High score uložené v localStorage

## Vizuální styl

### Barevná paleta

| Element | Barva | Hex |
|---------|-------|-----|
| Pozadí | Černá | #0a0a0a |
| Hráč | Zelený neon | #4CAF50 |
| Brouci | Červený neon | #f44336 |
| Dinosauři | Oranžový neon | #ff5722 |
| Projektily | Cyan | #00BCD4 |
| Melee oblouk | Zlatý | #FFD700 |
| Terén | Zelený neon (nižší intenzita) | #4CAF50 |

### Efekty

- `shadowBlur` + `shadowColor` na všech objektech pro neon glow
- Smrt nepřítele: výbuch částic (8-12 teček, rozletí se a zmizí)
- Zásah hráče: blikání + screen shake
- Projektily: tail efekt (postupně mizící kopie za projektilem)

### Zvuk

Žádný. Čistě vizuální hra.

## Ovládání

| Klávesa | Akce |
|---------|------|
| ← → | Pohyb doleva/doprava |
| ↑ | Skok |
| Z | Melee útok |
| X | Střelba |
| ENTER | Restart (na game over obrazovce) |
