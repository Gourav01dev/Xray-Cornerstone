import * as cornerstone from "@cornerstonejs/core";
import * as cornerstoneTools from "@cornerstonejs/tools";
import cornerstoneDICOMImageLoader from "@cornerstonejs/dicom-image-loader";
import dicomPaser from "dicom-parser";
import { cornerstoneStreamingImageVolumeLoader } from "@cornerstonejs/streaming-image-volume-loader";
import { renderingEngineId } from "../data/cornerstoneIds";

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
