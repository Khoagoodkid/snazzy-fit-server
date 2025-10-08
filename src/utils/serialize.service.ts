export class SerializeService {
    static serializeBigInt(data: any) {
        return JSON.parse(JSON.stringify(data, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        ));
    }
}
