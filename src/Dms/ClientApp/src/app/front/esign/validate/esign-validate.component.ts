import { Component, OnInit } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { finalize, map } from "rxjs/operators";

import { IEsignValidate, EsignValidate } from "../esign-validate.model";
import { FilePartService } from "app/front/esign/service/esign.service";
import { AlertError } from "app/shared/alert/alert-error.model";
import {
    EventManager,
    EventWithContent,
} from "app/core/util/event-manager.service";
import { DataUtils, FileLoadError } from "app/core/util/data-util.service";
import { IUser } from "app/entities/user/user.model";
import { UserService } from "app/entities/user/user.service";
import { IFileContainer } from "app/entities/file-container/file-container.model";
import { FileContainerService } from "app/entities/file-container/service/file-container.service";

@Component({
    selector: "jhi-file-part-validate",
    templateUrl: "./esign-validate.component.html",
})
export class FilePartValidateComponent implements OnInit {
    isSaving = false;

    usersSharedCollection: IUser[] = [];
    fileContainersSharedCollection: IFileContainer[] = [];

    esignValidateForm = this.fb.group({
        dataContent: [],
        uniqueId: []
    });

    constructor(
        protected dataUtils: DataUtils,
        protected eventManager: EventManager,
        protected filePartService: FilePartService,
        protected userService: UserService,
        protected fileContainerService: FileContainerService,
        protected activatedRoute: ActivatedRoute,
        protected fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.isSaving = false;
    }

    byteSize(base64String: string): string {
        return this.dataUtils.byteSize(base64String);
    }

    openFile(base64String: string, contentType: string | null | undefined): void {
        this.dataUtils.openFile(base64String, contentType);
    }

    setFileData(event: Event, field: string, isImage: boolean): void {
        this.dataUtils
            .loadFileToForm(event, this.esignValidateForm, field, isImage)
            .subscribe({
                error: (err: FileLoadError) =>
                    this.eventManager.broadcast(
                        new EventWithContent<AlertError>("dmsApp.error", {
                            ...err,
                            key: "error.file." + err.key,
                        })
                    ),
            });
    }

    previousState(): void {
        window.history.back();
    }

    validateFile(): void {
        this.isSaving = true;
        const esignValidate = this.createFromForm();

        this.subscribeToSaveResponse(
            this.filePartService.validateFile(esignValidate)
        );
    }

    protected subscribeToSaveResponse(
        result: Observable<HttpResponse<{}>>
    ): void {
        result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
            next: () => this.onSaveSuccess(),
            error: () => this.onSaveError(),
        });
    }

    protected onSaveSuccess(): void {
        // this.previousState();
    }

    protected onSaveError(): void {
        // Api for inheritance.
    }

    protected onSaveFinalize(): void {
        this.isSaving = false;
    }

    protected createFromForm(): IEsignValidate {
        return {
            ...new EsignValidate(),
            dataContent: this.esignValidateForm.get(["dataContent"])!.value,
            uniqueId: this.esignValidateForm.get(["uniqueId"])!.value,
        };

    }
}
