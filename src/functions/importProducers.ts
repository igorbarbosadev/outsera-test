import { Producer } from "../app/producer.entity";
import { dataSource } from "../database";
import ImportProducerService from "../services/ImportProducerService";

export default async function importProducers(){
    console.log(`Importing data/movielist.csv ...`);
    
    try {
        const producerRepository = dataSource.getRepository(Producer);
        const data = await (new ImportProducerService(producerRepository)).execute('data/movielist.csv');
        
        console.log(`Import completed | Total: ${data.total}, Imported: ${data.importedLines}, Invalid: ${data.invalidLines}`);
        
        if(data.errors.length > 0){
            console.log(`Errors during import:`);
            data.errors.forEach(error => console.log(error));
        }
    } catch (error) { 
        console.error('Error during import:', error);
    }
}