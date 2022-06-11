import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";

import { isPresent } from "app/core/util/operators";
import { ApplicationConfigService } from "app/core/config/application-config.service";
import { createRequestOption } from "app/core/request/request-util";
import { IFilePart, getFilePartIdentifier } from "../esign.model";

export type EntityResponseType = HttpResponse<IFilePart>;
export type EntityArrayResponseType = HttpResponse<IFilePart[]>;

@Injectable({ providedIn: "root" })
export class FilePartService {
  protected resourceUrl =
    this.applicationConfigService.getEndpointFor("api/file-parts");

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService
  ) {}

  create(filePart: IFilePart): Observable<EntityResponseType> {
    return this.http.post<IFilePart>(this.resourceUrl, filePart, {
      observe: "response",
    });
  }

  update(filePart: IFilePart): Observable<EntityResponseType> {
    return this.http.put<IFilePart>(
      `${this.resourceUrl}/${getFilePartIdentifier(filePart) as number}`,
      filePart,
      { observe: "response" }
    );
  }

  partialUpdate(filePart: IFilePart): Observable<EntityResponseType> {
    return this.http.patch<IFilePart>(
      `${this.resourceUrl}/${getFilePartIdentifier(filePart) as number}`,
      filePart,
      { observe: "response" }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFilePart>(`${this.resourceUrl}/${id}`, {
      observe: "response",
    });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFilePart[]>(this.resourceUrl, {
      params: options,
      observe: "response",
    });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, {
      observe: "response",
    });
  }

  addFilePartToCollectionIfMissing(
    filePartCollection: IFilePart[],
    ...filePartsToCheck: (IFilePart | null | undefined)[]
  ): IFilePart[] {
    const fileParts: IFilePart[] = filePartsToCheck.filter(isPresent);
    if (fileParts.length > 0) {
      const filePartCollectionIdentifiers = filePartCollection.map(
        (filePartItem) => getFilePartIdentifier(filePartItem)!
      );
      const filePartsToAdd = fileParts.filter((filePartItem) => {
        const filePartIdentifier = getFilePartIdentifier(filePartItem);
        if (
          filePartIdentifier == null ||
          filePartCollectionIdentifiers.includes(filePartIdentifier)
        ) {
          return false;
        }
        filePartCollectionIdentifiers.push(filePartIdentifier);
        return true;
      });
      return [...filePartsToAdd, ...filePartCollection];
    }
    return filePartCollection;
  }
}
