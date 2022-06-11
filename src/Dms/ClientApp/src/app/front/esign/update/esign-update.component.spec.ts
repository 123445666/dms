import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpResponse } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { of, Subject, from } from "rxjs";

import { FilePartService } from "../service/esign.service";
import { IFilePart, FilePart } from "../esign.model";

import { IUser } from "app/entities/user/user.model";
import { UserService } from "app/entities/user/user.service";
import { IFileContainer } from "app/entities/file-container/file-container.model";
import { FileContainerService } from "app/entities/file-container/service/file-container.service";

import { FilePartUpdateComponent } from "./esign-update.component";

describe("FilePart Management Update Component", () => {
  let comp: FilePartUpdateComponent;
  let fixture: ComponentFixture<FilePartUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let filePartService: FilePartService;
  let userService: UserService;
  let fileContainerService: FileContainerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FilePartUpdateComponent],
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
      .overrideTemplate(FilePartUpdateComponent, "")
      .compileComponents();

    fixture = TestBed.createComponent(FilePartUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    filePartService = TestBed.inject(FilePartService);
    userService = TestBed.inject(UserService);
    fileContainerService = TestBed.inject(FileContainerService);

    comp = fixture.componentInstance;
  });

  describe("ngOnInit", () => {
    it("Should call User query and add missing value", () => {
      const filePart: IFilePart = { id: 456 };
      const signer: IUser = { id: "5c700c95-57b7-40e9-8e04-a8d5964f6783" };
      filePart.signer = signer;

      const userCollection: IUser[] = [
        { id: "a675e039-59f8-42b2-8acf-64451286303c" },
      ];
      jest
        .spyOn(userService, "query")
        .mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [signer];
      const expectedCollection: IUser[] = [
        ...additionalUsers,
        ...userCollection,
      ];
      jest
        .spyOn(userService, "addUserToCollectionIfMissing")
        .mockReturnValue(expectedCollection);

      activatedRoute.data = of({ filePart });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it("Should call FileContainer query and add missing value", () => {
      const filePart: IFilePart = { id: 456 };
      const fileContainer: IFileContainer = { id: 2675 };
      filePart.fileContainer = fileContainer;

      const fileContainerCollection: IFileContainer[] = [{ id: 43330 }];
      jest
        .spyOn(fileContainerService, "query")
        .mockReturnValue(
          of(new HttpResponse({ body: fileContainerCollection }))
        );
      const additionalFileContainers = [fileContainer];
      const expectedCollection: IFileContainer[] = [
        ...additionalFileContainers,
        ...fileContainerCollection,
      ];
      jest
        .spyOn(fileContainerService, "addFileContainerToCollectionIfMissing")
        .mockReturnValue(expectedCollection);

      activatedRoute.data = of({ filePart });
      comp.ngOnInit();

      expect(fileContainerService.query).toHaveBeenCalled();
      expect(
        fileContainerService.addFileContainerToCollectionIfMissing
      ).toHaveBeenCalledWith(
        fileContainerCollection,
        ...additionalFileContainers
      );
      expect(comp.fileContainersSharedCollection).toEqual(expectedCollection);
    });

    it("Should update editForm", () => {
      const filePart: IFilePart = { id: 456 };
      const signer: IUser = { id: "e0a987e9-5065-465a-871d-995a7dd77939" };
      filePart.signer = signer;
      const fileContainer: IFileContainer = { id: 91870 };
      filePart.fileContainer = fileContainer;

      activatedRoute.data = of({ filePart });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(filePart));
      expect(comp.usersSharedCollection).toContain(signer);
      expect(comp.fileContainersSharedCollection).toContain(fileContainer);
    });
  });

  describe("save", () => {
    it("Should call update service on save for existing entity", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FilePart>>();
      const filePart = { id: 123 };
      jest.spyOn(filePartService, "update").mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ filePart });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: filePart }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(filePartService.update).toHaveBeenCalledWith(filePart);
      expect(comp.isSaving).toEqual(false);
    });

    it("Should call create service on save for new entity", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FilePart>>();
      const filePart = new FilePart();
      jest.spyOn(filePartService, "create").mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ filePart });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: filePart }));
      saveSubject.complete();

      // THEN
      expect(filePartService.create).toHaveBeenCalledWith(filePart);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it("Should set isSaving to false on error", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FilePart>>();
      const filePart = { id: 123 };
      jest.spyOn(filePartService, "update").mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ filePart });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error("This is an error!");

      // THEN
      expect(filePartService.update).toHaveBeenCalledWith(filePart);
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

    describe("trackFileContainerById", () => {
      it("Should return tracked FileContainer primary key", () => {
        const entity = { id: 123 };
        const trackResult = comp.trackFileContainerById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
