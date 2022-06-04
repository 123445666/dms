import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";

import { isPresent } from "app/core/util/operators";
import { ApplicationConfigService } from "app/core/config/application-config.service";
import { createRequestOption } from "app/core/request/request-util";
import {
  IFileContainer,
  getFileContainerIdentifier,
} from "../file-container.model";

export type EntityResponseType = HttpResponse<IFileContainer>;
export type EntityArrayResponseType = HttpResponse<IFileContainer[]>;

@Injectable({ providedIn: "root" })
export class FileContainerService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor(
    "api/file-containers"
  );

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService
  ) {}

  create(fileContainer: IFileContainer): Observable<EntityResponseType> {
    return this.http.post<IFileContainer>(this.resourceUrl, fileContainer, {
      observe: "response",
    });
  }

  update(fileContainer: IFileContainer): Observable<EntityResponseType> {
    return this.http.put<IFileContainer>(
      `${this.resourceUrl}/${
        getFileContainerIdentifier(fileContainer) as number
      }`,
      fileContainer,
      { observe: "response" }
    );
  }

  partialUpdate(fileContainer: IFileContainer): Observable<EntityResponseType> {
    return this.http.patch<IFileContainer>(
      `${this.resourceUrl}/${
        getFileContainerIdentifier(fileContainer) as number
      }`,
      fileContainer,
      { observe: "response" }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFileContainer>(`${this.resourceUrl}/${id}`, {
      observe: "response",
    });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFileContainer[]>(this.resourceUrl, {
      params: options,
      observe: "response",
    });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, {
      observe: "response",
    });
  }

  addFileContainerToCollectionIfMissing(
    fileContainerCollection: IFileContainer[],
    ...fileContainersToCheck: (IFileContainer | null | undefined)[]
  ): IFileContainer[] {
    const fileContainers: IFileContainer[] =
      fileContainersToCheck.filter(isPresent);
    if (fileContainers.length > 0) {
      const fileContainerCollectionIdentifiers = fileContainerCollection.map(
        (fileContainerItem) => getFileContainerIdentifier(fileContainerItem)!
      );
      const fileContainersToAdd = fileContainers.filter((fileContainerItem) => {
        const fileContainerIdentifier =
          getFileContainerIdentifier(fileContainerItem);
        if (
          fileContainerIdentifier == null ||
          fileContainerCollectionIdentifiers.includes(fileContainerIdentifier)
        ) {
          return false;
        }
        fileContainerCollectionIdentifiers.push(fileContainerIdentifier);
        return true;
      });
      return [...fileContainersToAdd, ...fileContainerCollection];
    }
    return fileContainerCollection;
  }
}
