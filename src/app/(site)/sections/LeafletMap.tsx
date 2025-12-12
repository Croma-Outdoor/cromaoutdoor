'use client';

import dynamic from "next/dynamic";

const Map = dynamic(() => import("./LeafletMapInner"), { ssr: false });

export function LeafletMap() {
  return <Map />;
}
