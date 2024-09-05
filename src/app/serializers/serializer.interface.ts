export interface Serializer<Entity, DTO> {
    serialize(entity: Entity): DTO;
    serializeArray(entity: Entity[]): DTO[];
}
