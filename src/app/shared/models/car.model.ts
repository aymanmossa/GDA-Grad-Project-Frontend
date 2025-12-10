import { IUser } from "./user.model";

export interface ILookup {
  id: number;
  name: string;
}

export interface IMake { makeId: number; makeName: string; }
export interface IModel { modelId: number; modelName: string; }
export interface IBodyType { bodyTypeId: number; name: string; }
export interface IFuelType { fuelId: number; name: string; }
export interface ILocation { locId: number; name: string; }

export interface ICar {
  carId: string;
  year: number;
  price: number;
  description: string;
  createdDate: string;
  imageUrls: string[];

  makeId: number;
  makeName: string;

  modelId: number;
  modelName: string;

  bodyTypeId: number;
  bodyTypeName: string;

  fuelId: number;
  fuelName: string;

  locId: number;
  locationName: string;

  publisherName: string;
  publisherPhone: string;
  publisherEmail: string;

}

export interface CarFilter {
  search?: string;

  makeId?: number;
  modelId?: number;
  bodyTypeId?: number;
  fuelId?: number;
  locId?: number;

  makeName?: string;
  modelName?: string;
  bodyTypeName?: string;
  fuelTypeName?: string;
  locationName?: string;

  minPrice?: number;
  maxPrice?: number;
  year?: number;
}


export interface IPagedResponse<T> {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  data: T[];
}