import React from "react";
import { Composition, delayRender, continueRender, Folder } from "remotion";
import { InllobsaVideo } from "./Video";
import { TL } from "./lib/time";
import { fontsReady } from "./lib/fonts";

const handle = delayRender("Carregant tipografia Mulish");
fontsReady.then(() => continueRender(handle));

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Inllobsa-16x9"
      component={InllobsaVideo}
      width={1920}
      height={1080}
      fps={TL.fps}
      durationInFrames={TL.frames}
      defaultProps={{ captions: true, audio: true }}
    />
    <Composition
      id="Inllobsa-9x16"
      component={InllobsaVideo}
      width={1080}
      height={1920}
      fps={TL.fps}
      durationInFrames={TL.frames}
      defaultProps={{ captions: true, audio: true }}
    />
    <Folder name="Sense-subtitols">
      <Composition
        id="Inllobsa-16x9-net"
        component={InllobsaVideo}
        width={1920}
        height={1080}
        fps={TL.fps}
        durationInFrames={TL.frames}
        defaultProps={{ captions: false, audio: true }}
      />
    </Folder>
  </>
);
