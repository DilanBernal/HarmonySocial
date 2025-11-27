export type FilePayload = {
  data: Buffer;
  filename: string;
  mimeType: string;
  size?: number;
  metadata?: Record<string, any>;
};
