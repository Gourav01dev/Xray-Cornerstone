import { useState } from "react";
import { clearMeasurements, toggleTool } from "../utils/toolHelper";
import { CrosshairsTool, LengthTool } from "@cornerstonejs/tools";

type ToolBarProps = {
  setIsShowViewer: React.Dispatch<React.SetStateAction<boolean>>;
  isShowViewer: boolean;
};

export default function ToolBar({
  setIsShowViewer,
  isShowViewer,
}: ToolBarProps) {
  const [selectedTool, setSelectedTool] = useState<"crosshairs" | "length">(
    "crosshairs"
  );

  return (
    <div className="mt-3 flex justify-center gap-4">
      <ToolBarButton
        onClick={() => {
          setIsShowViewer((prev) => !prev);
          setSelectedTool("crosshairs");
        }}
      >
        {isShowViewer ? "Hide Viewer" : "Show Viewer"}
      </ToolBarButton>
      <ToolBarButton
        selected={selectedTool === "crosshairs"}
        onClick={() => {
          toggleTool(CrosshairsTool.toolName);
          setSelectedTool("crosshairs");
        }}
      >
        Crosshairs
      </ToolBarButton>
      <ToolBarButton
        selected={selectedTool === "length"}
        onClick={() => {
          toggleTool(LengthTool.toolName);
          setSelectedTool("length");
        }}
      >
        Length
      </ToolBarButton>
      <ToolBarButton
        onClick={() => {
          clearMeasurements();
        }}
      >
        Clear Length
      </ToolBarButton>
      {/* <button
            className="text-xs border border-black p-2 rounded"
            onClick={() => {
              const renderingEnine =
                cornerstone.getRenderingEngine(renderingEngineId);
              const viewports = renderingEnine?.getVolumeViewports();
              console.log(viewports);
              viewports?.forEach((viewport) => {
                console.log(viewport.getViewPresentation());
              });
            }}
          >
            Get Viewports
          </button> */}
    </div>
  );
}

function ToolBarButton({
  ...props
}: React.PropsWithChildren<React.BaseHTMLAttributes<HTMLButtonElement>> & {
  selected?: boolean;
}) {
  const { children, selected } = props;

  return (
    <button
      {...props}
      className={`text-xs border border-black p-2 rounded ${
        selected && "bg-slate-300"
      }`}
    >
      {children}
    </button>
  );
}
