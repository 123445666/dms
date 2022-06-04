import { Component, OnInit } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { finalize, map } from "rxjs/operators";

import { IFileContainer, FileContainer } from "../file-container.model";
import { FileContainerService } from "../service/file-container.service";
import { IUser } from "app/entities/user/user.model";
import { UserService } from "app/entities/user/user.service";

@Component({
  selector: "jhi-file-container-update",
  templateUrl: "./file-container-update.component.html",
})
export class FileContainerUpdateComponent implements OnInit {
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
    protected fileContainerService: FileContainerService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fileContainer }) => {
      this.updateForm(fileContainer);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const fileContainer = this.createFromForm();
    if (fileContainer.id !== undefined) {
      this.subscribeToSaveResponse(
        this.fileContainerService.update(fileContainer)
      );
    } else {
      this.subscribeToSaveResponse(
        this.fileContainerService.create(fileContainer)
      );
    }
  }

  trackUserById(_index: number, item: IUser): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(
    result: Observable<HttpResponse<IFileContainer>>
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

  protected updateForm(fileContainer: IFileContainer): void {
    this.editForm.patchValue({
      id: fileContainer.id,
      name: fileContainer.name,
      concurrencyStamp: fileContainer.concurrencyStamp,
      creator: fileContainer.creator,
      owner: fileContainer.owner,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(
      this.usersSharedCollection,
      fileContainer.creator,
      fileContainer.owner
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

  protected createFromForm(): IFileContainer {
    return {
      ...new FileContainer(),
      id: this.editForm.get(["id"])!.value,
      name: this.editForm.get(["name"])!.value,
      concurrencyStamp: this.editForm.get(["concurrencyStamp"])!.value,
      creator: this.editForm.get(["creator"])!.value,
      owner: this.editForm.get(["owner"])!.value,
    };
  }
}
