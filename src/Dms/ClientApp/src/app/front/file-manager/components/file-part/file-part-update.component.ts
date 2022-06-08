import { Component, OnInit } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { finalize, map } from "rxjs/operators";

import { IFilePart, FilePart } from "app/entities/file-part/file-part.model";
import { FilePartService } from "app/entities/file-part/service/file-part.service";
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

import { IFileManager } from "../../file-manager.model";

@Component({
  selector: "jhi-file-part-update",
  templateUrl: "./file-part-update.component.html",
})
export class FilePartUpdateComponent implements OnInit {
  isSaving = false;
  fileStatusValues = Object.keys(FileStatus);

  usersSharedCollection: IUser[] = [];
  fileContainersSharedCollection: IFileContainer[] = [];

  editFilePartForm = this.fb.group({
    fileParts: this.fb.array([])
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

  get fileParts(): FormArray {
    return this.editFilePartForm.controls["fileParts"] as FormArray;
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fileManager }) => {
      this.updateForm(fileManager);

      // this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean, filePartIndex: number): void {
    const filePartsFormGroup: FormGroup = this.fileParts.at(filePartIndex) as FormGroup;

    this.dataUtils
      .loadFileToForm(event, filePartsFormGroup, field, isImage)
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

  addFilePart(): void {
    const filePartForm = this.fb.group({
      id: [],
      name: [],
      content: [],
      contentContentType: [],
      concurrencyStamp: [],
      status: [],
      signer: [],
      fileContainer: [],
    });

    this.fileParts.push(filePartForm);
  }

  deleteFilePart(filePartIndex: number): void {
    this.fileParts.removeAt(filePartIndex);
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

  protected updateForm(fileManager: IFileManager): void {
    const filePartsData = fileManager.fileParts;

    filePartsData?.forEach(filePartData => {
      const filePartFormData = this.fb.group({
        id: filePartData.id,
        name: filePartData.name,
        content: filePartData.content,
        contentContentType: filePartData.contentContentType,
        concurrencyStamp: filePartData.concurrencyStamp,
        status: filePartData.status,
        signer: filePartData.signer,
        fileContainer: filePartData.fileContainer,
      });

      this.fileParts.push(filePartFormData);
    })


    //const filePartForm = this.fb.group({
    //  id: [],
    //  name: [],
    //  content: [],
    //  contentContentType: [],
    //  concurrencyStamp: [],
    //  status: [],
    //  signer: [],
    //  fileContainer: [],
    //});

    //this.fileParts.push(filePartForm);

    // this.editFilePartForm.patchValue({
    //   id: filePart.id,
    //   name: filePart.name,
    //   content: filePart.content,
    //   contentContentType: filePart.contentContentType,
    //   concurrencyStamp: filePart.concurrencyStamp,
    //   status: filePart.status,
    //   signer: filePart.signer,
    //   fileContainer: filePart.fileContainer,
    // });

    // this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(
    //   this.usersSharedCollection,
    //   filePart.signer
    // );
    // this.fileContainersSharedCollection =
    //   this.fileContainerService.addFileContainerToCollectionIfMissing(
    //     this.fileContainersSharedCollection,
    //     filePart.fileContainer
    //   );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(
        map((users: IUser[]) =>
          this.userService.addUserToCollectionIfMissing(
            users,
            this.editFilePartForm.get("signer")!.value
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
            this.editFilePartForm.get("fileContainer")!.value
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
      id: this.editFilePartForm.get(["id"])!.value,
      name: this.editFilePartForm.get(["name"])!.value,
      contentContentType: this.editFilePartForm.get(["contentContentType"])!.value,
      content: this.editFilePartForm.get(["content"])!.value,
      concurrencyStamp: this.editFilePartForm.get(["concurrencyStamp"])!.value,
      status: this.editFilePartForm.get(["status"])!.value,
      signer: this.editFilePartForm.get(["signer"])!.value,
      fileContainer: this.editFilePartForm.get(["fileContainer"])!.value,
    };
  }
}
