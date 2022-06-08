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
            }
            /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
        ]),
    ],
})
export class FrontRoutingModule { }
