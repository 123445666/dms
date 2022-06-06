import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { finalize, map } from "rxjs/operators";

import dayjs from "dayjs/esm";
import { DATE_TIME_FORMAT } from "app/config/input.constants";

import { IEmployee, Employee } from "../employee.model";
import { EmployeeService } from "../service/employee.service";
import { AlertError } from "app/shared/alert/alert-error.model";
import {
    EventManager,
    EventWithContent,
} from "app/core/util/event-manager.service";
import { DataUtils, FileLoadError } from "app/core/util/data-util.service";
import { IUser } from "app/entities/user/user.model";
import { UserService } from "app/entities/user/user.service";
import { IDepartment } from "app/entities/department/department.model";
import { DepartmentService } from "app/entities/department/service/department.service";

import SignaturePad from 'signature_pad';

@Component({
    selector: "jhi-employee-update",
    templateUrl: "./employee-update.component.html",
    styleUrls: ["./employee-update.component.scss"],
})
export class EmployeeUpdateComponent implements OnInit, AfterViewInit {
    isSaving = false;
    signatureImg: string | undefined;

    signaturePad: SignaturePad | undefined;
    @ViewChild("canvas") canvasEl: ElementRef | undefined;

    usersSharedCollection: IUser[] = [];
    employeesSharedCollection: IEmployee[] = [];
    departmentsSharedCollection: IDepartment[] = [];

    editForm = this.fb.group({
        id: [],
        firstName: [],
        lastName: [],
        email: [],
        phoneNumber: [],
        hireDate: [],
        title: [],
        signature: [],
        signatureContentType: [],
        user: [],
        manager: [],
        department: [],
    });

    constructor(
        protected dataUtils: DataUtils,
        protected eventManager: EventManager,
        protected employeeService: EmployeeService,
        protected userService: UserService,
        protected departmentService: DepartmentService,
        protected activatedRoute: ActivatedRoute,
        protected fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe(({ employee }) => {
            if (employee.id === undefined) {
                const today = dayjs().startOf("day");
                employee.hireDate = today;
            }

            this.updateForm(employee);

            this.loadRelationshipsOptions();
        });
    }

    ngAfterViewInit(): void {
        this.signaturePad = new SignaturePad(this.canvasEl?.nativeElement);

        const dataUrl = this.dataUtils.createFileFromData(
            this.editForm.get('signature')!.value,
            this.editForm.get('signatureContentType')!.value
        );

        this.signatureImg = this.editForm.get('signature')!.value;
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
        const employee = this.createFromForm();

        if (!this.signaturePad?.isEmpty()) {

            const base64Data = this.signaturePad?.toDataURL();
            this.signatureImg = base64Data ?? "";

            const encoded_image = base64Data?.split(",")[1] ?? "";

            employee.signature = encoded_image;
            employee.signatureContentType = "image/png";
        }

        if (employee.id !== undefined) {
            this.subscribeToSaveResponse(this.employeeService.update(employee));
        } else {
            this.subscribeToSaveResponse(this.employeeService.create(employee));
        }
    }

    trackUserById(_index: number, item: IUser): string {
        return item.id!;
    }

    trackEmployeeById(_index: number, item: IEmployee): number {
        return item.id!;
    }

    trackDepartmentById(_index: number, item: IDepartment): number {
        return item.id!;
    }

    protected subscribeToSaveResponse(
        result: Observable<HttpResponse<IEmployee>>
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

    protected updateForm(employee: IEmployee): void {
        this.editForm.patchValue({
            id: employee.id,
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            phoneNumber: employee.phoneNumber,
            hireDate: employee.hireDate
                ? employee.hireDate.format(DATE_TIME_FORMAT)
                : null,
            title: employee.title,
            signature: employee.signature,
            signatureContentType: employee.signatureContentType,
            user: employee.user,
            manager: employee.manager,
            department: employee.department,
        });

        this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(
            this.usersSharedCollection,
            employee.user
        );
        this.employeesSharedCollection =
            this.employeeService.addEmployeeToCollectionIfMissing(
                this.employeesSharedCollection,
                employee.manager
            );
        this.departmentsSharedCollection =
            this.departmentService.addDepartmentToCollectionIfMissing(
                this.departmentsSharedCollection,
                employee.department
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
                        this.editForm.get("user")!.value
                    )
                )
            )
            .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

        this.employeeService
            .query()
            .pipe(map((res: HttpResponse<IEmployee[]>) => res.body ?? []))
            .pipe(
                map((employees: IEmployee[]) =>
                    this.employeeService.addEmployeeToCollectionIfMissing(
                        employees,
                        this.editForm.get("manager")!.value
                    )
                )
            )
            .subscribe(
                (employees: IEmployee[]) => (this.employeesSharedCollection = employees)
            );

        this.departmentService
            .query()
            .pipe(map((res: HttpResponse<IDepartment[]>) => res.body ?? []))
            .pipe(
                map((departments: IDepartment[]) =>
                    this.departmentService.addDepartmentToCollectionIfMissing(
                        departments,
                        this.editForm.get("department")!.value
                    )
                )
            )
            .subscribe(
                (departments: IDepartment[]) =>
                    (this.departmentsSharedCollection = departments)
            );
    }

    protected createFromForm(): IEmployee {

        return {
            ...new Employee(),
            id: this.editForm.get(["id"])!.value,
            firstName: this.editForm.get(["firstName"])!.value,
            lastName: this.editForm.get(["lastName"])!.value,
            email: this.editForm.get(["email"])!.value,
            phoneNumber: this.editForm.get(["phoneNumber"])!.value,
            hireDate: this.editForm.get(["hireDate"])!.value
                ? dayjs(this.editForm.get(["hireDate"])!.value, DATE_TIME_FORMAT)
                : undefined,
            title: this.editForm.get(["title"])!.value,
            signatureContentType: this.editForm.get(["signatureContentType"])!.value,
            signature: this.editForm.get(["signature"])!.value,
            user: this.editForm.get(["user"])!.value,
            manager: this.editForm.get(["manager"])!.value,
            department: this.editForm.get(["department"])!.value,
        };
    }
}
