import { Component, OnInit } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { finalize, map } from "rxjs/operators";

import { IFileManager, FileManager } from "../file-manager.model";
import { FileManagerService } from "../service/file-manager.service";
import { IUser } from "app/entities/user/user.model";
import { UserService } from "app/entities/user/user.service";
import { FilePartUpdateComponent } from "../components/file-part/file-part-update.component";
import { FileStatus } from "app/entities/enumerations/file-status.model";

@Component({
    selector: "jhi-file-manager-update",
    templateUrl: "./file-manager-update.component.html",
})
export class FileManagerUpdateComponent implements OnInit {
    isSaving = false;
    fileStatusValues = Object.keys(FileStatus);

    usersSharedCollection: IUser[] = [];

    editForm = this.fb.group({
        id: [],
        name: [],
        concurrencyStamp: [],
        status: [],
        owner: [],
        fileParts: []
    });

    constructor(
        protected fileManagerService: FileManagerService,
        protected userService: UserService,
        protected activatedRoute: ActivatedRoute,
        protected fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe(({ fileManager }) => {
            this.updateForm(fileManager);

            this.loadRelationshipsOptions();
        });
    }

    previousState(): void {
        window.history.back();
    }

    save(filepart: FilePartUpdateComponent): void {
        this.isSaving = true;
        const fileManager = this.createFromForm(filepart);

        if (fileManager.id !== undefined) {
            this.subscribeToSaveResponse(
                this.fileManagerService.update(fileManager)
            );
        } else {
            this.subscribeToSaveResponse(
                this.fileManagerService.create(fileManager)
            );
        }
    }

    trackUserById(_index: number, item: IUser): string {
        return item.id!;
    }

    protected subscribeToSaveResponse(
        result: Observable<HttpResponse<IFileManager>>
    ): void {
        result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
            next: () => this.onSaveSuccess(),
            error: () => this.onSaveError(),
        });
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

    protected updateForm(fileManager: IFileManager): void {
        this.editForm.patchValue({
            id: fileManager.id,
            name: fileManager.name,
            concurrencyStamp: fileManager.concurrencyStamp,
            status: fileManager.status,
            owner: fileManager.owner,
        });

        this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(
            this.usersSharedCollection,
            fileManager.owner
        );
    }

    protected loadRelationshipsOptions(): void {
        this.userService
            .query()
            .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
            .pipe(
                map((users: IUser[]) =>
                    this.userService.addUserToCollectionIfMissing(
                        users,
                        this.editForm.get("owner")!.value
                    )
                )
            )
            .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
    }

    protected createFromForm(filepart: FilePartUpdateComponent): IFileManager {
        /* eslint-disable no-console */
        console.log(filepart.fileParts.value);
        /* eslint-disable no-console */
        return {
            ...new FileManager(),
            id: this.editForm.get(["id"])!.value,
            name: this.editForm.get(["name"])!.value,
            concurrencyStamp: this.editForm.get(["concurrencyStamp"])!.value,
            status: this.editForm.get(["status"])!.value,
            owner: this.editForm.get(["owner"])!.value,
            fileParts: filepart.fileParts.value,
        };
    }
}
