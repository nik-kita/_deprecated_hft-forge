import { Injectable } from "@nestjs/common";
import { initForgeStore } from "@hft-forge/forge-store";


@Injectable()
export class ForgeStoreService {
    private store = initForgeStore();
}
