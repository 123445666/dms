import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";

import { FileManagerDetailComponent } from "./file-manager-detail.component";

describe("FileManager Management Detail Component", () => {
  let comp: FileManagerDetailComponent;
  let fixture: ComponentFixture<FileManagerDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileManagerDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ FileManager: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FileManagerDetailComponent, "")
      .compileComponents();
    fixture = TestBed.createComponent(FileManagerDetailComponent);
    comp = fixture.componentInstance;
  });

  describe("OnInit", () => {
    it("Should load FileManager on init", () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.FileManager).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
