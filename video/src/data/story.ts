// Guió del vídeo (versió sense locució): escenes en compassos i missatges en pantalla.
// Tot es mesura en temps musicals; music.json diu el tempo i on cau el primer compàs.
import music from "./music.json";

export const FPS = 30;
export const BPM: number = music.bpm;
export const BEAT = 60 / BPM;
export const BAR = BEAT * 4;
export const OFFSET: number = music.offset; // s fins al primer temps fort

export type SceneId =
  | "hook" | "numbers" | "sale" | "rent" | "legal" | "shopper" | "marketing" | "values" | "team" | "closing";

export type Theme = "dark" | "light";
export const SCENE_BARS: { id: SceneId; bars: number; theme: Theme }[] = [
  { id: "hook", bars: 4, theme: "dark" },
  { id: "numbers", bars: 4, theme: "dark" },
  { id: "sale", bars: 5, theme: "light" },
  { id: "rent", bars: 4, theme: "dark" },
  { id: "legal", bars: 3, theme: "light" },
  { id: "shopper", bars: 3, theme: "light" },
  { id: "marketing", bars: 9, theme: "dark" },
  { id: "values", bars: 4, theme: "light" },
  { id: "team", bars: 4, theme: "dark" },
  { id: "closing", bars: 5, theme: "light" },
];

/**
 * Missatges en pantalla (substitueixen la locució). `at` i `len` en temps musicals des de l'inici de l'escena.
 * *paraules* = taronja.
 */
export const CAPTIONS: { scene: SceneId; at: number; len: number; text: string }[] = [
  { scene: "numbers", at: 0.5, len: 15, text: "Immobiliària a *Manresa* des de 1977" },
  { scene: "sale", at: 0.5, len: 7.5, text: "Comprem i venem *tota mena d'immobles*" },
  { scene: "sale", at: 8.5, len: 11, text: "*Valoració gratuïta* i professional del teu immoble" },
  { scene: "rent", at: 0.5, len: 15, text: "Gestionem el teu *lloguer* de principi a fi" },
  { scene: "legal", at: 0.5, len: 11, text: "Assessorament *hipotecari* i *jurídic*" },
  { scene: "shopper", at: 0.5, len: 11, text: "Trobem l'immoble que *encaixa amb tu*" },
  { scene: "marketing", at: 3.2, len: 4.5, text: "*Fotografia i vídeo* professionals" },
  { scene: "marketing", at: 8, len: 3.6, text: "*Home staging* que posa en valor cada espai" },
  { scene: "marketing", at: 12, len: 11.6, text: "Màxima difusió a *xarxes socials* i *portals*" },
  { scene: "marketing", at: 24, len: 11.5, text: "Som experts en *intel·ligència artificial*" },
  { scene: "values", at: 0.5, len: 13, text: "Els *valors* que ens defineixen" },
  { scene: "team", at: 0.5, len: 15, text: "Un equip *multidisciplinari* al teu costat" },
];

// Persones de l'equip (src/team.json) assignades a cada servei segons el seu càrrec a la landing
export const SERVICE_PEOPLE: Record<string, string[]> = {
  sale: ["equip-09", "equip-02", "equip-06"], // Iván Gavilán, Josep Mª Hermosilla (vendes), Verònica Cànovas (obra nova)
  rent: ["equip-08", "equip-07"], // Encarna Ávila (lloguers), Carla Herrera (administració de finques)
  marketing: ["equip-05"], // Maria Vega (màrqueting)
};

// Ordre de l'equip per àrees: direcció, vendes, lloguers i finques, màrqueting, atenció al client
export const TEAM_ORDER = ["equip-04", "equip-06", "equip-09", "equip-02", "equip-08", "equip-07", "equip-05", "equip-03"];
