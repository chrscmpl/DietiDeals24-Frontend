export class Builder<DTO, Entity> {
    private factory: (dto: DTO) => Entity;

    public constructor(factory: (dto: DTO) => Entity) {
        this.factory = factory;
    }

    public buildSingle(dto: DTO): Entity {
        return this.factory(dto);
    }

    public buildArray(dtos: DTO[]): Entity[] {
        return dtos.map((dto) => this.factory(dto));
    }
}
