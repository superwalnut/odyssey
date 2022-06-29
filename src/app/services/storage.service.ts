import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface FilesUploadMetadata {
  uploadProgress$: Observable<number>;
  downloadUrl$: Observable<string>;
}

@Injectable({
  providedIn: 'root'
})

export class StorageService {
  constructor(private readonly storage: AngularFireStorage) {}

  uploadFileAndGetMetadata(mediaFolderPath: string, fileToUpload: File, userDocId:string): FilesUploadMetadata {
    var fileName = fileToUpload.name;
    console.log('filename', fileToUpload.name);
    var res = fileName.split(".");
    fileName = userDocId + "." + res[1];
    const filePath = `${mediaFolderPath}/${fileName}`;
    const uploadTask: AngularFireUploadTask = this.storage.upload(filePath, fileToUpload, );

    return {
      uploadProgress$: uploadTask.percentageChanges(),
      downloadUrl$: this.getDownloadUrl$(uploadTask, filePath),
    };
  }

  private getDownloadUrl$(uploadTask: AngularFireUploadTask,path: string,): Observable<string> {
    return from(uploadTask).pipe(
      switchMap((_) => this.storage.ref(path).getDownloadURL()),
    );
  }
}