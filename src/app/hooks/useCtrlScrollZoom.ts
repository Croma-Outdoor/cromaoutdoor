"use client";

import { useEffect } from "react";
import type { Map } from "leaflet";

export function useCtrlScrollZoom(map: Map | null) {
  useEffect(() => {
    if (!map) return;

    map.scrollWheelZoom.disable();
    let ctrlPressed = false;

    function enableWheelZoom() {
      if (map && !map.scrollWheelZoom.enabled()) {
        map.scrollWheelZoom.enable();
      }
    }

    function disableWheelZoom() {
      if (map && map.scrollWheelZoom.enabled()) {
        map.scrollWheelZoom.disable();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Control" || event.key === "Meta") {
        ctrlPressed = true;
        enableWheelZoom();
      }
    }

    function handleKeyUp(event: KeyboardEvent) {
      if (event.key === "Control" || event.key === "Meta") {
        ctrlPressed = false;
        disableWheelZoom();
      }
    }

    function handleWheel(event: WheelEvent) {
      if (event.ctrlKey || event.metaKey || ctrlPressed) {
        enableWheelZoom();
      } else {
        disableWheelZoom();
      }
    }

    const container = map.getContainer();
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", disableWheelZoom);
    container.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      disableWheelZoom();
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", disableWheelZoom);
      container.removeEventListener("wheel", handleWheel);
    };
  }, [map]);
}
