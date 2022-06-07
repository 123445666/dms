import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Authority } from "app/config/authority.constants";

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: "file-manager",
                data: {
                    pageTitle: "dmsApp.fileContainer.home.title",
                    authorities: [Authority.ADMIN]
                },
                loadChildren: () =>
                    import("./file-manager/file-manager.module").then((m) => m.FileManagerModule),
            }
            /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
        ]),
    ],
})
export class FrontRoutingModule { }
