import { IRegion } from "app/entities/region/region.model";

export interface ICountry {
  id?: number;
  countryName?: string;
  region?: IRegion | null;
}

export class Country implements ICountry {
  constructor(
    public id?: number,
    public countryName?: string,
    public region?: IRegion | null
  ) {}
}

export function getCountryIdentifier(country: ICountry): number | undefined {
  return country.id;
}
