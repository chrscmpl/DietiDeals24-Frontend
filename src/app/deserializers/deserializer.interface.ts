export interface Deserializer<DTO, Entity> {
    deserialize(dto: DTO): Entity;
    deserializeArray(dtos: DTO[]): Entity[];
}
