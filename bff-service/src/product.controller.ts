import { Controller, Get, Req, Res, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import axios, { AxiosRequestConfig } from 'axios';

const rootRoute = 'product';
const cache = {};
const TTL = 120000; // 2 mins

@Controller(rootRoute)
export class ProductController {
  constructor(private readonly appService: AppService) {}

  @Get()
  findAll(@Req() request: Request, @Res() response: Response): any {
    // - GET product/*. => product-service/products/
    const remoteServer = process.env[rootRoute];

    if (!remoteServer) {
      response.status(502);
      response.send('Cannot process request');
    }

    const now = Date.now();

    if (cache[request.path]) {
      if (now - cache[request.path].time < TTL) {
        response.json(cache[request.path].data);
        return;
      }
    } else {
      cache[request.path] = {};
    }

    const axiosConfig: AxiosRequestConfig = {
      method: 'GET',
      url: `${remoteServer}/products`,
      params: request.params,
    };

    axios
      .request(axiosConfig)
      .then((resp: any) => {
        cache[request.path] = {
          data: resp.data,
          time: Date.now(),
        };
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

  @Get(':id')
  findOne(@Req() request: Request, @Res() response: Response): any {
    // - GET product/id => product-service/products/id
    const remoteServer = process.env[rootRoute];

    if (!remoteServer) {
      response.status(502);
      response.send('Cannot process request');
    }

    const axiosConfig: AxiosRequestConfig = {
      method: 'GET',
      url: `${remoteServer}/products/${request.params.id}`,
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

  @Post()
  create(@Body() createProductDto: any, @Res() response: Response) {
    // - POST product => product-service/products
    const remoteServer = process.env[rootRoute];

    if (!remoteServer) {
      response.status(502);
      response.send('Cannot process request');
    }

    const axiosConfig: any = {
      method: 'POST',
      url: `${remoteServer}/products`,
      data: createProductDto,
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
