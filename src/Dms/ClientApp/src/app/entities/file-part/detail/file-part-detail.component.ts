import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { IFilePart } from "../file-part.model";
import { DataUtils } from "app/core/util/data-util.service";

@Component({
  selector: "jhi-file-part-detail",
  templateUrl: "./file-part-detail.component.html",
})
export class FilePartDetailComponent implements OnInit {
  filePart: IFilePart | null = null;

  constructor(
    protected dataUtils: DataUtils,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ filePart }) => {
      this.filePart = filePart;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
