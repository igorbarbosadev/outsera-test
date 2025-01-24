import { Request, Response } from "express";
import ImportProducerService from "../services/ImportProducerService";
import { dataSource } from "../database";
import { Producer } from "./producer.entity";
import GetAwardIntervalsOfProducersService from "../services/GetAwardIntervalsOfProducersService";

export default class ProducerController {

    static async getAwardIntervals(req: Request, res: Response) {
        const producerRepository = dataSource.getRepository(Producer);
        const response = await (new GetAwardIntervalsOfProducersService(producerRepository)).execute();        
        return res.status(200).json(response) as any;
    }

}