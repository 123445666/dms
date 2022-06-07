import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { UserRouteAccessService } from "app/core/auth/user-route-access.service";
import { FileManagerComponent } from "../list/file-manager.component";
import { FileManagerDetailComponent } from "../detail/file-manager-detail.component";
import { FileManagerUpdateComponent } from "../update/file-manager-update.component";
import { FileManagerRoutingResolveService } from "./file-manager-routing-resolve.service";

const FileManagerRoute: Routes = [
  {
    path: "",
    component: FileManagerComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ":id/view",
    component: FileManagerDetailComponent,
    resolve: {
      fileManager: FileManagerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: "new",
    component: FileManagerUpdateComponent,
    resolve: {
        fileManager: FileManagerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ":id/edit",
    component: FileManagerUpdateComponent,
    resolve: {
        fileManager: FileManagerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(FileManagerRoute)],
  exports: [RouterModule],
})
export class FileManagerRoutingModule {}
