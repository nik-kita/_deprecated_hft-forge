import { Injectable } from "@nestjs/common";
import {
    request
} from 'undici';

@Injectable()
export class HttpService {
    public req!: typeof request;

    constructor() {
        this.req = request;
    }
}
