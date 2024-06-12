import { useEffect, useRef, useState } from "react";
import {
  viewportIds,
  volumeId,
  renderingEngineId,
} from "../data/cornerstoneIds";
import { volumeLoader } from "@cornerstonejs/core";
import * as cornerstone from "@cornerstonejs/core";
import { PublicViewportInput } from "@cornerstonejs/core/dist/types/types";
import { StreamingImageVolume } from "@cornerstonejs/streaming-image-volume-loader";

const { getRenderingEngine, setVolumesForViewports, Enums } = cornerstone;
const { OrientationAxis, ViewportType } = Enums;

type Props = { imageIds: string[] };

export default function VolumeViewer({ imageIds }: Props) {
  const axialRef = useRef<HTMLDivElement>(null);
  const coronalRef = useRef<HTMLDivElement>(null);
  const segittalRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<StreamingImageVolume>();

  const [isVolumeLoaded, setIsVolumeLoaded] = useState(false);

  useEffect(() => {
    const viewportArray = [
      {
        viewportId: viewportIds[0],
        type: ViewportType.ORTHOGRAPHIC,
        element: axialRef.current,
        defaultOptions: {
          orientation: OrientationAxis.AXIAL,
        },
      },
      {
        viewportId: viewportIds[1],
        type: ViewportType.ORTHOGRAPHIC,
        element: coronalRef.current,
        defaultOptions: {
          orientation: OrientationAxis.CORONAL,
        },
      },
      {
        viewportId: viewportIds[2],
        type: ViewportType.ORTHOGRAPHIC,
        element: segittalRef.current,
        defaultOptions: {
          orientation: OrientationAxis.SAGITTAL,
        },
      },
    ] as PublicViewportInput[];

    async function initVolume() {
      volumeRef.current = (await volumeLoader.createAndCacheVolume(volumeId, {
        imageIds,
      })) as StreamingImageVolume;
    }
    const renderingEngine = getRenderingEngine(renderingEngineId);

    async function initRender() {
      await initVolume();

      if (!renderingEngine) return;
      renderingEngine.setViewports(viewportArray);
      volumeRef.current?.load(() => {});

      await setVolumesForViewports(
        renderingEngine,
        [{ volumeId }],
        viewportIds
      );
      renderingEngine.renderViewports(viewportIds);
      setIsVolumeLoaded(true);
    }

    initRender().then(() => {
      // custom VOI settings
      for (let i = 0; i < viewportIds.length; i++) {
        const viewport = renderingEngine?.getViewport(
          viewportIds[i]
        ) as cornerstone.Types.IVolumeViewport;
        viewport.setProperties({ voiRange: { lower: 900, upper: 1250 } });
      }
    });
  }, [imageIds]);

  return (
    <>
      {!isVolumeLoaded && <p className="absolute">Loading volume...</p>}
      <div ref={axialRef} className="w-[512px] h-[512px]"></div>
      <div ref={coronalRef} className="w-[512px] h-[512px]"></div>
      <div ref={segittalRef} className="w-[512px] h-[512px]"></div>
    </>
  );
}
