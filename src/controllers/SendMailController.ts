import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from '../repositories/UsersRepository'
import SendMailService from "../services/SendMailService";
import { resolve } from 'path';

class SendMailController {

  async execute(req: Request, res: Response) {
    const { email, survey_id } = req.body;
    console.log(email)

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const user = await usersRepository.findOne({
      where: { email }
    });
    console.log(user);

    if(!user) {
      return res.status(400).json({
        error: "User does not exists"
      });
    }

    const survey = await surveysRepository.findOne({id: survey_id});

    if(!survey) {
      return res.status(400).json({
        error: "Survey does not exists"
      })
    }

    const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      user_id: user.id,
      link: process.env.URL_MAIL
    }

    const surveyUserAlreadyExistis = await surveysUsersRepository.findOne({
      where: [{user_id: user.id}, {value: null}],
      relations: ["user", "survey"]
    });

    if(surveyUserAlreadyExistis) {
      await SendMailService.execute(email, survey.title, variables, npsPath);
      return res.json(surveyUserAlreadyExistis);
    }

    const surveyUser = surveysUsersRepository.create({
      user_id: user.id,
      survey_id
    });

    await surveysUsersRepository.save(surveyUser);

    //send email to user
    await SendMailService.execute(email, survey.title,variables, npsPath);

    return res.json(surveyUser);

  } 
}

export { SendMailController }