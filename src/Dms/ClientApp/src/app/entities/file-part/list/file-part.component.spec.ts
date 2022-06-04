import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpHeaders, HttpResponse } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { of } from "rxjs";

import { FilePartService } from "../service/file-part.service";

import { FilePartComponent } from "./file-part.component";

describe("FilePart Management Component", () => {
  let comp: FilePartComponent;
  let fixture: ComponentFixture<FilePartComponent>;
  let service: FilePartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FilePartComponent],
    })
      .overrideTemplate(FilePartComponent, "")
      .compileComponents();

    fixture = TestBed.createComponent(FilePartComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FilePartService);

    const headers = new HttpHeaders();
    jest.spyOn(service, "query").mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it("Should call load all on init", () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.fileParts?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
