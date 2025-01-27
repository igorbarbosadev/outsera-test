import request from 'supertest';
import {app} from'../../server';
import { createDatabaseConnection, dataSource } from '../../database';
import { Producer } from '../../app/producer.entity';
import importProducers from '../../functions/importProducers';

describe('GET /api/v1/producers/award-intervals', () => {
  
  beforeEach(async () => {
    await dataSource.synchronize(true);
  });

  it('should return the correct min and max award intervals for producers', async () => {
    
    await importProducers();

    const response = await request(app).get('/api/v1/producers/award-intervals');

    expect(response.status).toBe(200);
    
    expect(response.body).toEqual({
      "min": [
        {
          "producer": "Joel Silver",
          "interval": 1,
          "previousWin": 1990,
          "followingWin": 1991
        }
      ],
      "max": [
        {
          "producer": "Matthew Vaughn",
          "interval": 13,
          "previousWin": 2002,
          "followingWin": 2015
        }
      ]
    })
  });
});
