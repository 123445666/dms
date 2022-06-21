import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpResponse } from "@angular/common/http";

import { FilePartService } from "../service/esign.service";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";

import { IFilePart } from "../esign.model";
import { DataUtils } from "app/core/util/data-util.service";
import { FileStatus } from "app/entities/enumerations/file-status.model";

@Component({
    selector: "jhi-file-part-detail",
    templateUrl: "./esign-detail.component.html",
})
export class FilePartDetailComponent implements OnInit {
    filePart: IFilePart | null = null;
    isSaving = false;
    isSigned = false;

    constructor(
        protected dataUtils: DataUtils,
        protected filePartService: FilePartService,
        protected activatedRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe(({ filePart }) => {
            this.filePart = filePart;
            if (filePart.status === FileStatus.SIGNED) {
                this.isSigned = true;
            }
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

    signFile(id: number | undefined): void {
        this.isSaving = true;
        this.subscribeToSaveResponse(this.filePartService.signFile(id, "SIGNED"));
    }

    protected onSaveSuccess(): void {
        this.previousState();
    }

    protected onSaveError(): void {
        // Api for inheritance.
    }

    protected onSaveFinalize(): void {
        this.isSaving = false;
    }

    protected subscribeToSaveResponse(
        result: Observable<HttpResponse<IFilePart>>
    ): void {
        result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
            next: () => this.onSaveSuccess(),
            error: () => this.onSaveError(),
        });
    }
}
