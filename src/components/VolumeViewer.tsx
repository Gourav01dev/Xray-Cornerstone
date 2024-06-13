import { Ref, useCallback, useEffect, useRef, useState } from "react";
import {
  viewportIds,
  volumeId,
  renderingEngineId,
} from "../data/cornerstoneIds";
import * as cornerstone from "@cornerstonejs/core";
import {
  IVolumeViewport,
  PublicViewportInput,
} from "@cornerstonejs/core/dist/types/types";
import { StreamingImageVolume } from "@cornerstonejs/streaming-image-volume-loader";
import { CrosshairsTool, utilities } from "@cornerstonejs/tools";
import { toggleTool } from "../utils/toolHelper";

const { volumeLoader, getRenderingEngine, setVolumesForViewports, Enums } =
  cornerstone;
const { OrientationAxis, ViewportType } = Enums;
// const defaultDisplayRatio = 1 / 1.1;
const defaultDisplayRatio = 1;

type Props = { imageIds: string[] };

export default function VolumeViewer({ imageIds }: Props) {
  const initialAxialSlice = Math.floor(imageIds.length / 2);

  const axialRef = useRef<HTMLDivElement>(null);
  const coronalRef = useRef<HTMLDivElement>(null);
  const segittalRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<StreamingImageVolume>();

  const [isVolumeLoaded, setIsVolumeLoaded] = useState(false);
  const [axialSlice, setAxialSlice] = useState(initialAxialSlice - 1);
  const [coronalSlice, setCoronalSlice] = useState(255);
  const [segittalSlice, setSegittalSlice] = useState(255);

  const handleResize = useCallback(() => {
    const renderingEngine = getRenderingEngine(renderingEngineId);
    renderingEngine?.resize(true, true);
  }, []);

  const handleSliceChange = useCallback((viewportId: string) => {
    const renderingEngine = getRenderingEngine(renderingEngineId);
    const viewport = renderingEngine?.getViewport(
      viewportId
    ) as IVolumeViewport;
    // console.log(viewport?.getProperties());
    const index = viewport?.getSliceIndex();
    if (index === undefined) return;
    // const total = viewport?.getNumberOfSlices();
    if (viewportId === viewportIds[0]) {
      setAxialSlice(index);
    }
    if (viewportId === viewportIds[1]) {
      setCoronalSlice(index);
    }
    if (viewportId === viewportIds[2]) {
      setSegittalSlice(index);
    }
  }, []);

  const handleScrollSlice = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, viewportId: string) => {
      const renderingEngine = getRenderingEngine(renderingEngineId);
      const element = renderingEngine?.getViewport(viewportId).element;
      if (!element) return;
      utilities.jumpToSlice(element, { imageIndex: +e.target.value });
    },
    []
  );

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  useEffect(() => {
    const axial = axialRef.current;
    const coronal = coronalRef.current;
    const segittal = segittalRef.current;
    const viewportArray = [
      {
        viewportId: viewportIds[0],
        type: ViewportType.ORTHOGRAPHIC,
        element: axial,
        defaultOptions: {
          orientation: OrientationAxis.ACQUISITION,
          displayArea: {
            imageArea: [defaultDisplayRatio, defaultDisplayRatio],
          },
        },
      },
      {
        viewportId: viewportIds[1],
        type: ViewportType.ORTHOGRAPHIC,
        element: coronal,
        defaultOptions: {
          orientation: OrientationAxis.CORONAL,
          displayArea: {
            imageArea: [defaultDisplayRatio, defaultDisplayRatio],
          },
        },
      },
      {
        viewportId: viewportIds[2],
        type: ViewportType.ORTHOGRAPHIC,
        element: segittal,
        defaultOptions: {
          orientation: OrientationAxis.SAGITTAL,
          displayArea: {
            imageArea: [defaultDisplayRatio, defaultDisplayRatio],
          },
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

    initRender()
      .then(() => {
        // custom VOI settings
        for (let i = 0; i < viewportIds.length; i++) {
          const viewport = renderingEngine?.getViewport(
            viewportIds[i]
          ) as cornerstone.Types.IVolumeViewport;
          viewport.setProperties({ voiRange: { lower: -300, upper: 1400 } });
        }
      })
      .then(() => {
        axial?.addEventListener(
          cornerstone.Enums.Events.VOLUME_NEW_IMAGE,
          () => {
            handleSliceChange(viewportIds[0]);
          }
        );
        coronal?.addEventListener(
          cornerstone.Enums.Events.VOLUME_NEW_IMAGE,
          () => {
            handleSliceChange(viewportIds[1]);
          }
        );
        segittal?.addEventListener(
          cornerstone.Enums.Events.VOLUME_NEW_IMAGE,
          () => {
            handleSliceChange(viewportIds[2]);
          }
        );
      })
      .then(() => {
        toggleTool(CrosshairsTool.toolName);
      });

    return () => {
      axial?.removeEventListener(
        cornerstone.Enums.Events.VOLUME_NEW_IMAGE,
        () => {
          handleSliceChange(viewportIds[0]);
        }
      );
      coronal?.removeEventListener(
        cornerstone.Enums.Events.VOLUME_NEW_IMAGE,
        () => {
          handleSliceChange(viewportIds[1]);
        }
      );
      segittal?.removeEventListener(
        cornerstone.Enums.Events.VOLUME_NEW_IMAGE,
        () => {
          handleSliceChange(viewportIds[2]);
        }
      );
    };
  }, [imageIds, handleSliceChange]);

  return (
    <>
      {!isVolumeLoaded && <p className="absolute">Loading volume...</p>}
      <ViewerContainer>
        <ViewerLabels>
          {axialSlice + 1} / {imageIds.length}
        </ViewerLabels>
        <ViewerElement viewportRef={axialRef}></ViewerElement>
        <ViewerScrollBar
          totalSlice={imageIds.length}
          slice={axialSlice}
          handleScrollSlice={handleScrollSlice}
          viewportId={viewportIds[0]}
        />
      </ViewerContainer>
      <ViewerContainer>
        <ViewerLabels>{coronalSlice + 1} / 512</ViewerLabels>
        <ViewerElement viewportRef={coronalRef}></ViewerElement>
        <ViewerScrollBar
          totalSlice={512}
          slice={coronalSlice}
          handleScrollSlice={handleScrollSlice}
          viewportId={viewportIds[1]}
        />
      </ViewerContainer>
      <ViewerContainer>
        <ViewerLabels>{segittalSlice + 1} / 512</ViewerLabels>
        <ViewerElement viewportRef={segittalRef}></ViewerElement>
        <ViewerScrollBar
          totalSlice={512}
          slice={segittalSlice}
          handleScrollSlice={handleScrollSlice}
          viewportId={viewportIds[2]}
        />
      </ViewerContainer>
    </>
  );
}

function ViewerContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-1/4 aspect-square bg-black rounded-lg hover:outline-5 hover:outline hover:outline-green-500 relative flex overflow-hidden">
      {children}
    </div>
  );
}

function ViewerElement({
  children,
  viewportRef,
}: {
  children?: React.ReactNode;
  viewportRef: Ref<HTMLDivElement>;
}) {
  {
    return (
      <div
        ref={viewportRef}
        className="w-full aspect-square"
        onContextMenu={(e) => {
          e.preventDefault();
        }}
      >
        {children}
      </div>
    );
  }
}

function ViewerScrollBar({
  totalSlice,
  slice,
  handleScrollSlice,
  viewportId,
}: {
  totalSlice: number;
  slice: number;
  handleScrollSlice: (
    e: React.ChangeEvent<HTMLInputElement>,
    viewportId: string
  ) => void;
  viewportId: string;
}) {
  return (
    <input
      min={0}
      max={totalSlice - 1}
      type="range"
      value={slice}
      onChange={(e) => {
        handleScrollSlice(e, viewportId);
      }}
      className="opacity-60 hover:opacity-100 slider w-full h-2 bg-transparent left-full pt-2 px-1 [&::-webkit-slider-thumb]:rounded [&::-moz-range-thumb]:border-none  [&::-moz-range-thumb]:bg-green-500 [&::-moz-range-thumb:hover]:bg-green-400 [&::-webkit-slider-thumb]:bg-green-500 [&::-webkit-slider-thumb:hover]:bg-green-400"
    ></input>
  );
}

function ViewerLabels({ children }: { children: React.ReactNode }) {
  return (
    <div className=" absolute text-green-500 z-10 ml-2 mt-2 text-xs">
      {children}
    </div>
  );
}
