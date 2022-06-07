import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpResponse } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { of, Subject, from } from "rxjs";

import { FileManagerService } from "../service/file-manager.service";
import { IFileManager, FileManager } from "../file-manager.model";

import { IUser } from "app/entities/user/user.model";
import { UserService } from "app/entities/user/user.service";

import { FileManagerUpdateComponent } from "./file-manager-update.component";

describe("FileManager Management Update Component", () => {
  let comp: FileManagerUpdateComponent;
  let fixture: ComponentFixture<FileManagerUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let FileManagerService: FileManagerService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FileManagerUpdateComponent],
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
      .overrideTemplate(FileManagerUpdateComponent, "")
      .compileComponents();

    fixture = TestBed.createComponent(FileManagerUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    FileManagerService = TestBed.inject(FileManagerService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe("ngOnInit", () => {
    it("Should call User query and add missing value", () => {
      const FileManager: IFileManager = { id: 456 };
      const creator: IUser = { id: "295bd559-0aed-4705-a9fe-e18997b77b5f" };
      FileManager.creator = creator;
      const owner: IUser = { id: "45ffc430-23ee-4165-9375-414a392d1d45" };
      FileManager.owner = owner;

      const userCollection: IUser[] = [
        { id: "c94be457-35e2-4f8b-a88b-e8f184ebc30a" },
      ];
      jest
        .spyOn(userService, "query")
        .mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [creator, owner];
      const expectedCollection: IUser[] = [
        ...additionalUsers,
        ...userCollection,
      ];
      jest
        .spyOn(userService, "addUserToCollectionIfMissing")
        .mockReturnValue(expectedCollection);

      activatedRoute.data = of({ FileManager });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it("Should update editForm", () => {
      const FileManager: IFileManager = { id: 456 };
      const creator: IUser = { id: "125e6986-4949-4500-a9a5-5591428b85e8" };
      FileManager.creator = creator;
      const owner: IUser = { id: "84d5cd42-251b-42cf-a145-3fdd0f3e8ee9" };
      FileManager.owner = owner;

      activatedRoute.data = of({ FileManager });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(
        expect.objectContaining(FileManager)
      );
      expect(comp.usersSharedCollection).toContain(creator);
      expect(comp.usersSharedCollection).toContain(owner);
    });
  });

  describe("save", () => {
    it("Should call update service on save for existing entity", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FileManager>>();
      const FileManager = { id: 123 };
      jest.spyOn(FileManagerService, "update").mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ FileManager });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: FileManager }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(FileManagerService.update).toHaveBeenCalledWith(FileManager);
      expect(comp.isSaving).toEqual(false);
    });

    it("Should call create service on save for new entity", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FileManager>>();
      const FileManager = new FileManager();
      jest.spyOn(FileManagerService, "create").mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ FileManager });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: FileManager }));
      saveSubject.complete();

      // THEN
      expect(FileManagerService.create).toHaveBeenCalledWith(FileManager);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it("Should set isSaving to false on error", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FileManager>>();
      const FileManager = { id: 123 };
      jest.spyOn(FileManagerService, "update").mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ FileManager });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error("This is an error!");

      // THEN
      expect(FileManagerService.update).toHaveBeenCalledWith(FileManager);
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
  });
});
