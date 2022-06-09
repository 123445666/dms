import { IUser } from "app/entities/user/user.model";
import { IFilePart } from "../file-manager/file-part.model";
import { FileStatus } from "app/entities/enumerations/file-status.model";

export interface IFileManager {
    id?: number;
    name?: string | null;
    concurrencyStamp?: string | null;
    status?: FileStatus | null;
    owner?: IUser | null;
    fileParts?: IFilePart[] | null;
}

export class FileManager implements IFileManager {
    constructor(
        public id?: number,
        public name?: string | null,
        public concurrencyStamp?: string | null,
        public status?: FileStatus | null,
        public owner?: IUser | null,
        public fileParts?: IFilePart[] | null
    ) { }
}

export function getFileManagerIdentifier(
    fileManager: IFileManager
): number | undefined {
    return fileManager.id;
}
