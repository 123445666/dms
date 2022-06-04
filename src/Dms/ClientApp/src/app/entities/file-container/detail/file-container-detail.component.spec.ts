import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";

import { FileContainerDetailComponent } from "./file-container-detail.component";

describe("FileContainer Management Detail Component", () => {
  let comp: FileContainerDetailComponent;
  let fixture: ComponentFixture<FileContainerDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileContainerDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ fileContainer: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FileContainerDetailComponent, "")
      .compileComponents();
    fixture = TestBed.createComponent(FileContainerDetailComponent);
    comp = fixture.componentInstance;
  });

  describe("OnInit", () => {
    it("Should load fileContainer on init", () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.fileContainer).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
