import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { TL, type SceneId } from "./lib/time";
import music from "./data/music.json";
import { Captions } from "./components/Captions";
import { LogoBug } from "./components/LogoBug";
import { SfxTrack, type Cue } from "./components/Sfx";
import { Hook, hookSfx } from "./scenes/Hook";
import { Numbers, numbersSfx } from "./scenes/Numbers";
import { Sale, saleSfx } from "./scenes/Sale";
import { Rent, rentSfx } from "./scenes/Rent";
import { Legal, legalSfx } from "./scenes/Legal";
import { Shopper, shopperSfx } from "./scenes/Shopper";
import { Marketing, marketingSfx } from "./scenes/Marketing";
import { Values, valuesSfx } from "./scenes/Values";
import { Team, teamSfx } from "./scenes/Team";
import { Closing, closingSfx } from "./scenes/Closing";

// Cada escena es renderitza 0,5 s abans i després dels seus límits perquè
// l'escena entrant pugui fer la transició per sobre de la sortint.
const PRE = 15;
const POST = 15;

const SCENES: Record<SceneId, { C: React.FC<{ from: number }>; sfx: Cue[] }> = {
  hook: { C: Hook, sfx: hookSfx },
  numbers: { C: Numbers, sfx: numbersSfx },
  sale: { C: Sale, sfx: saleSfx },
  rent: { C: Rent, sfx: rentSfx },
  legal: { C: Legal, sfx: legalSfx },
  shopper: { C: Shopper, sfx: shopperSfx },
  marketing: { C: Marketing, sfx: marketingSfx },
  values: { C: Values, sfx: valuesSfx },
  team: { C: Team, sfx: teamSfx },
  closing: { C: Closing, sfx: closingSfx },
};

export const ALL_SFX: Cue[] = Object.values(SCENES).flatMap((s) => s.sfx);

export const InllobsaVideo: React.FC<{ captions?: boolean; audio?: boolean }> = ({ captions = true, audio = true }) => (
  <AbsoluteFill style={{ background: "#1b2638" }}>
    {TL.scenes.map((s, i) => {
      const { C } = SCENES[s.id];
      const pre = s.from === 0 ? 0 : PRE;
      const last = i === TL.scenes.length - 1;
      return (
        <Sequence key={s.id} name={s.id} from={s.from - pre} durationInFrames={s.frames + pre + (last ? 0 : POST)} layout="absolute-fill" style={{ zIndex: i + 1, isolation: "isolate" }}>
          <C from={s.from - pre} />
        </Sequence>
      );
    })}
    <div style={{ position: "absolute", inset: 0, zIndex: 40 }}>
      <LogoBug />
    </div>
    <div style={{ position: "absolute", inset: 0, zIndex: 50 }}>{captions && <Captions />}</div>
    {audio && (
      <>
        <Audio src={staticFile(music.file)} volume={(f) => Math.min(1, (TL.frames - f) / 20)} />
        <SfxTrack cues={ALL_SFX} master={0.6} />
      </>
    )}
  </AbsoluteFill>
);
