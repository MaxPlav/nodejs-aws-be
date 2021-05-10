import * as AWS from 'aws-sdk';
import csv from 'csv-parser';

import { IImportService } from '../types';

export class ImportService implements IImportService {
  private _s3Service: AWS.S3;

  constructor(private _config) {
    this._s3Service = new AWS.S3({ region: this._config.region, signatureVersion: 'v4' });
  }

  public getS3ImportSignedUrl(filePath: string): Promise<string> {
    const params = {
      Bucket: this._config.bucketName,
      Key: filePath,
      Expires: 60,
      ContentType: 'text/csv',
    };

    return this._s3Service.getSignedUrlPromise('putObject', params);
  }

  public async parseFile(filePath: string): Promise<string> {
    const params = {
      Bucket: this._config.bucketName,
      Key: filePath,
    };
    const s3Stream = this._s3Service.getObject(params).createReadStream();

    return new Promise((resolve, reject) => {
      s3Stream
        .pipe(csv())
        .on('data', (data) => {
          console.log('Parsed chunk: ', data);
        })
        .on('error', reject)
        .on('end', () => {
          resolve('Success');
        });
    });
  }

  public async moveFile(filePath: string, fromPath: string, targetPath: string): Promise<void> {
    await this._s3Service
      .copyObject({
        Bucket: this._config.bucketName,
        CopySource: `${this._config.bucketName}/${filePath}`,
        Key: filePath.replace(
          fromPath,
          targetPath
        ),
      })
      .promise();

    await this._s3Service
      .deleteObject({
        Bucket: this._config.bucketName,
        Key: filePath,
      })
      .promise();

      console.log('File is successfully moved');
      return;
  }
}
