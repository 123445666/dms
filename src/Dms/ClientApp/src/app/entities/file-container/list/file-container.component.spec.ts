import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpHeaders, HttpResponse } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { of } from "rxjs";

import { FileContainerService } from "../service/file-container.service";

import { FileContainerComponent } from "./file-container.component";

describe("FileContainer Management Component", () => {
  let comp: FileContainerComponent;
  let fixture: ComponentFixture<FileContainerComponent>;
  let service: FileContainerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FileContainerComponent],
    })
      .overrideTemplate(FileContainerComponent, "")
      .compileComponents();

    fixture = TestBed.createComponent(FileContainerComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FileContainerService);

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
    expect(comp.fileContainers?.[0]).toEqual(
      expect.objectContaining({ id: 123 })
    );
  });
});
