import { IUser } from "app/entities/user/user.model";
import { IFileContainer } from "app/entities/file-container/file-container.model";
import { FileStatus } from "app/entities/enumerations/file-status.model";

export interface IFilePart {
    id?: number;
    name?: string;
    contentContentType?: string | null;
    content?: string | null;
    concurrencyStamp?: string | null;
    status?: FileStatus | null;
    signerId?: string | null;
    signer?: IUser | null;
    fileContainer?: IFileContainer | null;
}

export class FilePart implements IFilePart {
    constructor(
        public id?: number,
        public name?: string,
        public contentContentType?: string | null,
        public content?: string | null,
        public concurrencyStamp?: string | null,
        public status?: FileStatus | null,
        public signerId?: string | null,
        public signer?: IUser | null,
        public fileContainer?: IFileContainer | null
    ) { }
}

export function getFilePartIdentifier(filePart: IFilePart): number | undefined {
    return filePart.id;
}
