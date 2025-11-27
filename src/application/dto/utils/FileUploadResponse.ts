// Respuesta para subida de archivo (opcional, para mayor claridad en el dominio)
export interface FileUploadResponse {
  url: string; // URL pública del archivo
  blobName: string; // Nombre interno del blob en Azure
}
