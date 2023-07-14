import { createReadStream } from 'node:fs';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { IStorageService } from './interfaces/IStorageService';

@Injectable()
export class S3StorageService implements IStorageService {
  private s3: S3;

  constructor(
    private readonly accessKeyId: string,
    private readonly secretAccessKey: string,
    private readonly region: string,
    private readonly bucketName: string,
  ) {
    this.s3 = new S3({
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
    });
  }

  async uploadFile(filePath: string, fileName: string): Promise<void> {
    const uploadParams = {
      Bucket: this.bucketName,
      region: this.region,
      Key: fileName,
      Body: createReadStream(filePath),
    };

    await this.s3.upload(uploadParams).promise();
  }

  async deleteFile(fileName: string): Promise<void> {
    const deleteParams = {
      Bucket: this.bucketName,
      Key: fileName,
    };

    await this.s3.deleteObject(deleteParams).promise();
  }

  async listAllFiles(folder?: string): Promise<any> {
    const listParams = {
      Bucket: this.bucketName,
    };

    if (folder) {
      listParams['Prefix'] = folder;
    }

    const { Contents } = await this.s3.listObjects(listParams).promise();

    return Contents.map((file) => file.Key);
  }

  async getFileUrl(fileName: string, folder?: string): Promise<string> {
    const signedUrlParams = {
      Bucket: this.bucketName,
      Key: fileName,
      Expires: 3600, // Duración de la URL de descarga en segundos
    };

    if (folder) {
      signedUrlParams['Prefix'] = folder;
    }

    try {
      const signedUrl = await this.s3.getSignedUrlPromise(
        'getObject',
        signedUrlParams,
      );
      return signedUrl;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al descargar el archivo');
    }
  }
}
