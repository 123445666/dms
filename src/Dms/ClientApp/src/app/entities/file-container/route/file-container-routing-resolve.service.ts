import { Injectable } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { Resolve, ActivatedRouteSnapshot, Router } from "@angular/router";
import { Observable, of, EMPTY } from "rxjs";
import { mergeMap } from "rxjs/operators";

import { IFileContainer, FileContainer } from "../file-container.model";
import { FileContainerService } from "../service/file-container.service";

@Injectable({ providedIn: "root" })
export class FileContainerRoutingResolveService
  implements Resolve<IFileContainer>
{
  constructor(
    protected service: FileContainerService,
    protected router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<IFileContainer> | Observable<never> {
    const id = route.params["id"];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((fileContainer: HttpResponse<FileContainer>) => {
          if (fileContainer.body) {
            return of(fileContainer.body);
          } else {
            this.router.navigate(["404"]);
            return EMPTY;
          }
        })
      );
    }
    return of(new FileContainer());
  }
}
