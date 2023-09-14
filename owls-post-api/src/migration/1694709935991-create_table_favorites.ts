import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTableFavorites1694709935991 implements MigrationInterface {

   
public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
        name: "favorites",
        columns: [
            {
                name: "id",
                type: "serial",
                isPrimary: true,
            },
            {
                name: "userid",
                type: "integer",
                isNullable: false,
            },
            {
                name: "storyid",
                type: "integer",
                isNullable: false,
            },
        ],
        indices: [
            {
                name: "unique_user_story_pair",
                columnNames: ["userid", "storyid"],
                isUnique: true,
            },
        ],
    }));


        await queryRunner.createForeignKey("favorites", new TableForeignKey({
            columnNames: ["userid"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE",
        }));

        await queryRunner.createForeignKey("favorites", new TableForeignKey({
            columnNames: ["storyid"],
            referencedColumnNames: ["id"],
            referencedTableName: "stories",
            onDelete: "CASCADE", 
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("favorites");
    }

}
