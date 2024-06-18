import { useState } from "react";
import {
  clearMeasurements,
  toggleSlabScroll,
  toggleTool,
} from "../utils/toolHelper";
import { CrosshairsTool, LengthTool } from "@cornerstonejs/tools";
import {
  handleCsResetCamera,
  handleCsSetSlabThickness,
} from "../utils/helpers";

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
  const [isSlabScroll, setIsSlabScroll] = useState(false);

  return (
    <div className="mt-3 flex justify-center gap-4">
      <ToolBarButton
        onClick={() => {
          setIsShowViewer((prev) => !prev);
          setSelectedTool("crosshairs");
          setIsSlabScroll(false);
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
        disabled={!isShowViewer}
      >
        Crosshairs
      </ToolBarButton>
      <ToolBarButton
        selected={selectedTool === "length"}
        onClick={() => {
          toggleTool(LengthTool.toolName);
          setSelectedTool("length");
        }}
        disabled={!isShowViewer}
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
      <ToolBarButton
        onClick={() => {
          handleCsResetCamera();
        }}
      >
        Reset Camera
      </ToolBarButton>
      <ToolBarButton
        onClick={() => {
          handleCsSetSlabThickness(10);
        }}
      >
        Slab Thickness: 10
      </ToolBarButton>
      <ToolBarButton
        onClick={() => {
          const newState = toggleSlabScroll();
          setIsSlabScroll(newState);
        }}
      >
        Slab Scroll: {isSlabScroll ? "On" : "Off"}
      </ToolBarButton>
    </div>
  );
}

function ToolBarButton({
  ...props
}: React.PropsWithChildren<React.BaseHTMLAttributes<HTMLButtonElement>> & {
  selected?: boolean;
  disabled?: boolean;
}) {
  const { children, selected, disabled } = props;

  return (
    <button
      {...props}
      className={`text-xs border border-black p-2 rounded ${
        selected && "bg-slate-300"
      } ${disabled && "opacity-50"}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
