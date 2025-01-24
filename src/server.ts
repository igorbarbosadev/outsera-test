import express, { Request, Response } from 'express';
import routes from './routes';
import { createDatabaseConnection } from './database';
import importProducers from './functions/importProducers';

const app = express();

const startServer = async () => {
    try {
        await createDatabaseConnection();
        await importProducers();
        
        app.use(express.json());
        app.use('/',routes);      
        app.listen(5000, () => console.log(`Server listening on port 5000`));

    } catch (error) {
        console.error('Erro ao iniciar o servidor', error);
    }
};

startServer();