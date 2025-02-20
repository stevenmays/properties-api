import { DataSource } from 'typeorm';
import { Property } from './entities';

const AppDataSource = new DataSource({
  logging: false,
  type: 'sqlite',
  database: ':memory:',
  entities: [Property],
  // synchronize the database schema with the entity classes
  synchronize: true,
});

export default AppDataSource;

export const seedDb = async () => {
  const { default: data } = await import('./data/seed.json');
  await AppDataSource.manager.insert(Property, data);
};
