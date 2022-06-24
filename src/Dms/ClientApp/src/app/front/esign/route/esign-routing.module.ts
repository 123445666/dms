import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { UserRouteAccessService } from "app/core/auth/user-route-access.service";
import { FilePartComponent } from "../list/esign.component";
import { FilePartDetailComponent } from "../detail/esign-detail.component";
import { FilePartUpdateComponent } from "../update/esign-update.component";
import { FilePartRoutingResolveService } from "./esign-routing-resolve.service";
import { FilePartValidateComponent } from '../validate/esign-validate.component';

const filePartRoute: Routes = [
    {
        path: "",
        component: FilePartComponent,
        canActivate: [UserRouteAccessService],
    },
    {
        path: ":id/view",
        component: FilePartDetailComponent,
        resolve: {
            filePart: FilePartRoutingResolveService,
        },
        canActivate: [UserRouteAccessService],
    },
    {
        path: "new",
        component: FilePartUpdateComponent,
        resolve: {
            filePart: FilePartRoutingResolveService,
        },
        canActivate: [UserRouteAccessService],
    },
    {
        path: ":id/edit",
        component: FilePartUpdateComponent,
        resolve: {
            filePart: FilePartRoutingResolveService,
        },
        canActivate: [UserRouteAccessService],
    },
    {
        path: "validation",
        component: FilePartValidateComponent,
        resolve: {
            filePart: FilePartRoutingResolveService,
        },
        canActivate: [UserRouteAccessService],
    },
];

@NgModule({
    imports: [RouterModule.forChild(filePartRoute)],
    exports: [RouterModule],
})
export class FilePartRoutingModule { }
