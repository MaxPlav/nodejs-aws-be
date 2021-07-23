import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProductController } from './product.controller';
import { CartController } from './cart.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, ProductController, CartController],
  providers: [AppService],
})
export class AppModule {}
