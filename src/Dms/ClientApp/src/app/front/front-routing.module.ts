import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: "file-manager",
                data: {
                    pageTitle: "dmsApp.fileContainer.home.title"
                },
                loadChildren: () =>
                    import("./file-manager/file-manager.module").then((m) => m.FileManagerModule),
            },
            {
                path: "esign",
                data: {
                    pageTitle: "dmsApp.fileContainer.home.title"
                },
                loadChildren: () =>
                    import("./esign/esign.module").then((m) => m.FilePartModule),
            }
            /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
        ]),
    ],
})
export class FrontRoutingModule { }
