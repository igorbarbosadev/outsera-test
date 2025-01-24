import { Producer } from "../../app/producer.entity";
import { dataSource } from "../../database";
import { Repository } from "typeorm";
import GetAwardIntervalsOfProducersService from "../../services/GetAwardIntervalsOfProducersService";



describe("GetAwardIntervalsOfProducersService", () => {
    let producerRepository: Repository<Producer>;
    let getAwardIntervalsOfProducersService: GetAwardIntervalsOfProducersService;

    beforeAll(async () => {
        // Setting up the repository and service before the tests
        producerRepository = dataSource.getRepository(Producer);
        getAwardIntervalsOfProducersService = new GetAwardIntervalsOfProducersService(producerRepository);
    });
    
    afterEach(async () => {        
        // Cleaning the database after each test
        await producerRepository.clear();
    });

    it("should return two minimum and two maximum intervals for producers with consecutive awards", async () => {
        // Data for producers with consecutive award years
        const producers = "Producer Name";
        const winner = "yes";

        await producerRepository.save([
            { producers, winner, title: "title01", year: 2005, studios: "test" },
            { producers, winner, title: "title02", year: 2008, studios: "test" },
            { producers, winner, title: "title03", year: 2012, studios: "test" },
        ]);

        const result = await getAwardIntervalsOfProducersService.execute();
            
        // Checking that the result contains two minimum and two maximum intervals
        expect(result.min).toHaveLength(2);  
        expect(result.max).toHaveLength(2);      

        // Verifying the interval values
        expect(result.min[0].interval).toBe(3);  // First minimum interval
        expect(result.min[1].interval).toBe(4);  // Second minimum interval
        
        expect(result.max[0].interval).toBe(4);  // First maximum interval
        expect(result.max[1].interval).toBe(3);  // Second maximum interval
    });

    it("should not return intervals for producers with only one award", async () => {
        // Data for a producer with only one award
        const producers = "Producer Name";
        const winner = "yes";

        await producerRepository.save([
            { producers, winner, title: "title01", year: 2005, studios: "test" }      
        ]);

        const result = await getAwardIntervalsOfProducersService.execute();
        
        // Verifying that no intervals are calculated
        expect(result.min).toHaveLength(0);  
        expect(result.max).toHaveLength(0);  
    });

    it("should return intervals for producers with two consecutive awards", async () => {
        // Data for a producer with two consecutive awards
        const producers = "Producer Name";
        const winner = "yes";

        await producerRepository.save([
            { producers, winner, title: "title01", year: 2005, studios: "test" },      
            { producers, winner, title: "title02", year: 2006, studios: "test" }      
        ]);

        const result = await getAwardIntervalsOfProducersService.execute();
            
        // Verifying that there is one minimum interval and one maximum interval
        expect(result.min).toHaveLength(1);  
        expect(result.max).toHaveLength(1);  
    });

    it("should return two minimum and two maximum intervals for two producers with awards in different years", async () => {
        // Data for two producers with awards in different years
        const producers1 = "Producer Name 1";
        const producers2 = "Producer Name 2";
        const winner = "yes";

        await producerRepository.save([
            { producers: producers1, winner, title: "title01", year: 2000, studios: "test" },      
            { producers: producers1, winner, title: "title02", year: 2001, studios: "test" },                  
            { producers: producers1, winner, title: "title04", year: 2003, studios: "test" },      
            { producers: producers1, winner, title: "title05", year: 2010, studios: "test" },

            { producers: producers2, winner, title: "title01", year: 2000, studios: "test" },      
            { producers: producers2, winner, title: "title02", year: 2005, studios: "test" },               
        ]);

        const result = await getAwardIntervalsOfProducersService.execute();   
        
        // Verifying the minimum and maximum intervals
        expect(result.min).toHaveLength(2);  
        expect(result.max).toHaveLength(2);  

        expect(result.min[0].interval).toBe(1);  // Minimum interval between 2000 and 2001
        expect(result.min[1].interval).toBe(2);  // Minimum interval between 2001 and 2003
        
        expect(result.max[0].interval).toBe(7);  // Maximum interval between 2003 and 2010
        expect(result.max[1].interval).toBe(5);  // Maximum interval between 2000 and 2005

        // Verifying the years of victories
        expect(result.min[0].previousWin).toBe(2000);
        expect(result.min[0].followingWin).toBe(2001);

        expect(result.max[0].previousWin).toBe(2003);
        expect(result.max[0].followingWin).toBe(2010);

        expect(result.min[1].previousWin).toBe(2001);
        expect(result.min[1].followingWin).toBe(2003);

        expect(result.max[1].previousWin).toBe(2000);
        expect(result.max[1].followingWin).toBe(2005);
    });
});
