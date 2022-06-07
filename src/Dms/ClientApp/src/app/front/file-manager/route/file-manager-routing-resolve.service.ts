import { Injectable } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { Resolve, ActivatedRouteSnapshot, Router } from "@angular/router";
import { Observable, of, EMPTY } from "rxjs";
import { mergeMap } from "rxjs/operators";

import { IFileManager, FileManager } from "../file-manager.model";
import { FileManagerService } from "../service/file-manager.service";

@Injectable({ providedIn: "root" })
export class FileManagerRoutingResolveService
  implements Resolve<IFileManager>
{
  constructor(
    protected service: FileManagerService,
    protected router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<IFileManager> | Observable<never> {
    const id = route.params["id"];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((fileManager: HttpResponse<FileManager>) => {
            if (fileManager.body) {
                return of(fileManager.body);
          } else {
            this.router.navigate(["404"]);
            return EMPTY;
          }
        })
      );
    }
    return of(new FileManager());
  }
}
