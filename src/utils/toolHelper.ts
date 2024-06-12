import * as cornerstoneTools from "@cornerstonejs/tools";
import { toolGroupId } from "../data/cornerstoneIds";

const { ZoomTool, PanTool, ToolGroupManager } = cornerstoneTools;

export function initCornerstoneToolGroup() {
  cornerstoneTools.addTool(ZoomTool);
  cornerstoneTools.addTool(PanTool);

  const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);

  if (!toolGroup) return;
  toolGroup.addTool(ZoomTool.toolName);
  toolGroup.addTool(PanTool.toolName);

  toolGroup.setToolActive(PanTool.toolName);
}
