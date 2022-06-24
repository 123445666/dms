import { NgModule } from "@angular/core";
import { SharedModule } from "app/shared/shared.module";
import { FilePartComponent } from "./list/esign.component";
import { FilePartDetailComponent } from "./detail/esign-detail.component";
import { FilePartUpdateComponent } from "./update/esign-update.component";
import { FilePartDeleteDialogComponent } from "./delete/esign-delete-dialog.component";
import { FilePartValidateComponent } from "./validate/esign-validate.component";
import { FilePartRoutingModule } from "./route/esign-routing.module";

@NgModule({
    imports: [SharedModule, FilePartRoutingModule],
    declarations: [
        FilePartComponent,
        FilePartDetailComponent,
        FilePartUpdateComponent,
        FilePartDeleteDialogComponent,
        FilePartValidateComponent
    ],
    entryComponents: [FilePartDeleteDialogComponent],
})
export class FilePartModule { }
