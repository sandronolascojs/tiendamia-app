import { dirname } from 'node:path';
import {
  createWriteStream,
  createReadStream,
  unlink,
  mkdir,
  readdir,
  existsSync,
} from 'node:fs';
import { Injectable } from '@nestjs/common';
import { IStorageService } from './interfaces/IStorageService';

@Injectable()
export class LocalStorageService implements IStorageService {
  private readonly localStoragePath: string;
  private readonly localStorageHost: string;

  constructor(localStoragePath: string, localStorageHost: string) {
    if (!existsSync(localStoragePath)) {
      mkdir(localStoragePath, { recursive: true }, (error) => {
        if (error) {
          throw error;
        }
      });
    }

    this.localStoragePath = localStoragePath;
    this.localStorageHost = localStorageHost;
  }

  async uploadFile(filePath: string, fileName: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      const sourcePath = filePath;
      const destinationPath = `./storage/${fileName}`;
      const destinationDirectory = dirname(destinationPath);
      try {
        await this.createDirectoryIfNotExists(destinationDirectory);

        const readStream = createReadStream(sourcePath);
        const writeStream = createWriteStream(destinationPath);

        readStream.on('error', (error) => {
          reject(error);
        });

        writeStream.on('error', (error) => {
          reject(error);
        });

        writeStream.on('close', () => {
          resolve();
        });

        readStream.pipe(writeStream);
      } catch (error) {
        reject(error);
      }
    });
  }

  async deleteFile(fileName: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const filePath = `./storage/${fileName}`;

      unlink(filePath, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  async createDirectoryIfNotExists(directoryPath: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      mkdir(directoryPath, { recursive: true }, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  async listAllFiles(folder?: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const directoryPath = folder ? `./storage/${folder}` : './storage';

      readdir(directoryPath, (error, files) => {
        if (error) {
          reject(error);
        } else {
          resolve(files);
        }
      });
    });
  }

  async getFileUrl(fileName: string, folder?: string): Promise<string | null> {
    return new Promise<string | null>((resolve) => {
      const filePath = folder
        ? `./storage/${folder}/${fileName}`
        : `./storage/${fileName}`;

      if (existsSync(filePath)) {
        resolve(`${this.localStorageHost}/download/${fileName}`);
      } else {
        resolve(null);
      }
    });
  }
}
