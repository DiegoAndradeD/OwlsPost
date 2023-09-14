import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTableStories1694320684384 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "stories",
            columns: [
                {
                    name: "id",
                    type: "serial",
                    isPrimary: true,
                },
                {
                    name: "title",
                    type: "varchar",
                    isNullable: false,
                },
                {
                    name: "description",
                    type: "varchar",
                    isNullable: false,
                },
                {
                    name: "userid",
                    type: "integer",
                    isNullable: false,
                },
                {
                    name: "username",
                    type: "varchar",
                    isNullable: false,
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()",
                },
                {
                    name: 'tags',
                    type: 'text[]',
                    isNullable: true
                },
            ],
        }));

        await queryRunner.createForeignKey("stories", new TableForeignKey({
            columnNames: ["userid"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("stories", "FK_stories_users");
        await queryRunner.dropTable("stories");
    }
}
