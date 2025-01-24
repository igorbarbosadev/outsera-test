import {dataSource} from './src/database';

beforeAll(async () => {
    await dataSource.initialize();    
});

afterAll(async () => {
    await dataSource.destroy();
});

beforeEach(async () => {
    await dataSource.synchronize(true);
});
