import { Component, OnInit } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { IFileContainer } from "../file-container.model";
import { FileContainerService } from "../service/file-container.service";
import { FileContainerDeleteDialogComponent } from "../delete/file-container-delete-dialog.component";

@Component({
  selector: "jhi-file-container",
  templateUrl: "./file-container.component.html",
})
export class FileContainerComponent implements OnInit {
  fileContainers?: IFileContainer[];
  isLoading = false;

  constructor(
    protected fileContainerService: FileContainerService,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.isLoading = true;

    this.fileContainerService.query().subscribe({
      next: (res: HttpResponse<IFileContainer[]>) => {
        this.isLoading = false;
        this.fileContainers = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IFileContainer): number {
    return item.id!;
  }

  delete(fileContainer: IFileContainer): void {
    const modalRef = this.modalService.open(
      FileContainerDeleteDialogComponent,
      { size: "lg", backdrop: "static" }
    );
    modalRef.componentInstance.fileContainer = fileContainer;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe((reason) => {
      if (reason === "deleted") {
        this.loadAll();
      }
    });
  }
}
