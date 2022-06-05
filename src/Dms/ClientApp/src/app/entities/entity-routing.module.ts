import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: "region",
        data: { pageTitle: "dmsApp.region.home.title" },
        loadChildren: () =>
          import("./region/region.module").then((m) => m.RegionModule),
      },
      {
        path: "country",
        data: { pageTitle: "dmsApp.country.home.title" },
        loadChildren: () =>
          import("./country/country.module").then((m) => m.CountryModule),
      },
      {
        path: "location",
        data: { pageTitle: "dmsApp.location.home.title" },
        loadChildren: () =>
          import("./location/location.module").then((m) => m.LocationModule),
      },
      {
        path: "department",
        data: { pageTitle: "dmsApp.department.home.title" },
        loadChildren: () =>
          import("./department/department.module").then(
            (m) => m.DepartmentModule
          ),
      },
      {
        path: "employee",
        data: { pageTitle: "dmsApp.employee.home.title" },
        loadChildren: () =>
          import("./employee/employee.module").then((m) => m.EmployeeModule),
      },
      {
        path: "file-container",
        data: { pageTitle: "dmsApp.fileContainer.home.title" },
        loadChildren: () =>
          import("./file-container/file-container.module").then(
            (m) => m.FileContainerModule
          ),
      },
      {
        path: "file-part",
        data: { pageTitle: "dmsApp.filePart.home.title" },
        loadChildren: () =>
          import("./file-part/file-part.module").then((m) => m.FilePartModule),
      },
      {
        path: "region",
        data: { pageTitle: "dmsApp.region.home.title" },
        loadChildren: () =>
          import("./region/region.module").then((m) => m.RegionModule),
      },
      {
        path: "country",
        data: { pageTitle: "dmsApp.country.home.title" },
        loadChildren: () =>
          import("./country/country.module").then((m) => m.CountryModule),
      },
      {
        path: "location",
        data: { pageTitle: "dmsApp.location.home.title" },
        loadChildren: () =>
          import("./location/location.module").then((m) => m.LocationModule),
      },
      {
        path: "department",
        data: { pageTitle: "dmsApp.department.home.title" },
        loadChildren: () =>
          import("./department/department.module").then(
            (m) => m.DepartmentModule
          ),
      },
      {
        path: "employee",
        data: { pageTitle: "dmsApp.employee.home.title" },
        loadChildren: () =>
          import("./employee/employee.module").then((m) => m.EmployeeModule),
      },
      {
        path: "file-container",
        data: { pageTitle: "dmsApp.fileContainer.home.title" },
        loadChildren: () =>
          import("./file-container/file-container.module").then(
            (m) => m.FileContainerModule
          ),
      },
      {
        path: "file-part",
        data: { pageTitle: "dmsApp.filePart.home.title" },
        loadChildren: () =>
          import("./file-part/file-part.module").then((m) => m.FilePartModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
