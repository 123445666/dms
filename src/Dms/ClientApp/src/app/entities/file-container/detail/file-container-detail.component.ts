import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { IFileContainer } from "../file-container.model";

@Component({
  selector: "jhi-file-container-detail",
  templateUrl: "./file-container-detail.component.html",
})
export class FileContainerDetailComponent implements OnInit {
  fileContainer: IFileContainer | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fileContainer }) => {
      this.fileContainer = fileContainer;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
