import { NgModule } from "@angular/core";
import { SharedModule } from "app/shared/shared.module";
import { FileContainerComponent } from "./list/file-container.component";
import { FileContainerDetailComponent } from "./detail/file-container-detail.component";
import { FileContainerUpdateComponent } from "./update/file-container-update.component";
import { FileContainerDeleteDialogComponent } from "./delete/file-container-delete-dialog.component";
import { FileContainerRoutingModule } from "./route/file-container-routing.module";

@NgModule({
  imports: [SharedModule, FileContainerRoutingModule],
  declarations: [
    FileContainerComponent,
    FileContainerDetailComponent,
    FileContainerUpdateComponent,
    FileContainerDeleteDialogComponent,
  ],
  entryComponents: [FileContainerDeleteDialogComponent],
})
export class FileContainerModule {}
