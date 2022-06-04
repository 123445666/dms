import { Component, OnInit } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { IFilePart } from "../file-part.model";
import { FilePartService } from "../service/file-part.service";
import { FilePartDeleteDialogComponent } from "../delete/file-part-delete-dialog.component";
import { DataUtils } from "app/core/util/data-util.service";

@Component({
  selector: "jhi-file-part",
  templateUrl: "./file-part.component.html",
})
export class FilePartComponent implements OnInit {
  fileParts?: IFilePart[];
  isLoading = false;

  constructor(
    protected filePartService: FilePartService,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.isLoading = true;

    this.filePartService.query().subscribe({
      next: (res: HttpResponse<IFilePart[]>) => {
        this.isLoading = false;
        this.fileParts = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IFilePart): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(filePart: IFilePart): void {
    const modalRef = this.modalService.open(FilePartDeleteDialogComponent, {
      size: "lg",
      backdrop: "static",
    });
    modalRef.componentInstance.filePart = filePart;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe((reason) => {
      if (reason === "deleted") {
        this.loadAll();
      }
    });
  }
}
