import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from '../repositories/UsersRepository'

class SendMailController {

  async execute(req: Request, res: Response) {
    const { email, survey_id } = req.body;
    console.log(email)

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const userAlreadyExists = await usersRepository.findOne({
      where: { email }
    });
    console.log(userAlreadyExists);

    if(!userAlreadyExists) {
      return res.status(400).json({
        error: "User does not exists"
      });
    }

    const surveyAlreadyExists = await surveysRepository.findOne({id: survey_id});

    if(!surveyAlreadyExists) {
      return res.status(400).json({
        error: "Survey does not exists"
      })
    }

    // Salvar as informações na tabela surveyUser
    const surveyUser = surveysUsersRepository.create({
      user_id: userAlreadyExists.id,
      survey_id
    });
    await surveysUsersRepository.save(surveyUser);

    //send email to user
    return res.json(surveyUser);

  } 
}

export { SendMailController }