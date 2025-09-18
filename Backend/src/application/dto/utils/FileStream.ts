type FileStream = {
  stream: NodeJS.ReadableStream;
  filename: string;
  mimeType: string;
  contentLength?: string | number;
};

export default FileStream;
