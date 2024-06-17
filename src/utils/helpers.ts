import * as cornerstone from "@cornerstonejs/core";
import * as cornerstoneTools from "@cornerstonejs/tools";
import cornerstoneDICOMImageLoader from "@cornerstonejs/dicom-image-loader";
import dicomPaser from "dicom-parser";
import { cornerstoneStreamingImageVolumeLoader } from "@cornerstonejs/streaming-image-volume-loader";
import { renderingEngineId } from "../data/cornerstoneIds";
import { IVolumeViewport } from "@cornerstonejs/core/dist/types/types";

const { RenderingEngine, volumeLoader } = cornerstone;
const { registerVolumeLoader } = volumeLoader;

export async function initCornerstone() {
  await cornerstone.init();
  cornerstoneTools.init();

  cornerstoneDICOMImageLoader.external.cornerstone = cornerstone;
  cornerstoneDICOMImageLoader.external.dicomParser = dicomPaser;

  registerVolumeLoader(
    "cornerstoneStreamingImageVolume",
    cornerstoneStreamingImageVolumeLoader as unknown as cornerstone.Types.VolumeLoaderFn
  );

  new RenderingEngine(renderingEngineId);
}

export function handleCsResize() {
  const renderingEngine = cornerstone.getRenderingEngine(renderingEngineId);
  const viewports = renderingEngine?.getViewports() as
    | IVolumeViewport[]
    | undefined;
  if (!viewports) return;
  const presentations = viewports.map((viewport) => {
    return viewport.getViewPresentation();
  });
  renderingEngine?.resize(true, true);
  viewports.forEach((viewport, idx) => {
    viewport.setViewPresentation(presentations[idx]);
  });
}
