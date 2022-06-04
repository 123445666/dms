import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { IFilePart } from "../file-part.model";
import { FilePartService } from "../service/file-part.service";

@Component({
  templateUrl: "./file-part-delete-dialog.component.html",
})
export class FilePartDeleteDialogComponent {
  filePart?: IFilePart;

  constructor(
    protected filePartService: FilePartService,
    protected activeModal: NgbActiveModal
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.filePartService.delete(id).subscribe(() => {
      this.activeModal.close("deleted");
    });
  }
}
