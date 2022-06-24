export interface IEsignValidate {
    dataContent?: string | undefined;
    uniqueId?: string | undefined;
}

export class EsignValidate implements IEsignValidate {
    constructor(
        public dataContent?: string | undefined,
        public uniqueId?: string | undefined,
    ) { }
}

export function getEsignValidateIdentifier(esignValidate: IEsignValidate): string | undefined {
    return esignValidate.uniqueId;
}
