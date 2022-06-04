import { NgModule } from "@angular/core";
import { SharedModule } from "app/shared/shared.module";
import { FilePartComponent } from "./list/file-part.component";
import { FilePartDetailComponent } from "./detail/file-part-detail.component";
import { FilePartUpdateComponent } from "./update/file-part-update.component";
import { FilePartDeleteDialogComponent } from "./delete/file-part-delete-dialog.component";
import { FilePartRoutingModule } from "./route/file-part-routing.module";

@NgModule({
  imports: [SharedModule, FilePartRoutingModule],
  declarations: [
    FilePartComponent,
    FilePartDetailComponent,
    FilePartUpdateComponent,
    FilePartDeleteDialogComponent,
  ],
  entryComponents: [FilePartDeleteDialogComponent],
})
export class FilePartModule {}
