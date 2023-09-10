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
                ],
            }));
                await queryRunner.query(`
                ALTER TABLE stories
                ADD CONSTRAINT fk_user
                FOREIGN KEY (userId)
                REFERENCES users(id)
                ON DELETE CASCADE
                ON UPDATE CASCADE
            `);
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE stories
            DROP CONSTRAINT fk_user
        `);
    }
    }
