import React from "react";
import { Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { FPS } from "../lib/time";

export type Cue = { t: number; name: string; vol?: number };

/** Col·loca cada efecte sonor al fotograma exacte (temps absolut). */
export const SfxTrack: React.FC<{ cues: Cue[]; master?: number }> = ({ cues, master = 1 }) => (
  <>
    {cues
      .filter((c) => c.t >= 0)
      .map((c, i) => (
        <Sequence key={i} from={Math.round(c.t * FPS)} durationInFrames={Math.round(3 * FPS)} layout="none" name={`sfx ${c.name}`}>
          <Audio src={staticFile(`audio/sfx/${c.name}.wav`)} volume={(c.vol ?? 0.5) * master} />
        </Sequence>
      ))}
  </>
);
