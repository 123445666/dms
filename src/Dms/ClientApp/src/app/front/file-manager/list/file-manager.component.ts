import { Component, OnInit } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { IFileManager } from "../file-manager.model";
import { FileManagerService } from "../service/file-manager.service";
import { FileManagerDeleteDialogComponent } from "../delete/file-manager-delete-dialog.component";

@Component({
    selector: "jhi-file-manager",
    templateUrl: "./file-manager.component.html",
})
export class FileManagerComponent implements OnInit {
  fileManagers?: IFileManager[];
  isLoading = false;

  constructor(
    protected fileManagerService: FileManagerService,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.isLoading = true;

    this.fileManagerService.query().subscribe({
      next: (res: HttpResponse<IFileManager[]>) => {
        this.isLoading = false;
            this.fileManagers = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IFileManager): number {
    return item.id!;
  }

  delete(FileManager: IFileManager): void {
    const modalRef = this.modalService.open(
      FileManagerDeleteDialogComponent,
      { size: "lg", backdrop: "static" }
    );
    modalRef.componentInstance.FileManager = FileManager;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe((reason) => {
      if (reason === "deleted") {
        this.loadAll();
      }
    });
  }
}
