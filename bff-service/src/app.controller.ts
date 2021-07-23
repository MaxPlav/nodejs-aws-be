import { Controller, Get, Req, Res, Post, Delete } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import axios from 'axios';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // root(@Req() request: Request, @Res() response: Response, @Next() next: any): string {
  //   console.log('ROOT', request);
  //   return next();
  // }
}
