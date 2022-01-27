import { Injectable, Req } from '@nestjs/common';
import { department, student } from '../interfaces/student';
import xlsx from 'node-xlsx';
import { Request } from 'express';

@Injectable()
export class ExcelService {
  excelParse(): student[]{
    const workSheetsFromFile = xlsx.parse(
      `${__dirname}/../../public/Versetzungsplan_kfm_IT_2021_2022.xlsx`,
    );

    let students: student[] = [];
    let aj = '';
    let x = 0;

    //Kalenderwochenarray erstellen
    let calendarWeeks: string[] = [];

    if (Array.isArray(workSheetsFromFile[0].data[2])) {
      workSheetsFromFile[0].data[2].forEach((v, i) => {
        if (i >= 6 && v != undefined) {
          calendarWeeks.push(v);
        }
      });
    }

    let dep: department = {};

    workSheetsFromFile[0].data.forEach((v, i) => {
      if (i >= 3) {
        let student: student = {};
        if (Array.isArray(v)) {
          if (v[0] != undefined && v[0].startsWith('↓ Ausbildungsjahrgang')) {
            aj = v[0].substring(v[0].length - 4);
          }

          if (v[0] == '↓ Einsatzgebiete') {
            x = 1;
          }

          if (
            x == 0 &&
            v[0] != undefined &&
            !v[0].startsWith('↓') &&
            v[0] != 'Name'
          ) {
            student.department = [];
            v.forEach((w, j) => {
              if (j <= 4) {
                switch (j) {
                  case 0:
                    student.name = w;
                    student.year = aj;
                    break;
                  case 1:
                    student.prename = w;
                    break;
                  case 2:
                    student.id = String(w);
                    break;
                  case 4:
                    student.subject = w;
                    break;
                  default:
                    break;
                }
              } else if (j == 6) {
                dep.abbreviation = w;
                dep.startingdate = calendarWeeks[j - 6].split('-')[0];
              } else if (j > 6) {
                if (w != dep.abbreviation) {
                  dep.endingdate = calendarWeeks[j - 7].split('-')[1];
                  student.department?.push(JSON.parse(JSON.stringify(dep)));

                  dep.abbreviation = w;
                  dep.startingdate = calendarWeeks[j - 6].split('-')[0];
                }
              }
            });
            students.push(student);
          }
        }
      }
    });

    return students;

    students.forEach((v, i) => {
      console.log(v);
    });
  }

  excelFilter(params: Request) {
    let students: student[] = this.excelParse();  

    let newStudents =
    students.map(item=>{
      if(params.query['abteilung'] != '') {
        item.department = item.department.filter(dep=>JSON.stringify(dep.abbreviation).trim() === JSON.stringify(params.query['abteilung']).trim());
      }
      
      if(JSON.stringify(item.name.trim()) === JSON.stringify(params.query['name']).trim() || JSON.stringify(item.prename.trim()) === JSON.stringify(params.query['vorname']).trim() || item.department.length === 1
          || (item.department.length >= 1 && params.query['abteilung'] != '' && item.department.map(dep => JSON.stringify(dep.abbreviation).trim() === JSON.stringify(params.query['abteilung']).trim()))){
        return item;
      }
    });

    return newStudents;

    
  }
}
