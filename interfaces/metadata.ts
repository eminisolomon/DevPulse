export interface WakaTimeMetadata {
  id: string;
  name: string;
  color: string;
}

export interface WakaTimeMetadataResponse {
  data: WakaTimeMetadata[];
}
