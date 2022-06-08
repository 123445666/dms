import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";

import { FileStatus } from "app/entities/enumerations/file-status.model";
import { IFileContainer, FileContainer } from "../file-container.model";

import { FileContainerService } from "./file-container.service";

describe("FileContainer Service", () => {
  let service: FileContainerService;
  let httpMock: HttpTestingController;
  let elemDefault: IFileContainer;
  let expectedResult: IFileContainer | IFileContainer[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FileContainerService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: "AAAAAAA",
      concurrencyStamp: "AAAAAAA",
      status: FileStatus.NEWLY,
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

    it("should create a FileContainer", () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service
        .create(new FileContainer())
        .subscribe((resp) => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: "POST" });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it("should update a FileContainer", () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: "BBBBBB",
          concurrencyStamp: "BBBBBB",
          status: "BBBBBB",
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

    it("should partial update a FileContainer", () => {
      const patchObject = Object.assign(
        {
          name: "BBBBBB",
          status: "BBBBBB",
        },
        new FileContainer()
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

    it("should return a list of FileContainer", () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: "BBBBBB",
          concurrencyStamp: "BBBBBB",
          status: "BBBBBB",
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

    it("should delete a FileContainer", () => {
      service.delete(123).subscribe((resp) => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: "DELETE" });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe("addFileContainerToCollectionIfMissing", () => {
      it("should add a FileContainer to an empty array", () => {
        const fileContainer: IFileContainer = { id: 123 };
        expectedResult = service.addFileContainerToCollectionIfMissing(
          [],
          fileContainer
        );
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(fileContainer);
      });

      it("should not add a FileContainer to an array that contains it", () => {
        const fileContainer: IFileContainer = { id: 123 };
        const fileContainerCollection: IFileContainer[] = [
          {
            ...fileContainer,
          },
          { id: 456 },
        ];
        expectedResult = service.addFileContainerToCollectionIfMissing(
          fileContainerCollection,
          fileContainer
        );
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a FileContainer to an array that doesn't contain it", () => {
        const fileContainer: IFileContainer = { id: 123 };
        const fileContainerCollection: IFileContainer[] = [{ id: 456 }];
        expectedResult = service.addFileContainerToCollectionIfMissing(
          fileContainerCollection,
          fileContainer
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(fileContainer);
      });

      it("should add only unique FileContainer to an array", () => {
        const fileContainerArray: IFileContainer[] = [
          { id: 123 },
          { id: 456 },
          { id: 18836 },
        ];
        const fileContainerCollection: IFileContainer[] = [{ id: 123 }];
        expectedResult = service.addFileContainerToCollectionIfMissing(
          fileContainerCollection,
          ...fileContainerArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it("should accept varargs", () => {
        const fileContainer: IFileContainer = { id: 123 };
        const fileContainer2: IFileContainer = { id: 456 };
        expectedResult = service.addFileContainerToCollectionIfMissing(
          [],
          fileContainer,
          fileContainer2
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(fileContainer);
        expect(expectedResult).toContain(fileContainer2);
      });

      it("should accept null and undefined values", () => {
        const fileContainer: IFileContainer = { id: 123 };
        expectedResult = service.addFileContainerToCollectionIfMissing(
          [],
          null,
          fileContainer,
          undefined
        );
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(fileContainer);
      });

      it("should return initial array if no FileContainer is added", () => {
        const fileContainerCollection: IFileContainer[] = [{ id: 123 }];
        expectedResult = service.addFileContainerToCollectionIfMissing(
          fileContainerCollection,
          undefined,
          null
        );
        expect(expectedResult).toEqual(fileContainerCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
