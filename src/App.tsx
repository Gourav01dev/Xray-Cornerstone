// TODO: measurement clearing

import "./App.css";
import { initCornerstone } from "./utils/helpers";
import {
  clearMeasurements,
  initCornerstoneToolGroup,
} from "./utils/toolHelper";
import { imageIds } from "./data/iamgeIds";
import { useEffect, useState } from "react";
import * as cornerstone from "@cornerstonejs/core";
import VolumeViewer from "./components/VolumeViewer";
import { CrosshairsTool, LengthTool } from "@cornerstonejs/tools";
import { toggleTool } from "./utils/toolHelper";

function App() {
  const [isShowViewer, setIsShowViewer] = useState(false);
  const [selectedTool, setSelectedTool] = useState<"crosshairs" | "length">(
    "crosshairs"
  );

  useEffect(() => {
    // In actual use case, Cornerstone should be initialized when app loads (app level)
    initCornerstone()
      .then(() => {
        // Cornerstone tools can be initialized when app loads (app level), or create/destroy tool group at page level
        initCornerstoneToolGroup();

        // In actual use case, image loader should load and caches images with image ids when page/container loads (page level)
        cornerstone.imageLoader.loadAndCacheImages(imageIds);
      })
      .then(() => {
        // In actual use case, viewer should be initialized when image loader finishes loading images (component level)
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
        <h1 className="text-xl text-center m-4">Simple Volume Example</h1>
        <div className="flex gap-4 justify-center items-center">
          {isShowViewer ? <VolumeViewer imageIds={imageIds} /> : null}
        </div>
        <div className="mt-3 flex justify-center gap-4">
          <button
            className={` text-xs border border-black p-2 rounded`}
            onClick={() => {
              setIsShowViewer((prev) => !prev);
            }}
          >
            {isShowViewer ? "Hide Viewer" : "Show Viewer"}
          </button>
          <button
            className={` text-xs border border-black p-2 rounded ${
              selectedTool === "crosshairs" && "bg-slate-300"
            }`}
            onClick={() => {
              toggleTool(CrosshairsTool.toolName);
              setSelectedTool("crosshairs");
            }}
          >
            Crosshairs
          </button>
          <button
            className={` text-xs border border-black p-2 rounded ${
              selectedTool === "length" && "bg-slate-300"
            }`}
            onClick={() => {
              toggleTool(LengthTool.toolName);
              setSelectedTool("length");
            }}
          >
            Length
          </button>
          <button
            className="text-xs border border-black p-2 rounded"
            onClick={() => {
              clearMeasurements();
            }}
          >
            Clear Length
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
