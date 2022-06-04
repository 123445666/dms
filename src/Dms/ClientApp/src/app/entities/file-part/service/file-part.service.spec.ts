import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";

import { FileStatus } from "app/entities/enumerations/file-status.model";
import { IFilePart, FilePart } from "../file-part.model";

import { FilePartService } from "./file-part.service";

describe("FilePart Service", () => {
  let service: FilePartService;
  let httpMock: HttpTestingController;
  let elemDefault: IFilePart;
  let expectedResult: IFilePart | IFilePart[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FilePartService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: "AAAAAAA",
      contentContentType: "image/png",
      content: "AAAAAAA",
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

    it("should create a FilePart", () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service
        .create(new FilePart())
        .subscribe((resp) => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: "POST" });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it("should update a FilePart", () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: "BBBBBB",
          content: "BBBBBB",
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

    it("should partial update a FilePart", () => {
      const patchObject = Object.assign(
        {
          name: "BBBBBB",
          content: "BBBBBB",
          status: "BBBBBB",
        },
        new FilePart()
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

    it("should return a list of FilePart", () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: "BBBBBB",
          content: "BBBBBB",
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

    it("should delete a FilePart", () => {
      service.delete(123).subscribe((resp) => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: "DELETE" });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe("addFilePartToCollectionIfMissing", () => {
      it("should add a FilePart to an empty array", () => {
        const filePart: IFilePart = { id: 123 };
        expectedResult = service.addFilePartToCollectionIfMissing([], filePart);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(filePart);
      });

      it("should not add a FilePart to an array that contains it", () => {
        const filePart: IFilePart = { id: 123 };
        const filePartCollection: IFilePart[] = [
          {
            ...filePart,
          },
          { id: 456 },
        ];
        expectedResult = service.addFilePartToCollectionIfMissing(
          filePartCollection,
          filePart
        );
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a FilePart to an array that doesn't contain it", () => {
        const filePart: IFilePart = { id: 123 };
        const filePartCollection: IFilePart[] = [{ id: 456 }];
        expectedResult = service.addFilePartToCollectionIfMissing(
          filePartCollection,
          filePart
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(filePart);
      });

      it("should add only unique FilePart to an array", () => {
        const filePartArray: IFilePart[] = [
          { id: 123 },
          { id: 456 },
          { id: 87813 },
        ];
        const filePartCollection: IFilePart[] = [{ id: 123 }];
        expectedResult = service.addFilePartToCollectionIfMissing(
          filePartCollection,
          ...filePartArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it("should accept varargs", () => {
        const filePart: IFilePart = { id: 123 };
        const filePart2: IFilePart = { id: 456 };
        expectedResult = service.addFilePartToCollectionIfMissing(
          [],
          filePart,
          filePart2
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(filePart);
        expect(expectedResult).toContain(filePart2);
      });

      it("should accept null and undefined values", () => {
        const filePart: IFilePart = { id: 123 };
        expectedResult = service.addFilePartToCollectionIfMissing(
          [],
          null,
          filePart,
          undefined
        );
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(filePart);
      });

      it("should return initial array if no FilePart is added", () => {
        const filePartCollection: IFilePart[] = [{ id: 123 }];
        expectedResult = service.addFilePartToCollectionIfMissing(
          filePartCollection,
          undefined,
          null
        );
        expect(expectedResult).toEqual(filePartCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
