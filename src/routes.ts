import { Request, Response, Router } from "express";

const routes = Router();

routes.get('/', (req: Request, res: Response) => {
    return res.status(200).json({
        status: 200,
        message: 'Welcome to the RESTful API!'
    }) as any
});


export default routes;