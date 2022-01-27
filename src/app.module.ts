import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExcelService } from './excel/excel.service';
import { UploadController } from './upload/upload.controller';

@Module({
  imports: [],
  controllers: [AppController, UploadController],
  providers: [AppService, ExcelService],
})
export class AppModule {}
