import * as crypto from "crypto";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class HashService {
  constructor(
    private readonly configService: ConfigService,
  ) { }


  async generateVerfiyToken() { 
    const token = uuidv4();
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  generateOTP(length = 6): string {
    const otp = crypto.randomBytes(length).toString('hex');
    return otp.slice(0, length);
  }
}
