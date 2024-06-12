import "./App.css";
import { initCornerstone } from "./utils/helpers";
import { initCornerstoneToolGroup } from "./utils/toolHelper";
import { imageIds } from "./data/iamgeIds";
import { useEffect, useState } from "react";
import * as cornerstone from "@cornerstonejs/core";
import VolumeViewer from "./components/VolumeViewer";

function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initCornerstone()
      .then(() => {
        initCornerstoneToolGroup();
        cornerstone.imageLoader.loadAndCacheImages(imageIds);
      })
      .then(() => {
        setIsInitialized(true);
      });

    return () => {
      cornerstone.cache.purgeVolumeCache();
    };
  }, []);

  return (
    <>
      <div>
        <h1 className="text-xl text-center m-4">Simple Volume Example</h1>
        <div className="flex gap-4 justify-center items-center">
          {isInitialized ? <VolumeViewer imageIds={imageIds} /> : null}
        </div>
      </div>
    </>
  );
}

export default App;
