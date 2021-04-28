export interface IImportService {
  getS3ImportSignedUrl(filePath: string): Promise<string>;
  parseFile(filePath: string): Promise<string>;
  moveFile(filePath: string, fromPath: string, targetPath: string): Promise<void>;
}