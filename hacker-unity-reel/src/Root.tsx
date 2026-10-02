import { Composition } from "remotion";
import { HackerUnityReel } from "./HackerUnityReel";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HackerUnityReel"
        component={HackerUnityReel}
        durationInFrames={1079} // ~36 seconds at 30fps
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
