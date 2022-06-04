import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { UserRouteAccessService } from "app/core/auth/user-route-access.service";
import { FileContainerComponent } from "../list/file-container.component";
import { FileContainerDetailComponent } from "../detail/file-container-detail.component";
import { FileContainerUpdateComponent } from "../update/file-container-update.component";
import { FileContainerRoutingResolveService } from "./file-container-routing-resolve.service";

const fileContainerRoute: Routes = [
  {
    path: "",
    component: FileContainerComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ":id/view",
    component: FileContainerDetailComponent,
    resolve: {
      fileContainer: FileContainerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: "new",
    component: FileContainerUpdateComponent,
    resolve: {
      fileContainer: FileContainerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ":id/edit",
    component: FileContainerUpdateComponent,
    resolve: {
      fileContainer: FileContainerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(fileContainerRoute)],
  exports: [RouterModule],
})
export class FileContainerRoutingModule {}
