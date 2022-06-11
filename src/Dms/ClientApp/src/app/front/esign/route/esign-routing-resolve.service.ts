import { Injectable } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { Resolve, ActivatedRouteSnapshot, Router } from "@angular/router";
import { Observable, of, EMPTY } from "rxjs";
import { mergeMap } from "rxjs/operators";

import { IFilePart, FilePart } from "../esign.model";
import { FilePartService } from "../service/esign.service";

@Injectable({ providedIn: "root" })
export class FilePartRoutingResolveService implements Resolve<IFilePart> {
  constructor(protected service: FilePartService, protected router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<IFilePart> | Observable<never> {
    const id = route.params["id"];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((filePart: HttpResponse<FilePart>) => {
          if (filePart.body) {
            return of(filePart.body);
          } else {
            this.router.navigate(["404"]);
            return EMPTY;
          }
        })
      );
    }
    return of(new FilePart());
  }
}
