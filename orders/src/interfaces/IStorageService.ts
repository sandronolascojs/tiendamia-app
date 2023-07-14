export interface IStorageService {
  uploadFile(filePath: string, fileName: string): Promise<void>;
  deleteFile(fileName: string): Promise<void>;
  listAllFiles(folder?: string): Promise<any>;
  getFileUrl(fileName: string, folder?: string): Promise<string>;
}
