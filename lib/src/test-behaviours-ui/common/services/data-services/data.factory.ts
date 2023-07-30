import { DataService } from './data.service';

const myDataServiceFactory = () => {
  const instance = new DataService();
  return { ...instance };
}

export const DataServicesFactory = {
  provide: DataService,
  useFactory: myDataServiceFactory,
};
