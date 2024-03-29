import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpResponse } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { of, Subject, from } from "rxjs";

import { EmployeeService } from "../service/employee.service";
import { IEmployee, Employee } from "../employee.model";

import { IUser } from "app/entities/user/user.model";
import { UserService } from "app/entities/user/user.service";
import { IDepartment } from "app/entities/department/department.model";
import { DepartmentService } from "app/entities/department/service/department.service";

import { EmployeeUpdateComponent } from "./employee-update.component";

describe("Employee Management Update Component", () => {
  let comp: EmployeeUpdateComponent;
  let fixture: ComponentFixture<EmployeeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let employeeService: EmployeeService;
  let userService: UserService;
  let departmentService: DepartmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EmployeeUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(EmployeeUpdateComponent, "")
      .compileComponents();

    fixture = TestBed.createComponent(EmployeeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    employeeService = TestBed.inject(EmployeeService);
    userService = TestBed.inject(UserService);
    departmentService = TestBed.inject(DepartmentService);

    comp = fixture.componentInstance;
  });

  describe("ngOnInit", () => {
    it("Should call User query and add missing value", () => {
      const employee: IEmployee = { id: 456 };
      const user: IUser = { id: "d0ae2780-9611-40fc-b61f-db1ae916867e" };
      employee.user = user;

      const userCollection: IUser[] = [
        { id: "a74170c4-0b2d-4b66-9369-988ef3f5ec85" },
      ];
      jest
        .spyOn(userService, "query")
        .mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [
        ...additionalUsers,
        ...userCollection,
      ];
      jest
        .spyOn(userService, "addUserToCollectionIfMissing")
        .mockReturnValue(expectedCollection);

      activatedRoute.data = of({ employee });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it("Should call Employee query and add missing value", () => {
      const employee: IEmployee = { id: 456 };
      const manager: IEmployee = { id: 4374 };
      employee.manager = manager;

      const employeeCollection: IEmployee[] = [{ id: 10177 }];
      jest
        .spyOn(employeeService, "query")
        .mockReturnValue(of(new HttpResponse({ body: employeeCollection })));
      const additionalEmployees = [manager];
      const expectedCollection: IEmployee[] = [
        ...additionalEmployees,
        ...employeeCollection,
      ];
      jest
        .spyOn(employeeService, "addEmployeeToCollectionIfMissing")
        .mockReturnValue(expectedCollection);

      activatedRoute.data = of({ employee });
      comp.ngOnInit();

      expect(employeeService.query).toHaveBeenCalled();
      expect(
        employeeService.addEmployeeToCollectionIfMissing
      ).toHaveBeenCalledWith(employeeCollection, ...additionalEmployees);
      expect(comp.employeesSharedCollection).toEqual(expectedCollection);
    });

    it("Should call Department query and add missing value", () => {
      const employee: IEmployee = { id: 456 };
      const department: IDepartment = { id: 35363 };
      employee.department = department;

      const departmentCollection: IDepartment[] = [{ id: 78278 }];
      jest
        .spyOn(departmentService, "query")
        .mockReturnValue(of(new HttpResponse({ body: departmentCollection })));
      const additionalDepartments = [department];
      const expectedCollection: IDepartment[] = [
        ...additionalDepartments,
        ...departmentCollection,
      ];
      jest
        .spyOn(departmentService, "addDepartmentToCollectionIfMissing")
        .mockReturnValue(expectedCollection);

      activatedRoute.data = of({ employee });
      comp.ngOnInit();

      expect(departmentService.query).toHaveBeenCalled();
      expect(
        departmentService.addDepartmentToCollectionIfMissing
      ).toHaveBeenCalledWith(departmentCollection, ...additionalDepartments);
      expect(comp.departmentsSharedCollection).toEqual(expectedCollection);
    });

    it("Should update editForm", () => {
      const employee: IEmployee = { id: 456 };
      const user: IUser = { id: "25199731-a0f0-4da7-9cca-ad8f0d6af10e" };
      employee.user = user;
      const manager: IEmployee = { id: 79320 };
      employee.manager = manager;
      const department: IDepartment = { id: 60127 };
      employee.department = department;

      activatedRoute.data = of({ employee });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(employee));
      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.employeesSharedCollection).toContain(manager);
      expect(comp.departmentsSharedCollection).toContain(department);
    });
  });

  describe("save", () => {
    it("Should call update service on save for existing entity", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Employee>>();
      const employee = { id: 123 };
      jest.spyOn(employeeService, "update").mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ employee });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: employee }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(employeeService.update).toHaveBeenCalledWith(employee);
      expect(comp.isSaving).toEqual(false);
    });

    it("Should call create service on save for new entity", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Employee>>();
      const employee = new Employee();
      jest.spyOn(employeeService, "create").mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ employee });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: employee }));
      saveSubject.complete();

      // THEN
      expect(employeeService.create).toHaveBeenCalledWith(employee);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it("Should set isSaving to false on error", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Employee>>();
      const employee = { id: 123 };
      jest.spyOn(employeeService, "update").mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ employee });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error("This is an error!");

      // THEN
      expect(employeeService.update).toHaveBeenCalledWith(employee);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe("Tracking relationships identifiers", () => {
    describe("trackUserById", () => {
      it("Should return tracked User primary key", () => {
        const entity = { id: "ABC" };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe("trackEmployeeById", () => {
      it("Should return tracked Employee primary key", () => {
        const entity = { id: 123 };
        const trackResult = comp.trackEmployeeById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe("trackDepartmentById", () => {
      it("Should return tracked Department primary key", () => {
        const entity = { id: 123 };
        const trackResult = comp.trackDepartmentById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
