import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";

import { isPresent } from "app/core/util/operators";
import { ApplicationConfigService } from "app/core/config/application-config.service";
import { createRequestOption } from "app/core/request/request-util";
import {
  IFileManager,
  getFileManagerIdentifier,
} from "../file-manager.model";

export type EntityResponseType = HttpResponse<IFileManager>;
export type EntityArrayResponseType = HttpResponse<IFileManager[]>;

@Injectable({ providedIn: "root" })
export class FileManagerService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor(
    "api/file-containers"
  );

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService
  ) {}

  create(FileManager: IFileManager): Observable<EntityResponseType> {
    return this.http.post<IFileManager>(this.resourceUrl, FileManager, {
      observe: "response",
    });
  }

  update(fileManager: IFileManager): Observable<EntityResponseType> {
    return this.http.put<IFileManager>(
      `${this.resourceUrl}/${
        getFileManagerIdentifier(fileManager) as number
      }`,
        fileManager,
      { observe: "response" }
    );
  }

    partialUpdate(fileManager: IFileManager): Observable<EntityResponseType> {
    return this.http.patch<IFileManager>(
      `${this.resourceUrl}/${
        getFileManagerIdentifier(fileManager) as number
      }`,
        fileManager,
      { observe: "response" }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFileManager>(`${this.resourceUrl}/${id}`, {
      observe: "response",
    });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFileManager[]>(this.resourceUrl, {
      params: options,
      observe: "response",
    });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, {
      observe: "response",
    });
  }

  addFileManagerToCollectionIfMissing(
    fileManagerCollection: IFileManager[],
    ...FileManagersToCheck: (IFileManager | null | undefined)[]
  ): IFileManager[] {
    const FileManagers: IFileManager[] =
      FileManagersToCheck.filter(isPresent);
    if (FileManagers.length > 0) {
        const fileManagerCollectionIdentifiers = fileManagerCollection.map(
            (fileManagerItem) => getFileManagerIdentifier(fileManagerItem)!
      );
      const fileManagersToAdd = FileManagers.filter((FileManagerItem) => {
        const fileManagerIdentifier =
          getFileManagerIdentifier(FileManagerItem);
        if (
            fileManagerIdentifier == null ||
            fileManagerCollectionIdentifiers.includes(fileManagerIdentifier)
        ) {
          return false;
        }
          fileManagerCollectionIdentifiers.push(fileManagerIdentifier);
        return true;
      });
      return [...fileManagersToAdd, ...fileManagerCollection];
    }
    return fileManagerCollection;
  }
}
