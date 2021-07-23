import { Controller, Get, Req, Res, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import axios, { AxiosRequestConfig } from 'axios';

const rootRoute = 'cart';

@Controller(rootRoute)
export class CartController {
  constructor(private readonly appService: AppService) {}

  @Get('profile/cart')
  findAll(@Req() request: Request, @Res() response: Response): any {
    // - GET cart/profile/cart => cart-service/api/profile/cart
    const remoteServer = process.env[rootRoute];

    if (!remoteServer) {
      response.status(502);
      response.send('Cannot process request');
    }

    const axiosConfig: AxiosRequestConfig = {
      method: 'GET',
      url: `${remoteServer}/profile/cart`,
      params: request.params,
    };

    axios
      .request(axiosConfig)
      .then((resp: any) => {
        response.json(resp.data);
      })
      .catch((error) => {
        if (error.response) {
          response.status(error.response.status);
          response.send(error.response.data);
        } else {
          response.status(500);
          response.send('Internal server error');
        }
      });
  }

  @Put('profile/cart')
  update(@Req() request, @Res() response: Response) {
    // - PUT cart/profile/cart => profile/cart
    const remoteServer = process.env[rootRoute];

    if (!remoteServer) {
      response.status(502);
      response.send('Cannot process request');
    }

    const axiosConfig: AxiosRequestConfig = {
      method: 'PUT',
      url: `${remoteServer}/profile/cart`,
      params: request.params,
      data: request.body,
    };

    axios
      .request(axiosConfig)
      .then((resp: any) => {
        response.json(resp.data);
      })
      .catch((error) => {
        if (error.response) {
          response.status(error.response.status);
          response.send(error.response.data);
        } else {
          response.status(500);
          response.send('Internal server error');
        }
      });
  }
}
