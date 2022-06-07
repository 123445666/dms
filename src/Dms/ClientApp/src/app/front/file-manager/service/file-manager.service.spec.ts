import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";

import { IFileManager, FileManager } from "../file-manager.model";

import { FileManagerService } from "./file-manager.service";

describe("FileManager Service", () => {
  let service: FileManagerService;
  let httpMock: HttpTestingController;
  let elemDefault: IFileManager;
  let expectedResult: IFileManager | IFileManager[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FileManagerService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: "AAAAAAA",
      concurrencyStamp: "AAAAAAA",
    };
  });

  describe("Service methods", () => {
    it("should find an element", () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe((resp) => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: "GET" });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it("should create a FileManager", () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service
        .create(new FileManager())
        .subscribe((resp) => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: "POST" });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it("should update a FileManager", () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: "BBBBBB",
          concurrencyStamp: "BBBBBB",
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service
        .update(expected)
        .subscribe((resp) => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: "PUT" });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it("should partial update a FileManager", () => {
      const patchObject = Object.assign(
        {
          name: "BBBBBB",
        },
        new FileManager()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service
        .partialUpdate(patchObject)
        .subscribe((resp) => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: "PATCH" });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it("should return a list of FileManager", () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: "BBBBBB",
          concurrencyStamp: "BBBBBB",
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe((resp) => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: "GET" });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it("should delete a FileManager", () => {
      service.delete(123).subscribe((resp) => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: "DELETE" });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe("addFileManagerToCollectionIfMissing", () => {
      it("should add a FileManager to an empty array", () => {
        const FileManager: IFileManager = { id: 123 };
        expectedResult = service.addFileManagerToCollectionIfMissing(
          [],
          FileManager
        );
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(FileManager);
      });

      it("should not add a FileManager to an array that contains it", () => {
        const FileManager: IFileManager = { id: 123 };
        const FileManagerCollection: IFileManager[] = [
          {
            ...FileManager,
          },
          { id: 456 },
        ];
        expectedResult = service.addFileManagerToCollectionIfMissing(
          FileManagerCollection,
          FileManager
        );
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a FileManager to an array that doesn't contain it", () => {
        const FileManager: IFileManager = { id: 123 };
        const FileManagerCollection: IFileManager[] = [{ id: 456 }];
        expectedResult = service.addFileManagerToCollectionIfMissing(
          FileManagerCollection,
          FileManager
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(FileManager);
      });

      it("should add only unique FileManager to an array", () => {
        const FileManagerArray: IFileManager[] = [
          { id: 123 },
          { id: 456 },
          { id: 94332 },
        ];
        const FileManagerCollection: IFileManager[] = [{ id: 123 }];
        expectedResult = service.addFileManagerToCollectionIfMissing(
          FileManagerCollection,
          ...FileManagerArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it("should accept varargs", () => {
        const FileManager: IFileManager = { id: 123 };
        const FileManager2: IFileManager = { id: 456 };
        expectedResult = service.addFileManagerToCollectionIfMissing(
          [],
          FileManager,
          FileManager2
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(FileManager);
        expect(expectedResult).toContain(FileManager2);
      });

      it("should accept null and undefined values", () => {
        const FileManager: IFileManager = { id: 123 };
        expectedResult = service.addFileManagerToCollectionIfMissing(
          [],
          null,
          FileManager,
          undefined
        );
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(FileManager);
      });

      it("should return initial array if no FileManager is added", () => {
        const FileManagerCollection: IFileManager[] = [{ id: 123 }];
        expectedResult = service.addFileManagerToCollectionIfMissing(
          FileManagerCollection,
          undefined,
          null
        );
        expect(expectedResult).toEqual(FileManagerCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
