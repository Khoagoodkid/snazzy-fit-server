import * as moment from "moment-timezone";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TimeService {
    private time: Date;

    constructor() {
        this.time = new Date();
    }

    static currentUnix(): number {
        return moment.utc().valueOf(); // milliseconds since epoch in UTC
    }

    static getCurrentTime() {
        return moment().utc().toDate();
    }

    static getCurrentTimeInUnix() {
        return moment().utc().valueOf();
    }

    static calculateExpiration(duration: string) {
        const match = duration.match(/^(\d+)([smhd])$/); // find number and time unit (s = seconds, m = minutes, h = hours, d = days)
        if (!match) {
            throw new Error(
                'Invalid duration format. Use something like "15m", "2h", "1d".',
            );
        }

        const value = parseInt(match[1], 10);
        const unit = match[2];

        return moment()
            .utc()
            .add(value, unit as moment.unitOfTime.DurationAs)
            .valueOf();
    }

}

