import dayjs from "dayjs/esm";
import { IUser } from "app/entities/user/user.model";
import { IDepartment } from "app/entities/department/department.model";

export interface IEmployee {
  id?: number;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  hireDate?: dayjs.Dayjs | null;
  title?: string | null;
  signatureContentType?: string | null;
  signature?: string | null;
  user?: IUser | null;
  manager?: IEmployee | null;
  department?: IDepartment | null;
}

export class Employee implements IEmployee {
  constructor(
    public id?: number,
    public firstName?: string | null,
    public lastName?: string | null,
    public email?: string | null,
    public phoneNumber?: string | null,
    public hireDate?: dayjs.Dayjs | null,
    public title?: string | null,
    public signatureContentType?: string | null,
    public signature?: string | null,
    public user?: IUser | null,
    public manager?: IEmployee | null,
    public department?: IDepartment | null
  ) {}
}

export function getEmployeeIdentifier(employee: IEmployee): number | undefined {
  return employee.id;
}
