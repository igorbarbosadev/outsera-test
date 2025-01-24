import { Repository } from "typeorm";
import { Producer } from "../app/producer.entity";

export default class GetAwardIntervalsOfProducersService {

    constructor(private producerRepository: Repository<Producer>) {}

    async execute() {
        // Fetching all producers who have won an award (winner = 'yes') and ordering them by name and year
        const producers = await this.producerRepository
            .createQueryBuilder("producer")
            .where("producer.winner = :winner", { winner: "yes" })
            .orderBy("producer.producers, producer.year", "ASC")
            .getMany();

        // Grouping award years by producer
        const producerAwards: Record<string, number[]> = {};
        producers.forEach((producer: any) => {
            if (!producerAwards[producer.producers]) {
                producerAwards[producer.producers] = [];
            }
            producerAwards[producer.producers].push(producer.year);
        });

        // Calculating the intervals between consecutive awards for each producer
        const intervals: {
            producer: string;
            interval: number;
            previousWin: number;
            followingWin: number;
        }[] = [];

        for (const [producer, years] of Object.entries(producerAwards)) {
            for (let i = 1; i < years.length; i++) {
                intervals.push({
                    producer,
                    interval: years[i] - years[i - 1],
                    previousWin: years[i - 1],
                    followingWin: years[i],
                });
            }
        }

        // Sorting the intervals by the interval length (ascending order)
        intervals.sort((a, b) => a.interval - b.interval);

        // Getting the two smallest intervals (min) and two largest intervals (max)
        const minIntervals = intervals.slice(0, 2); // Getting the two smallest intervals
        const maxIntervals = intervals.slice(-2).sort((a, b) => b.interval - a.interval); // Getting the two largest intervals

        return {
            min: minIntervals,  // Returning the two smallest intervals
            max: maxIntervals,  // Returning the two largest intervals
        };
    }
}
