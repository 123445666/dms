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

@Component({
    selector: "jhi-file-manager-update",
    templateUrl: "./file-manager-update.component.html",
})
export class FileManagerUpdateComponent implements OnInit {
    isSaving = false;

    usersSharedCollection: IUser[] = [];

    editForm = this.fb.group({
        id: [],
        name: [],
        concurrencyStamp: [],
        creator: [],
        owner: [],
    });

    constructor(
        protected fileManagerService: FileManagerService,
        protected userService: UserService,
        protected activatedRoute: ActivatedRoute,
        protected fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe(({ fileManager }) => {
            console.log(fileManager);
            this.updateForm(fileManager);

            this.loadRelationshipsOptions();
        });
    }

    previousState(): void {
        window.history.back();
    }

    save(): void {
        this.isSaving = true;
        const fileManager = this.createFromForm();
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
            creator: fileManager.creator,
            owner: fileManager.owner,
        });

        this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(
            this.usersSharedCollection,
            fileManager.creator,
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
                        this.editForm.get("creator")!.value,
                        this.editForm.get("owner")!.value
                    )
                )
            )
            .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
    }

    protected createFromForm(): IFileManager {
        return {
            ...new FileManager(),
            id: this.editForm.get(["id"])!.value,
            name: this.editForm.get(["name"])!.value,
            concurrencyStamp: this.editForm.get(["concurrencyStamp"])!.value,
            creator: this.editForm.get(["creator"])!.value,
            owner: this.editForm.get(["owner"])!.value,
        };
    }
}
