import { Repository } from "typeorm";
import { Producer } from "../app/producer.entity";
import fs from 'fs';
import CsvReadableStream from 'csv-reader';

import * as yup from 'yup';


export default class ImportProducerService {

    constructor(private producerRepository: Repository<Producer>){}  

    async execute(fileCsvPath: string) : Promise<{
        total: number,
        importedLines: number,
        invalidLines: number,
        errors: any[]
    }>{
        const rows: any[] = await this.importCsv(fileCsvPath, ['year','title','studios', 'producers', 'winner']);

        const response: any = {
            total: rows.length,
            importedLines: 0,
            invalidLines: 0,
            errors: []
        }

        const individualProducer: any[] = [];

        for(const row of rows){
            const producersNames = row.producers.split(',')
                .flatMap((producer: string) => producer.split(' and '))
                .map((producer: string) => producer.trim())
                .filter((producer: string) => producer);

            for(const producerName of producersNames){
                individualProducer.push({...row, producers: producerName.trim()});
            }
        }

        for(const row of individualProducer){           
            try {
                const data = await this.validateRow(row);
                await this.producerRepository.save(data);
                response.importedLines++;
            } catch (error: any) {
                if(error.constructor.name === 'ValidationError'){
                    response.errors.push({...row, error: error.message});
                }
                else {
                    throw error;
                }
            }
        }

        return response;
    }

    private async validateRow(row: any){

        const schema = yup.object().shape({
            year: yup.number().integer().min(1500).max(new Date().getFullYear()).required(),
            title: yup.string().required(),
            studios: yup.string().required(),
            producers: yup.string().required(),                
            winner: yup.string().transform((value: string) => value === 'yes' ? 'yes' : 'no'),
        });

        await schema.validate(row);

        return schema.cast(row);
    }

    private async importCsv(fileCsvPath: string, columns: string[]) : Promise<any[]> {
        return new Promise(async (resolve, reject) => {
            var names: any = [];
            const rows: any[] = [];
            
            let inputStream = fs.createReadStream(fileCsvPath, 'utf8');
            
            inputStream
                .pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true, delimiter: ';' }))
                .on('header', (headers: string[]) =>  names = headers)
                .on('data', function (row: any, index: any) {
                    const data: any = {};
                    for (let i = 0; i < names.length; i++) {
                        if (columns.includes(names[i])){
                            data[names[i]] = row[i];
                        } 
                    }     
                    rows.push(data);
                })
                .on('end', function () {
                    rows.shift()
                    resolve(rows)
                });
        })   
    }

}