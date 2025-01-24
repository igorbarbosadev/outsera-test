import request from 'supertest';
import {app} from'../../server';
import { createDatabaseConnection, dataSource } from '../../database';
import { Producer } from '../../app/producer.entity';

describe('GET /api/v1/producers/award-intervals', () => {
  
  beforeEach(async () => {
    await dataSource.synchronize(true);
  });

  it('should return the correct min and max award intervals for producers', async () => {
    
    const producers = 'Producer 1';
    const winner = 'yes';
    const studios = 'studio 1';

    const producerRepository = dataSource.getRepository(Producer);

    await producerRepository.save([
      { producers, winner, studios, title: 'Title 1', year: 2000 },
      { producers, winner, studios, title: 'Title 2', year: 2005 },
      { producers, winner, studios, title: 'Title 3', year: 2001 },
      { producers, winner, studios, title: 'Title 4', year: 2004 },
    ]);

    // Act: Fazer uma requisição GET para o endpoint
    const response = await request(app).get('/api/v1/producers/award-intervals');

    // Assert: Validar a resposta
    expect(response.status).toBe(200); // Verifica se o status da resposta é 200 (OK)
    expect(response.body.min).toHaveLength(2); // Verifica se há dois intervalos mínimos
    expect(response.body.max).toHaveLength(2); // Verifica se há dois intervalos máximos
    expect(response.body.min[0].interval).toBe(1); // Verifica se o intervalo mínimo está correto
    expect(response.body.max[0].interval).toBe(3); // Verifica se o intervalo máximo está correto
  });
});
