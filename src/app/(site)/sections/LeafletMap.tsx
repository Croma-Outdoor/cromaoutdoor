'use client';

import dynamic from "next/dynamic";
import type { BillboardPoint } from "@/app/hooks/useBillboards";

export type LeafletMapProps = {
  onSelectBoard?: (board: BillboardPoint) => void;
  selectedBoardId?: string | null;
};

const Map = dynamic<LeafletMapProps>(() => import("./LeafletMapInner"), { ssr: false });

export function LeafletMap(props: LeafletMapProps) {
  return <Map {...props} />;
}
