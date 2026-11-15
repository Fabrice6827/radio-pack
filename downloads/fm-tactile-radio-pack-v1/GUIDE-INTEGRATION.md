# Guide d'intégration — FM Tactile Radio UI (v1.0)

Merci d'avoir acquis le pack **FM Tactile Radio UI** conçu par **L'Atelier Fab Design**.
Ce pack contient **6 thèmes complets** fonctionnant sans aucune dépendance externe (HTML5, CSS3 et JavaScript Vanilla).

---

## 1. Contenu de l'archive

* `01-neon-glass.html` à `06-noyer-ambre-chaud.html` : 6 fichiers autonomes prêts à ouvrir dans votre navigateur ou à copier-coller directement dans un bloc HTML personnalisé.
* `modular/` :
  * `radio-core.css` : la structure géométrique et les animations du composant.
  * `themes.css` : les 6 habillages visuels isolés.
  * `radio.js` : le moteur audio et tactile (multi-instances sans conflit).
  * `exemple-integration.html` : un exemple prêt à l'emploi combinant les fichiers modulaires.
* `LICENCE-COMMERCIALE.txt` : vos droits d'utilisation illimitée pour projets personnels et clients.

---

## 2. Programmer vos propres radios (3 attributs HTML)

Vous n'avez **pas besoin de toucher au JavaScript** pour modifier les stations. Chaque bouton `.row` lit directement ses propres attributs :

```html
<button type="button" class="row" role="radio" aria-checked="true"
        data-name="FIP Groove"
        data-freq="105.1 FM"
        data-stream="https://icecast.radiofrance.fr/fipgroove-midfi.mp3">
  <span>FIP Groove</span><span class="f">105.1</span>
</button>
```

* **`data-name`** : le nom affiché dans l'écran principal lors de la sélection.
* **`data-freq`** : la fréquence affichée (entre `96.0 FM` et `108.0 FM`). L'aiguille analogique et les 30 barres de l'égaliseur calculent automatiquement leur position à partir de cette valeur.
* **`data-stream`** : l'URL directe du flux audio (**HTTPS obligatoire**) au format **MP3**, **AAC** ou **OGG** (ou un fichier `.mp3` pour diffuser un podcast ou une playlist).

> **Important :** Pour éviter tout blocage par les navigateurs modernes (*Mixed Content*), utilisez toujours des flux commençant par `https://`. Évitez les flux HLS (`.m3u8`) qui ne sont pas pris en charge nativement par Chrome/Firefox sans bibliothèque externe.

---

## 3. Intégrer sur votre plateforme

### Webflow / Framer / WordPress / Shopify
1. Ajoutez un bloc **Embed / Custom Code / HTML personnalisé** à l'endroit souhaité.
2. Ouvrez le fichier HTML du thème choisi (ex. `04-bleu-marine-laiton.html`).
3. Copiez la balise `<style>...</style>` (sans la règle `html, body` de centrage), le bloc `<div class="radio-bg ...">...</div>` et la balise `<script>...</script>`, puis collez-les dans votre bloc personnalisé.

### Projet Web standard / React / Vue / Next.js
1. Importez `modular/radio-core.css` et `modular/themes.css` dans votre feuille de style globale.
2. Insérez la structure HTML `<div class="radio-bg theme-oled-dark">...</div>` avec la classe du thème souhaité :
   * `theme-neon-glass`
   * `theme-oled-dark`
   * `theme-brushed-alu`
   * `theme-navy-brass`
   * `theme-e-ink`
   * `theme-walnut-amber`
3. Chargez `modular/radio.js` une seule fois en fin de page. Si plusieurs lecteurs sont présents sur la même page, lancer la lecture sur l'un met automatiquement les autres en pause.

---

## 4. Ajouter ou retirer une station

Par défaut, chaque lecteur affiche 3 stations (hauteur totale `280px`).
Si vous ajoutez une 4e ligne `<button class="row">`, passez simplement la hauteur de `.radio-bg` à `340px` et celle de `.radio-bg .radio` à `320px` dans le CSS.
