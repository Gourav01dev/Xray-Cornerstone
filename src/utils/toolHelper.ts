import * as cornerstoneTools from "@cornerstonejs/tools";
import {
  toolGroupId,
  viewportIds,
  renderingEngineId,
} from "../data/cornerstoneIds";

const {
  ZoomTool,
  PanTool,
  CrosshairsTool,
  StackScrollMouseWheelTool,
  LengthTool,
  ToolGroupManager,
} = cornerstoneTools;

const viewportColors = {
  [viewportIds[0]]: "rgb(200, 0, 0)",
  [viewportIds[1]]: "rgb(200, 100, 0)",
  [viewportIds[2]]: "rgb(0, 200, 0)",
};

function getReferenceLineColor(viewportId: string) {
  return viewportColors[viewportId];
}

export function initCornerstoneToolGroup() {
  cornerstoneTools.addTool(ZoomTool);
  cornerstoneTools.addTool(PanTool);
  cornerstoneTools.addTool(CrosshairsTool);
  cornerstoneTools.addTool(LengthTool);
  cornerstoneTools.addTool(StackScrollMouseWheelTool);

  const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);

  if (!toolGroup) return;
  toolGroup.addTool(ZoomTool.toolName);
  toolGroup.addTool(PanTool.toolName);
  toolGroup.addTool(CrosshairsTool.toolName, { getReferenceLineColor });
  toolGroup.addTool(LengthTool.toolName);
  toolGroup.addTool(StackScrollMouseWheelTool.toolName);

  toolGroup.setToolActive(CrosshairsTool.toolName, {
    bindings: [{ mouseButton: 1 }],
  });
  toolGroup.setToolActive(ZoomTool.toolName, {
    bindings: [{ mouseButton: 2 }],
  });
  toolGroup.setToolActive(PanTool.toolName, { bindings: [{ mouseButton: 3 }] });
  toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);
}

export function toggleTool(toolName: string) {
  console.log(toolName);

  const toolGroup = ToolGroupManager.getToolGroup(toolGroupId);

  if (!toolGroup) return;
  if (toolGroup?.getViewportIds.length === 0) {
    viewportIds.forEach((viewportId) => {
      toolGroup?.addViewport(viewportId, renderingEngineId);
    });
  }

  if (toolName === CrosshairsTool.toolName) {
    toolGroup.setToolActive(CrosshairsTool.toolName, {
      bindings: [{ mouseButton: 1 }],
    });
    toolGroup.setToolPassive(LengthTool.toolName);
  }
  if (toolName === LengthTool.toolName) {
    toolGroup.setToolDisabled(CrosshairsTool.toolName);
    toolGroup.setToolActive(LengthTool.toolName, {
      bindings: [{ mouseButton: 1 }],
    });
  }
}

// Maybe this can be used for auto jump to nodule position when selecting nodule?
// https://www.cornerstonejs.org/api/tools/class/crosshairstool/#addNewAnnotation
// addNewAnnotation
// addNewAnnotation(evt: InteractionEventType): CrosshairsAnnotation
// Overrides AnnotationTool.addNewAnnotation
// addNewAnnotation acts as jump for the crosshairs tool. It is called when the user clicks on the image. It does not store the annotation in the stateManager though.
