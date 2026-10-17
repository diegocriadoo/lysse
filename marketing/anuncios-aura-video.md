# Lyssé Aura: 10 anuncios en vídeo

Serie de 10 anuncios verticales (9:16, 15-25 s) para Meta Ads (Reels/Stories) y TikTok, pensados para el cepillo alisador inalámbrico **Lyssé Aura**.

Cada anuncio trae:

- **Ángulo y hook** (los 2 primeros segundos).
- **Guion por escenas**: lo que se ve, el texto en pantalla y la voz en off.
- **Prompt de imagen (Omni Flash)**: el fotograma inicial de cada escena.
- **Prompt de vídeo (Grok Imagine)**: cómo animar ese fotograma (imagen → vídeo).
- **Copy del anuncio**: texto principal, titular y CTA.

Los prompts de imagen y vídeo van en inglés porque los dos modelos responden mejor así. Los textos en pantalla y la voz en off van en español y se añaden en el montaje (CapCut, Premiere…), **no** dentro de la imagen: los modelos generan mal el texto.

---

## 1. Flujo de trabajo para que las imágenes sean consecuentes

El problema típico de los anuncios hechos con IA es que el producto o la modelo cambian de una escena a otra. Para evitarlo:

1. **Imagen de referencia del producto.** Sube a Omni Flash, en **todas** las generaciones, la foto limpia del producto que ya está en la tienda (`Gemini_Generated_Image_98hi2p98hi2p98hi.jpg`: cepillo completo con púas, pantalla y botón). Pide siempre "keep the product exactly as in the reference image".
2. **Una modelo por anuncio.** Genera primero la escena 1 de cada anuncio. En las escenas siguientes del mismo anuncio, sube también esa imagen como referencia de personaje ("same woman as in reference image 2, same hair, same outfit").
3. **Pega el bloque fijo del producto** (abajo) al final de cada prompt de imagen.
4. **Fotograma → vídeo en Grok Imagine.** Sube a Grok la imagen de Omni Flash y usa el prompt de movimiento. Clips de 6 s, formato 9:16. Pide movimientos de cámara suaves: los movimientos bruscos deforman el producto.
5. **Revisa cada clip**: la pantalla debe marcar 160, 180 o 200 °C (nunca otra cifra), el cepillo no debe tener cable y las púas deben seguir siendo negras con reflejos violetas. Si algo cambia, regenera o recorta el clip.
6. **Montaje**: une los clips, añade textos, voz en off (o subtítulos) y música en tendencia. Termina siempre con el plano de cierre de marca (escena "Cierre" común, abajo).

### Bloque fijo del producto (pegar en cada prompt de imagen)

```
PRODUCT: Lyssé Aura cordless hair straightening brush, exactly as in the reference image:
matte black ABS body, compact handheld size, brush head with black bristles with subtle violet
reflections, small digital display on the handle, one single front button, NO cable, NO cord,
NO plug. Keep the product shape, colours and proportions identical to the reference.
```

### Estilo visual común (pegar también)

```
STYLE: vertical 9:16, photorealistic, shot on iPhone 15 Pro look for UGC scenes / soft studio
light for product scenes, natural skin texture, warm neutral tones with subtle violet accents,
shallow depth of field, no text, no logos except the product itself, no watermark.
```

### Escena "Cierre" común (últimos 3 s de todos los anuncios)

- **Visual**: Aura sobre un tocador de mármol claro, pantalla encendida a 200 °C, luz suave lateral.
- **Texto en pantalla**: "Lyssé Aura · Envío gratis · 30 días para devolverlo" + `lyssestyle.com`
- **Omni Flash**:
  ```
  Product hero shot: the Lyssé Aura brush lying diagonally on a light beige marble vanity,
  digital display glowing showing "200", soft side window light, a few out-of-focus
  skincare bottles in the background, lots of empty space at the top third for text.
  [PRODUCT] [STYLE]
  ```
- **Grok Imagine**:
  ```
  Slow push-in towards the brush, the display glow pulses softly, light shifts gently across
  the marble. Product stays perfectly still and unchanged. 6 seconds, 9:16.
  ```

---

## 2. Los 10 anuncios

### Anuncio 1: "El enchufe está en la otra punta"

- **Ángulo**: problema → solución (dependencia del enchufe).
- **Duración**: ~18 s
- **Hook**: "Si tu enchufe está lejos del espejo, mira esto."

| # | Visual | Texto en pantalla | Voz en off |
|---|---|---|---|
| 1 | Chica agachada junto a un enchufe bajo, con la plancha de cable estirado sin llegar al espejo | "Cuando el cable no llega al espejo…" | "¿Te peinas agachada junto al enchufe?" |
| 2 | Misma chica, de pie frente al espejo, sacando Aura del cajón | "Aura: sin cables" | "Yo ya no." |
| 3 | Pasa el cepillo de la raíz a las puntas frente al espejo | "Lista en unos 20 s" | "Se calienta en unos 20 segundos y te peinas donde quieras." |
| 4 | Cierre común | | "Lyssé Aura. Tu pelo, sin cables." |

**Omni Flash**

1. ```
   UGC photo in a small bathroom: a young woman with frizzy shoulder-length brown hair
   crouching awkwardly next to a low wall socket, holding a corded flat iron whose cable is
   stretched tight and doesn't reach the mirror, frustrated expression, morning light.
   [STYLE]
   ```
2. ```
   Same woman as in reference image 2 (same face, hair and grey t-shirt), now standing
   relaxed in front of the bathroom mirror, pulling the Lyssé Aura brush out of a drawer,
   slight smile. [PRODUCT] [STYLE]
   ```
3. ```
   Same woman as in reference image 2, mirror selfie angle, brushing a section of her hair
   from root to tip with the Lyssé Aura brush, the brushed section visibly smoother and
   shinier, display showing "180". [PRODUCT] [STYLE]
   ```

**Grok Imagine**

1. `Handheld camera, she tugs the cord, it pulls taut, she sighs and looks at the camera. Subtle shake. 6 s, 9:16.`
2. `She opens the drawer, lifts the cordless brush and turns towards the mirror. Camera slowly follows her hand. No cable appears. 6 s, 9:16.`
3. `Slow continuous brushing motion from root to tip, hair glides through the bristles and falls smooth. Static camera, slight natural sway. 6 s, 9:16.`

**Copy**

- **Texto principal**: Tu rutina no siempre pasa por un enchufe. Aura es un cepillo alisador inalámbrico: lo enciendes, eliges 160, 180 o 200 °C y en unos 20 segundos está listo. Frente a cualquier espejo. Envío gratis a península y Baleares.
- **Titular**: Alisa tu pelo sin cables
- **CTA**: Comprar

---

### Anuncio 2: "Retoque en el coche"

- **Ángulo**: momento de uso (antes de una cita o reunión).
- **Duración**: ~16 s
- **Hook**: "5 minutos antes de la reunión y el pelo así…"

| # | Visual | Texto en pantalla | Voz en off |
|---|---|---|---|
| 1 | Mujer en el asiento del conductor, coche aparcado, mirándose en el espejo del parasol con el pelo encrespado | "5 min antes de la reunión 😩" | "Llegas, te miras… y el pelo así." |
| 2 | Saca Aura del bolso, la enciende, la pantalla marca 160 | "Del bolso al pelo" | "La saco del bolso, elijo temperatura…" |
| 3 | Se peina mirando el espejo del parasol | "Retoque en segundos" | "…y un par de pasadas." |
| 4 | Sale del coche segura, pelo arreglado | "Lista ✨" | "Y lista." |
| 5 | Cierre común | | |

**Omni Flash**

1. ```
   UGC photo inside a parked car, daylight: a woman in her 30s in a blazer, sitting in the
   driver's seat, looking at the sun visor mirror, her long dark hair frizzy and messy,
   worried expression. [STYLE]
   ```
2. ```
   Same woman as in reference image 2, same blazer and car interior, taking the Lyssé Aura
   brush out of a tan leather handbag on the passenger seat, display lit showing "160".
   [PRODUCT] [STYLE]
   ```
3. ```
   Same woman as in reference image 2, brushing her hair with the Lyssé Aura brush while
   looking in the sun visor mirror, the brushed side noticeably smoother. [PRODUCT] [STYLE]
   ```
4. ```
   Same woman as in reference image 2, stepping out of the car in an office parking lot,
   hair now sleek and tidy, confident smile, handbag on her shoulder. [STYLE]
   ```

**Grok Imagine**

1. `She tucks a frizzy strand behind her ear, it springs back, she rolls her eyes. Slight handheld movement. 6 s, 9:16.`
2. `She pulls the brush out of the bag and presses the single front button, the display lights up. Close, steady camera. 6 s, 9:16.`
3. `Two smooth brushing strokes from root to tip, she checks the mirror and nods. 6 s, 9:16.`
4. `She closes the car door and walks towards the camera, hair moving smoothly. Slow tracking shot backwards. 6 s, 9:16.`

**Copy**

- **Texto principal**: Para los retoques de última hora. Aura cabe en tu bolso, no necesita enchufe y se calienta en unos 20 segundos. Cada carga da para unos 40 minutos de uso.
- **Titular**: Tu retoque, donde estés
- **CTA**: Comprar

---

### Anuncio 3: "Cuenta atrás de 20 segundos"

- **Ángulo**: rapidez (mañanas con prisa).
- **Duración**: ~15 s
- **Hook**: un cronómetro de 20 s en pantalla desde el primer fotograma.

| # | Visual | Texto en pantalla | Voz en off |
|---|---|---|---|
| 1 | Mano pulsando el botón de Aura sobre el lavabo; contador "00:20" superpuesto | "00:20" (cuenta atrás) | "Mañana con prisa. Enciendo Aura." |
| 2 | Primer plano de la pantalla subiendo hasta 200 | "Elige 160 · 180 · 200 °C" | "Elijo temperatura…" |
| 3 | Mientras termina la cuenta, ella se lava los dientes / se pone la chaqueta | "00:05…" | "…y mientras termino de arreglarme…" |
| 4 | Contador a 00:00; empieza a peinarse | "¡Lista!" | "…ya está lista." |
| 5 | Cierre común | | |

**Omni Flash**

1. ```
   Close-up overhead photo: a woman's hand with natural nails pressing the front button of
   the Lyssé Aura brush resting on a white bathroom sink, toothbrush and coffee mug nearby,
   early morning light. [PRODUCT] [STYLE]
   ```
2. ```
   Macro product photo of the Lyssé Aura handle, digital display glowing showing "200",
   shallow depth of field, violet reflections on the bristles in the background.
   [PRODUCT] [STYLE]
   ```
3. ```
   UGC photo, a young woman with long wavy blonde hair putting on a denim jacket in a bright
   bedroom, the Lyssé Aura brush lying on the dresser with display lit. [PRODUCT] [STYLE]
   ```
4. ```
   Same woman as in reference image 2, in front of the bedroom mirror brushing her hair
   with the Lyssé Aura brush, the brushed section straight and glossy. [PRODUCT] [STYLE]
   ```

**Grok Imagine**

1. `Finger presses the button, the display lights up instantly. Static top-down camera. 6 s, 9:16.`
2. `Very slow macro dolly across the display while the glow brightens. The number stays "200". 6 s, 9:16.`
3. `She slips the jacket on quickly and glances at the brush. Natural handheld. 6 s, 9:16.`
4. `She picks up the brush and does one long brushing stroke, hair falls straight. 6 s, 9:16.`

**Copy**

- **Texto principal**: Lo que tardas en ponerte la chaqueta. Aura alcanza la temperatura en unos 20 segundos y peina mientras alisa. Tres temperaturas: 160, 180 y 200 °C.
- **Titular**: Lista en unos 20 segundos
- **CTA**: Comprar

---

### Anuncio 4: "Lo que llevo en el neceser"

- **Ángulo**: viajes (portabilidad).
- **Duración**: ~20 s
- **Hook**: "Lo único que no falta en mi maleta."

| # | Visual | Texto en pantalla | Voz en off |
|---|---|---|---|
| 1 | Maleta abierta sobre la cama, manos metiendo ropa doblada y un neceser | "Haciendo la maleta ✈️" | "Lo único que no falta en mi maleta…" |
| 2 | Mete Aura y su cable USB en el neceser | "Ocupa muy poco" | "…es Aura. Ocupa casi nada." |
| 3 | Habitación de hotel; ella se peina frente al espejo | "En el hotel, sin buscar enchufe" | "Y en el hotel, ni busco enchufe." |
| 4 | Selfie en un balcón con vistas, pelo liso | "Pelo perfecto de viaje" | |
| 5 | Cierre común | | |

**Omni Flash**

1. ```
   Overhead UGC photo of an open beige suitcase on a white bed, folded clothes, sunglasses,
   a passport and a small pink toiletry bag, woman's hands placing a folded sweater, soft
   daylight. [STYLE]
   ```
2. ```
   Close-up: woman's hands placing the Lyssé Aura brush and a coiled USB charging cable
   into a small pink toiletry bag next to the suitcase, the brush itself has no cord
   attached. [PRODUCT] [STYLE]
   ```
3. ```
   UGC photo, a woman with long chestnut hair in a hotel room with a big window, standing
   at the vanity mirror brushing her hair with the Lyssé Aura brush, travel vibe.
   [PRODUCT] [STYLE]
   ```
4. ```
   Same woman as in reference image 2, selfie on a sunny hotel balcony with a Mediterranean
   town view, hair sleek and shiny, happy expression. [STYLE]
   ```

**Grok Imagine**

1. `Hands quickly drop clothes into the suitcase, fast but smooth top-down view. 6 s, 9:16.`
2. `Hands tuck the brush into the bag and zip it closed. Static top-down camera. 6 s, 9:16.`
3. `She brushes slowly from root to tip, hair glides smoothly, warm sunlight flickers. 6 s, 9:16.`
4. `She turns her head, hair swings and falls smooth, she smiles at the camera. 6 s, 9:16.`

**Copy**

- **Texto principal**: Pequeña, ligera e inalámbrica: Aura va contigo de viaje, al trabajo o al gimnasio. Se carga con USB en unas 2 horas y puedes usarla mientras se carga.
- **Titular**: Tu pelo perfecto, también de viaje
- **CTA**: Comprar

---

### Anuncio 5: "Del gimnasio a la oficina"

- **Ángulo**: estilo de vida activo.
- **Duración**: ~16 s
- **Hook**: "Salgo del gym a las 8:40 y entro a trabajar a las 9."

| # | Visual | Texto en pantalla | Voz en off |
|---|---|---|---|
| 1 | Vestuario de gimnasio; ella sale con coleta y pelo húmedo/encrespado | "8:40 · salgo del gym" | "Salgo del gym a las ocho cuarenta…" |
| 2 | Suelta la coleta, saca Aura de la bolsa de deporte | "Sin pelearme por el enchufe" | "…y no me peleo por el único enchufe del vestuario." |
| 3 | Se peina en el espejo del vestuario | | |
| 4 | Entrando a la oficina con el pelo arreglado | "9:00 ✔️" | "A las nueve, lista." |
| 5 | Cierre común | | |

**Omni Flash**

1. ```
   UGC photo in a modern gym locker room, a sporty woman in her late 20s with a messy
   ponytail and slightly frizzy hair, wearing leggings and a sports top, gym bag on the
   bench. [STYLE]
   ```
2. ```
   Same woman as in reference image 2, now in casual office clothes, letting her hair down
   and pulling the Lyssé Aura brush out of her black gym bag. [PRODUCT] [STYLE]
   ```
3. ```
   Same woman as in reference image 2, at the locker room mirror brushing her hair with the
   Lyssé Aura brush, other lockers blurred behind her. [PRODUCT] [STYLE]
   ```
4. ```
   Same woman as in reference image 2, walking into a bright modern office, hair sleek,
   holding a coffee cup. [STYLE]
   ```

**Grok Imagine**

1. `She closes her locker and pulls the hair tie out, hair falls messy. 6 s, 9:16.`
2. `She takes the brush from the bag and switches it on with the front button. 6 s, 9:16.`
3. `Quick confident brushing strokes, hair turns smooth. Handheld mirror angle. 6 s, 9:16.`
4. `Slow-motion walk towards camera, hair bouncing smoothly. Tracking backwards. 6 s, 9:16.`

**Copy**

- **Texto principal**: Del entreno a la reunión sin depender del enchufe del vestuario. Aura: cepillo alisador inalámbrico con 3 temperaturas y unos 40 minutos de uso por carga.
- **Titular**: Del gym a la oficina en minutos
- **CTA**: Comprar

---

### Anuncio 6: "Día de lluvia, pelo de lluvia"

- **Ángulo**: frizz y humedad.
- **Duración**: ~15 s
- **Hook**: "Llueve 5 minutos y mi pelo hace esto."

| # | Visual | Texto en pantalla | Voz en off |
|---|---|---|---|
| 1 | Chica entra en un portal/cafetería con el pelo mojado y encrespado, paraguas en mano | "Llueve 5 minutos… 🌧️" | "Llueve cinco minutos y mi pelo hace esto." |
| 2 | En el baño de la cafetería, saca Aura | "Plan B: Aura" | "Así que siempre llevo esto." |
| 3 | Plano partido: mitad encrespada, mitad peinada | "Una pasada" | "Una pasada y el encrespamiento se calma." |
| 4 | Sale a la calle sonriendo bajo el paraguas | | |
| 5 | Cierre común | | |

**Omni Flash**

1. ```
   UGC photo, a woman with curly-frizzy long dark hair entering a cozy café doorway on a
   rainy day, closing a wet transparent umbrella, raindrops on her coat, frizz clearly
   visible. [STYLE]
   ```
2. ```
   Same woman as in reference image 2, in a small café restroom with warm lighting, holding
   the Lyssé Aura brush up near her face, display showing "180". [PRODUCT] [STYLE]
   ```
3. ```
   Same woman as in reference image 2, mirror shot: the left half of her hair still frizzy,
   the right half brushed smooth and shiny, she is brushing the right side with the Lyssé
   Aura brush. [PRODUCT] [STYLE]
   ```
4. ```
   Same woman as in reference image 2, walking out onto a rainy city street under her
   umbrella, hair smooth, smiling. [STYLE]
   ```

**Grok Imagine**

1. `She shakes the umbrella and touches her frizzy hair, annoyed. Rain falls outside. 6 s, 9:16.`
2. `She lifts the brush, presses the button, display lights up. Static camera. 6 s, 9:16.`
3. `She does one slow stroke on the right side, the smooth side catches the light. 6 s, 9:16.`
4. `She walks away under the umbrella, then turns and smiles. Rain, gentle camera follow. 6 s, 9:16.`

**Copy**

- **Texto principal**: Para los días en los que la humedad gana la batalla. Aura combina púas con diseño anti-quemaduras y tecnología de iones negativos: peina y alisa a la vez.
- **Titular**: Calma el frizz en cualquier lugar
- **CTA**: Comprar

> Nota: no prometer "elimina el frizz para siempre". Quédate en "ayuda a calmar / dejar el pelo más ordenado", como en la web.

---

### Anuncio 7: "Aura frente a la plancha"

- **Ángulo**: comparativa.
- **Duración**: ~20 s
- **Hook**: pantalla partida en dos: "Plancha de cable" vs "Aura".

| # | Visual (pantalla partida) | Texto en pantalla | Voz en off |
|---|---|---|---|
| 1 | Izq.: plancha con cable enredado · Der.: Aura en la mano | "Plancha vs Aura" | "Plancha de toda la vida o Aura." |
| 2 | Izq.: buscando enchufe · Der.: peinándose frente a cualquier espejo | "Enchufe ❌ / Donde quieras ✅" | "Una necesita enchufe. La otra no." |
| 3 | Izq.: pelo + peine + plancha (dos herramientas) · Der.: cepillo que peina y alisa | "Peina y alisa a la vez" | "Y Aura peina mientras alisa." |
| 4 | Izq.: plancha no cabe en el bolso · Der.: Aura entra en el bolso | "Cabe en tu bolso" | |
| 5 | Cierre común | | "¿Tú cuál eliges?" |

**Omni Flash** (genera cada lado por separado y únelos en el montaje)

1. a) `Close-up: a woman's hands struggling with a tangled black cable of a classic flat iron on a bathroom counter, cluttered. [STYLE]`
   b) `Close-up: the same woman's hands holding the Lyssé Aura brush, clean counter, no cables anywhere. [PRODUCT] [STYLE]`
2. a) `Woman bending under a desk looking for a wall socket, holding a corded flat iron. [STYLE]`
   b) `Same woman brushing her hair with the Lyssé Aura brush in front of a hallway mirror far from any socket. [PRODUCT] [STYLE]`
3. a) `Woman holding a comb in one hand and a flat iron in the other, juggling. [STYLE]`
   b) `Same woman brushing through her hair with only the Lyssé Aura brush, effortless. [PRODUCT] [STYLE]`
4. a) `A bulky flat iron with long cable not fitting in a small handbag. [STYLE]`
   b) `The Lyssé Aura brush fitting neatly in the same small handbag. [PRODUCT] [STYLE]`

**Grok Imagine**: anima cada mitad por separado con movimientos breves: `Short natural action, steady camera, 4 s, 9:16.` (cable que se enreda / pasada fluida / bolso que no cierra / bolso que cierra).

**Copy**

- **Texto principal**: Plancha de placas con cable o cepillo alisador inalámbrico. Aura se calienta en unos 20 segundos, peina mientras alisa y va contigo en el bolso.
- **Titular**: Olvídate del cable
- **CTA**: Más información

> Nota: comparativa genérica frente a planchas con cable, igual que en la web. No nombrar marcas de la competencia.

---

### Anuncio 8: "Unboxing"

- **Ángulo**: qué incluye / regalo.
- **Duración**: ~18 s
- **Hook**: "Abrid conmigo lo que me ha llegado."

| # | Visual | Texto en pantalla | Voz en off |
|---|---|---|---|
| 1 | Caja de envío sobre una mesa, manos abriéndola | "Unboxing 📦" | "Me ha llegado Aura, vamos a abrirla." |
| 2 | Disposición flat-lay del contenido: cepillo, cable USB, 2 pinzas, peine de púa | "Cepillo + cable USB + 2 pinzas + peine" | "Trae el cepillo, el cable USB, dos pinzas y un peine de púa." |
| 3 | Mano enciende el cepillo; pantalla a 160 | "3 temperaturas" | "Tres temperaturas, pantalla digital…" |
| 4 | Primera pasada frente al espejo | "Primera prueba" | "…y primera prueba." |
| 5 | Cierre común | | |

**Omni Flash**

1. ```
   Overhead UGC photo, woman's hands opening a plain kraft shipping box on a light wooden
   table, tissue paper visible, cozy daylight. [STYLE]
   ```
2. ```
   Clean flat lay on a beige linen surface: the Lyssé Aura brush in the centre, a coiled
   white USB charging cable, two black hair sectioning clips and a black rat-tail comb,
   neatly arranged, soft shadows. [PRODUCT] [STYLE]
   ```
3. ```
   Close-up of a hand holding the Lyssé Aura brush, thumb on the front button, display
   glowing showing "160". [PRODUCT] [STYLE]
   ```
4. ```
   UGC mirror photo, a young woman with long wavy auburn hair doing her first brush stroke
   with the Lyssé Aura brush, curious expression. [PRODUCT] [STYLE]
   ```

**Grok Imagine**

1. `Hands lift the lid and pull back the tissue paper. Top-down static. 6 s, 9:16.`
2. `Very slow overhead rotation of the flat lay, items stay perfectly still. 6 s, 9:16.`
3. `Thumb presses the button, the display lights up. Slow push-in. 6 s, 9:16.`
4. `One long brushing stroke, she raises her eyebrows pleasantly surprised. 6 s, 9:16.`

**Copy**

- **Texto principal**: Todo lo que necesitas en una caja: cepillo alisador Lyssé Aura, cable de carga USB, 2 pinzas para separar el pelo y un peine de púa. Envío gratis a península y Baleares.
- **Titular**: Todo listo para estrenar
- **CTA**: Comprar

---

### Anuncio 9: "Cada detalle" (producto, estilo ASMR)

- **Ángulo**: calidad y diseño (sin modelo, solo producto).
- **Duración**: ~15 s, sin voz: sonidos de clic, zumbido suave y música lo-fi.
- **Hook**: macro de las púas con reflejos violetas girando en la oscuridad.

| # | Visual | Texto en pantalla |
|---|---|---|
| 1 | Macro de las púas con reflejos violetas | "Púas con diseño anti-quemaduras" |
| 2 | Macro de la pantalla cambiando 160 → 180 → 200 | "160 · 180 · 200 °C" |
| 3 | Dedo pulsando el botón frontal (clic) | "Un solo botón" |
| 4 | Cepillo girando sobre un pedestal | "Inalámbrico. Portátil." |
| 5 | Cierre común | |

**Omni Flash**

1. ```
   Extreme macro product photo of the Lyssé Aura brush bristles, black bristles with violet
   light reflections, dark moody studio background, rim light in violet. [PRODUCT]
   ```
2. ```
   Macro of the Lyssé Aura digital display glowing showing "180", dark background, crisp
   detail of the matte black ABS texture. [PRODUCT]
   ```
3. ```
   Macro: a fingertip pressing the single front button of the Lyssé Aura brush, dark studio
   background, violet rim light. [PRODUCT]
   ```
4. ```
   The Lyssé Aura brush standing upright on a small matte black cylinder pedestal, dark
   gradient background, violet rim light, premium tech product shot. [PRODUCT]
   ```

**Grok Imagine**

1. `Slow macro slide along the bristles, violet highlights travel across them. 6 s, 9:16.`
2. `The display changes from 160 to 180 to 200, slow push-in, everything else still. 4 s, 9:16.`
3. `Fingertip presses the button, display lights up. 3 s, 9:16.`
4. `The brush rotates slowly 180 degrees on the pedestal, perfectly stable shape. 6 s, 9:16.`

> Revisa el clip 2 con cuidado: si Grok inventa otros números, genera tres imágenes fijas (160, 180, 200) con Omni Flash y encadénalas con un corte rápido en el montaje.

**Copy**

- **Texto principal**: Pantalla digital para ver la temperatura de un vistazo, un único botón fácil de alcanzar y púas con protección anti-quemaduras e iones negativos. Así es Aura.
- **Titular**: Cada detalle, pensado para ti
- **CTA**: Comprar

---

### Anuncio 10: "Antes y después de una pasada" + oferta

- **Ángulo**: resultado + reducción de riesgo (envío gratis y 30 días para devolverlo).
- **Duración**: ~20 s
- **Hook**: "Una sola pasada. Mira."

| # | Visual | Texto en pantalla | Voz en off |
|---|---|---|---|
| 1 | Primer plano de un mechón encrespado | "Antes" | "Una sola pasada. Mira." |
| 2 | El cepillo recorre el mechón lentamente | | |
| 3 | El mismo mechón liso y brillante | "Después" | "Así." |
| 4 | Plano medio: ella sonríe y mueve el pelo | "Envío gratis · 30 días para devolverlo" | "Envío gratis y treinta días para devolverlo si no te convence." |
| 5 | Cierre común | | "Pruébala." |

**Omni Flash**

1. ```
   Close-up beauty photo of a single section of frizzy, dry-looking brown hair held between
   two fingers, soft neutral background, natural light. [STYLE]
   ```
2. ```
   Same hair section as in reference image 2, the Lyssé Aura brush halfway down the section,
   the part above the brush smooth and glossy, the part below still frizzy. [PRODUCT] [STYLE]
   ```
3. ```
   Same hair section as in reference image 2, now fully smooth, straight and shiny,
   catching the light. [STYLE]
   ```
4. ```
   Medium shot of a smiling woman with long sleek brown hair (same hair colour as reference
   image 2), flipping her hair over her shoulder, bright bedroom background. [STYLE]
   ```

**Grok Imagine**

1. `Fingers slightly move the frizzy strand, static macro camera. 3 s, 9:16.`
2. `The brush glides slowly from root to tip along the strand, hair turns smooth behind it. 6 s, 9:16.`
3. `The smooth strand is released and falls, catching light. 3 s, 9:16.`
4. `She flips her hair, it falls smoothly, she laughs. Slight slow motion. 6 s, 9:16.`

**Copy**

- **Texto principal**: Antes y después de una pasada. Aura alisa y peina a la vez, sin cables. Envío gratis a la España peninsular y Baleares y 30 días para devolverlo.
- **Titular**: Pruébala 30 días
- **CTA**: Comprar

---

## 3. Checklist antes de publicar

- [ ] El producto es igual en todas las escenas (negro mate, púas negras con reflejos violetas, sin cable).
- [ ] La pantalla solo muestra 160, 180 o 200.
- [ ] Las afirmaciones coinciden con la web: unos 20 s de calentamiento, unos 40 min de batería, carga USB en unas 2 h, envío gratis a península y Baleares (10-15 días laborables), 30 días de devolución.
- [ ] Nada de "elimina el frizz para siempre", "no quema nunca" ni promesas médicas o capilares.
- [ ] Las escenas tipo UGC son recreaciones con IA: no presentarlas como opiniones reales de clientes. Si quieres testimonios, usa solo opiniones reales y autorizadas.
- [ ] Meta exige etiquetar el contenido realista generado con IA cuando corresponde: activa la etiqueta de "IA" si la plataforma lo pide.
- [ ] Subtítulos siempre activados (la mayoría ve los Reels sin sonido).

## 4. Propuesta de test

Lanza los 10 anuncios en un mismo conjunto (Advantage+ o CBO) con el mismo copy base durante 3-4 días y deja que el algoritmo reparta. Después, quédate con los 3 mejores hooks por CTR y tasa de reproducción de 3 s, y crea variantes de esos cambiando solo el hook (primeros 2 s).
