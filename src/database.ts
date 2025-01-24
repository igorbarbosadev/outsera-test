import { DataSource } from 'typeorm';
import { Producer } from './app/producer.entity';  

export const dataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',  
  synchronize: true,      
  entities: [Producer],   
  dropSchema: process.env.NODE_ENV === "test",
});

export const createDatabaseConnection = async () => {
  try {
    await dataSource.initialize(); 
    console.log('Connection to database successful!');
  } catch (error) {
    console.error('Error connecting to database', error);
  }
};
