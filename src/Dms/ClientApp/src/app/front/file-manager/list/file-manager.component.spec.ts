import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpHeaders, HttpResponse } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { of } from "rxjs";

import { FileManagerService } from "../service/file-manager.service";

import { FileManagerComponent } from "./file-manager.component";

describe("FileManager Management Component", () => {
  let comp: FileManagerComponent;
  let fixture: ComponentFixture<FileManagerComponent>;
  let service: FileManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FileManagerComponent],
    })
      .overrideTemplate(FileManagerComponent, "")
      .compileComponents();

    fixture = TestBed.createComponent(FileManagerComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FileManagerService);

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
    expect(comp.FileManagers?.[0]).toEqual(
      expect.objectContaining({ id: 123 })
    );
  });
});
