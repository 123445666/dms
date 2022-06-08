import { IUser } from "app/entities/user/user.model";
import { IFilePart } from "app/entities/file-part/file-part.model";
import { FileStatus } from "app/entities/enumerations/file-status.model";

export interface IFileContainer {
  id?: number;
  name?: string;
  concurrencyStamp?: string | null;
  status?: FileStatus | null;
  owner?: IUser | null;
  fileParts?: IFilePart[] | null;
}

export class FileContainer implements IFileContainer {
  constructor(
    public id?: number,
    public name?: string,
    public concurrencyStamp?: string | null,
    public status?: FileStatus | null,
    public owner?: IUser | null,
    public fileParts?: IFilePart[] | null
  ) {}
}

export function getFileContainerIdentifier(
  fileContainer: IFileContainer
): number | undefined {
  return fileContainer.id;
}
