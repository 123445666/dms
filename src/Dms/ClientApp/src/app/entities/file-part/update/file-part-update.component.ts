import { Component, OnInit } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { finalize, map } from "rxjs/operators";

import { IFilePart, FilePart } from "../file-part.model";
import { FilePartService } from "../service/file-part.service";
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
import { FileStatus } from "app/entities/enumerations/file-status.model";

@Component({
  selector: "jhi-file-part-update",
  templateUrl: "./file-part-update.component.html",
})
export class FilePartUpdateComponent implements OnInit {
  isSaving = false;
  fileStatusValues = Object.keys(FileStatus);

  usersSharedCollection: IUser[] = [];
  fileContainersSharedCollection: IFileContainer[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    content: [],
    contentContentType: [],
    concurrencyStamp: [],
    status: [],
    signer: [],
    fileContainer: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected filePartService: FilePartService,
    protected userService: UserService,
    protected fileContainerService: FileContainerService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ filePart }) => {
      this.updateForm(filePart);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils
      .loadFileToForm(event, this.editForm, field, isImage)
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

  save(): void {
    this.isSaving = true;
    const filePart = this.createFromForm();
    if (filePart.id !== undefined) {
      this.subscribeToSaveResponse(this.filePartService.update(filePart));
    } else {
      this.subscribeToSaveResponse(this.filePartService.create(filePart));
    }
  }

  trackUserById(_index: number, item: IUser): string {
    return item.id!;
  }

  trackFileContainerById(_index: number, item: IFileContainer): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(
    result: Observable<HttpResponse<IFilePart>>
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

  protected updateForm(filePart: IFilePart): void {
    this.editForm.patchValue({
      id: filePart.id,
      name: filePart.name,
      content: filePart.content,
      contentContentType: filePart.contentContentType,
      concurrencyStamp: filePart.concurrencyStamp,
      status: filePart.status,
      signer: filePart.signer,
      fileContainer: filePart.fileContainer,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(
      this.usersSharedCollection,
      filePart.signer
    );
    this.fileContainersSharedCollection =
      this.fileContainerService.addFileContainerToCollectionIfMissing(
        this.fileContainersSharedCollection,
        filePart.fileContainer
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
            this.editForm.get("signer")!.value
          )
        )
      )
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.fileContainerService
      .query()
      .pipe(map((res: HttpResponse<IFileContainer[]>) => res.body ?? []))
      .pipe(
        map((fileContainers: IFileContainer[]) =>
          this.fileContainerService.addFileContainerToCollectionIfMissing(
            fileContainers,
            this.editForm.get("fileContainer")!.value
          )
        )
      )
      .subscribe(
        (fileContainers: IFileContainer[]) =>
          (this.fileContainersSharedCollection = fileContainers)
      );
  }

  protected createFromForm(): IFilePart {
    return {
      ...new FilePart(),
      id: this.editForm.get(["id"])!.value,
      name: this.editForm.get(["name"])!.value,
      contentContentType: this.editForm.get(["contentContentType"])!.value,
      content: this.editForm.get(["content"])!.value,
      concurrencyStamp: this.editForm.get(["concurrencyStamp"])!.value,
      status: this.editForm.get(["status"])!.value,
      signer: this.editForm.get(["signer"])!.value,
      fileContainer: this.editForm.get(["fileContainer"])!.value,
    };
  }
}
