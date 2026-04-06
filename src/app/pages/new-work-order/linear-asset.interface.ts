/** A named reference point along a linear asset. */
export interface Marker {
  MarkerId: string;
  OffsetFromSegmentStart: number;
}

/** A linear asset record with its associated markers. */
export interface LinearAsset {
  AssetId: string;
  Description: string;
  SegmentId: string;
  Location: string;
  TotalLength: number;
  Markers: Marker[];
}
