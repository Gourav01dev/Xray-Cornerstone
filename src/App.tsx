import "./App.css";
import { initCornerstone } from "./utils/helpers";
import { initCornerstoneToolGroup } from "./utils/toolHelper";
import { imageIds } from "./data/iamgeIds";
import { useEffect, useState } from "react";
import * as cornerstone from "@cornerstonejs/core";
import VolumeViewer from "./components/VolumeViewer";
import ToolBar from "./components/ToolBar";

function App() {
  const [isShowViewer, setIsShowViewer] = useState(false);
console.log('imageIds', imageIds);
  useEffect(() => {
    // In actual use case, Cornerstone should be initialized when app loads (app level)
    initCornerstone()
      .then(() => {
        // Cornerstone tools can be initialized when app loads (app level), or create/destroy tool group at page level
        initCornerstoneToolGroup();

        // In actual use case, you should fetch metadata from dicom server instead of using loadAndCacheImages(workaround) at page/container level
        cornerstone.imageLoader.loadAndCacheImages(imageIds);
      })
      .then(() => {
        // In actual use case, viewer should be initialized when image metadata is ready at page/component level
        setIsShowViewer(true);
      });

    return () => {
      // Can be done at page level
      cornerstone.cache.purgeCache();
      cornerstone.cache.purgeVolumeCache();
    };
  }, []);

  return (
    <>
      <div>
        <h1 className="text-xl text-center m-4">.</h1>
        <div className="flex gap-4 justify-center items-center">
          {isShowViewer ? <VolumeViewer imageIds={imageIds} /> : null}
        </div>
        <ToolBar
          setIsShowViewer={setIsShowViewer}
          isShowViewer={isShowViewer}
        />
      </div>
    </>
  );
}

export default App;
