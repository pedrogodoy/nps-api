import { Router } from 'express';
import { UserController } from './controllers/UserController';
import { SurveysController } from './controllers/SurveysController';
import { SendMailController } from './controllers/SendMailController';

const router = Router();

const userController = new UserController();
const surveysControler = new SurveysController();
const sendMailController = new SendMailController();

router.post("/users", userController.create);
router.post("/surveys", surveysControler.create);
router.get("/surveys", surveysControler.show);
router.post("/sendMail", sendMailController.execute);

export { router }