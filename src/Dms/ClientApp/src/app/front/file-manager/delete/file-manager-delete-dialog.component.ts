import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { IFileManager } from "../file-manager.model";
import { FileManagerService } from "../service/file-manager.service";

@Component({
    templateUrl: "./file-manager-delete-dialog.component.html",
})
export class FileManagerDeleteDialogComponent {
  fileManager?: IFileManager;

  constructor(
    protected fileManagerService: FileManagerService,
    protected activeModal: NgbActiveModal
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.fileManagerService.delete(id).subscribe(() => {
      this.activeModal.close("deleted");
    });
  }
}
