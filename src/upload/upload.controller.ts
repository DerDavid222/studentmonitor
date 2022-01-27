import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { ExcelService } from 'src/excel/excel.service';
import { Request } from 'express';

@Controller('upload')
export class UploadController {
    constructor(private excelService: ExcelService){}
    
    @Get()
    root(@Res() res: Response) {
        return res.render(
          'index',
          { students: this.excelService.excelParse() },
        );
      }

    @Get('file')
    getFiltered(@Res() res: Response, @Req() req: Request) {
        return res.render(
          'index',
          { students: this.excelService.excelFilter(req) },
        );
    }
}
