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
  make: IMake;
  
  modelId: number;
  model: IModel;
  
  bodyTypeId: number;
  bodyType: IBodyType;
  
  fuelId: number;
  fuelType: IFuelType;
  
  locId: number;
  locationCity: ILocation;
}

export interface CarFilter {
  search?: string;
  makeId?: number;
  modelId?: number;
  bodyTypeId?: number;
  fuelId?: number;
  locId?: number;
  minPrice?: number;
  maxPrice?: number;
  year?: number;
}