export interface ISignedDocument {
    checksum?: string | undefined;
    signedBy?: string | undefined;
    signedUserNameBy?: string | undefined;
    lastUniqueId?: string | undefined;
    signedDate?: string | undefined;
    fileId?: number | undefined;
    signedData?: string | undefined;
}

export class SignedDocument implements ISignedDocument {
    constructor(
        public checksum?: string | undefined,
        public signedBy?: string | undefined,
        public signedUserNameBy?: string | undefined,
        public lastUniqueId?: string | undefined,
        public signedDate?: string | undefined,
        public fileId?: number | undefined,
        public content?: string | undefined,
        public contentType?: string | undefined,
    ) { }
}
