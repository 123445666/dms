import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpResponse } from "@angular/common/http";
import { FormBuilder } from "@angular/forms";

import { FilePartService } from "../service/esign.service";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";

import { IFilePart } from "../esign.model";
import { ISignedDocument, SignedDocument } from "../signed-document.model";
import { DataUtils } from "app/core/util/data-util.service";
import { FileStatus } from "app/entities/enumerations/file-status.model";

import {
    EventManager,
} from "app/core/util/event-manager.service";

import SignaturePad from 'signature_pad';

@Component({
    selector: "jhi-file-part-detail",
    templateUrl: "./esign-detail.component.html",
})
export class FilePartDetailComponent implements OnInit, AfterViewInit {
    filePart: IFilePart | null = null;
    signedDocument: ISignedDocument | null = null;
    isSaving = false;
    isSigned = false;

    signaturePad: SignaturePad | undefined;
    @ViewChild("canvas") canvasEl: ElementRef | undefined;

    editForm = this.fb.group({
        signature: [],
        signatureContentType: [],
    });

    constructor(
        protected dataUtils: DataUtils,
        protected eventManager: EventManager,
        protected filePartService: FilePartService,
        protected activatedRoute: ActivatedRoute,
        protected fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe(({ filePart }) => {
            this.filePart = filePart;
            if (filePart.status === FileStatus.SIGNED) {
                this.isSigned = true;
            }
        });
    }

    ngAfterViewInit(): void {
        this.signaturePad = new SignaturePad(this.canvasEl?.nativeElement);
    }

    onResize(): void {
        // Not a good thing to do but will get you going.
        // I need to look into the Renderer service instead.
        const canvasElement = this.canvasEl?.nativeElement;

        canvasElement.width = canvasElement.offsetWidth;
    }

    startDrawing(event: Event): void {
        /* eslint-disable no-console */
        console.log(event);
        /* eslint-disable no-console */
        // works in device not in browser
    }

    moved(event: Event): void {
        // works in device not in browser
        /* eslint-disable no-console */
        console.log(event);
        /* eslint-disable no-console */
    }

    clearPad(): void {
        this.signaturePad?.clear();
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

        if (!this.signaturePad?.isEmpty()) {

            const base64Data = this.signaturePad?.toDataURL();
            const encoded_image = base64Data?.split(",")[1] ?? "";

            this.signedDocument = new SignedDocument();
            this.signedDocument.fileId = id;
            this.signedDocument.signedData = encoded_image;
        }

        this.subscribeToSaveResponse(this.filePartService.signFile(this.signedDocument));
    }

    unsignFile(id: number | undefined): void {
        this.isSaving = true;
        this.subscribeToSaveResponse(this.filePartService.unsignFile(id));
    }

    processFile(id: number | undefined): void {
        this.isSaving = true;
        this.subscribeToSaveResponse(this.filePartService.processFile(id));
    }

    returnFile(id: number | undefined): void {
        this.isSaving = true;
        this.subscribeToSaveResponse(this.filePartService.returnFile(id));
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
