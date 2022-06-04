import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { IFileContainer } from "../file-container.model";
import { FileContainerService } from "../service/file-container.service";

@Component({
  templateUrl: "./file-container-delete-dialog.component.html",
})
export class FileContainerDeleteDialogComponent {
  fileContainer?: IFileContainer;

  constructor(
    protected fileContainerService: FileContainerService,
    protected activeModal: NgbActiveModal
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.fileContainerService.delete(id).subscribe(() => {
      this.activeModal.close("deleted");
    });
  }
}
