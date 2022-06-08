import { NgModule } from "@angular/core";
import { SharedModule } from "app/shared/shared.module";
import { FileManagerComponent } from "./list/file-manager.component";
import { FileManagerDetailComponent } from "./detail/file-manager-detail.component";
import { FileManagerUpdateComponent } from "./update/file-manager-update.component";
import { FileManagerDeleteDialogComponent } from "./delete/file-manager-delete-dialog.component";
import { FileManagerRoutingModule } from "./route/file-manager-routing.module";

import { FilePartUpdateComponent } from "./components/file-part/file-part-update.component";

@NgModule({
    imports: [SharedModule, FileManagerRoutingModule],
    declarations: [
        FileManagerComponent,
        FileManagerDetailComponent,
        FileManagerUpdateComponent,
        FileManagerDeleteDialogComponent,
        FilePartUpdateComponent,
    ],
    entryComponents: [FileManagerDeleteDialogComponent],
})
export class FileManagerModule { }
