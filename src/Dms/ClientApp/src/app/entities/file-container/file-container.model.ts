import { IUser } from "app/entities/user/user.model";
import { IFilePart } from "app/entities/file-part/file-part.model";

export interface IFileContainer {
  id?: number;
  name?: string | null;
  concurrencyStamp?: string | null;
  creator?: IUser | null;
  owner?: IUser | null;
  fileParts?: IFilePart[] | null;
}

export class FileContainer implements IFileContainer {
  constructor(
    public id?: number,
    public name?: string | null,
    public concurrencyStamp?: string | null,
    public creator?: IUser | null,
    public owner?: IUser | null,
    public fileParts?: IFilePart[] | null
  ) {}
}

export function getFileContainerIdentifier(
  fileContainer: IFileContainer
): number | undefined {
  return fileContainer.id;
}
