import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { IFileManager } from "../file-manager.model";

@Component({
    selector: "jhi-file-manager-detail",
    templateUrl: "./file-manager-detail.component.html",
})
export class FileManagerDetailComponent implements OnInit {
    fileManager: IFileManager | null = null;

    constructor(protected activatedRoute: ActivatedRoute) { }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe(({ fileManager }) => {
            this.fileManager = fileManager;
        });
    }

    previousState(): void {
        window.history.back();
    }
}
