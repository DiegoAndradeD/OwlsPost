import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateChaptersTable1694320684385 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "chapters",
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
                    name: "content",
                    type: "text",
                    isNullable: false,
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()",
                },
                {
                    name: "storyid",
                    type: "integer",
                    isNullable: false,
                },
            ],
        }));

        await queryRunner.createForeignKey("chapters", new TableForeignKey({
            columnNames: ["storyid"],
            referencedColumnNames: ["id"],
            referencedTableName: "stories",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("chapters", "FK_chapters_stories");
        await queryRunner.dropTable("chapters");
    }
}
