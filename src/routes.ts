import { Request, Response, Router } from "express";
import ProducerController from "./app/producer.controller";

const routes = Router();

routes.get('/', (req: Request, res: Response) => {
    return res.status(200).json({
        status: 200,
        message: 'Welcome to the RESTful API!'
    }) as any
});

routes.get('/api/v1/producers/award-intervals', ProducerController.getAwardIntervals);


export default routes;