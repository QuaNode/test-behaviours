import { DataService } from './data.service';

let instance: DataService | null = null;

const dataServiceFactory = () => {
  return instance ?  instance : (instance = new DataService());
}

export const DataServicesFactory = {
  provide: DataService,
  useFactory: dataServiceFactory
};
