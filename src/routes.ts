import { Router } from 'express';
import { UserController } from './controllers/UserController';
import { SurveysController } from './controllers/SurveysController';

const router = Router();

const userController = new UserController();
const surveysControler = new SurveysController();

router.post("/users", userController.create);
router.post("/surveys", surveysControler.create);
router.get("/surveys", surveysControler.show);

export { router }