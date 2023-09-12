import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm"

export class CreateTableUser1694109858458 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "users",
            columns: [
                {
                    name: "id",
                    type: "serial",
                    isPrimary: true,
                },
                {
                    name: "username",
                    type: "varchar",
                    isNullable: false,
                },
                {
                    name: "email",
                    type: "varchar",
                    isNullable: false,
                },
                {
                    name: "password",
                    type: "varchar",
                    isNullable: false,
                },
                {
                    name: "followers_count",
                    type: "integer",
                    default: 0,
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()",
                },
            ],
        }));

        await queryRunner.createIndex("users", new TableIndex({
            name: "IDX_USERNAME",
            columnNames: ["username"],
            isUnique: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users");
    }
}