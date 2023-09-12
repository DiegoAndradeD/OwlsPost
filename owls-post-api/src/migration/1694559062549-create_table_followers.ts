import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

export class CreateTableFollowers1694559062549 implements MigrationInterface {

        public async up(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.createTable(new Table({
                name: "followers",
                columns: [
                    {
                        name: "id",
                        type: "serial",
                        isPrimary: true,
                    },
                    {
                        name: "followerid",
                        type: "integer",
                    },
                    {
                        name: "followingid",
                        type: "integer",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
            }));
    
            await queryRunner.createForeignKey("followers", new TableForeignKey({
                columnNames: ["followerid"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            }));
    
            await queryRunner.createForeignKey("followers", new TableForeignKey({
                columnNames: ["followingid"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            }));
        }
    
        public async down(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.dropForeignKey("followers", "FK_followers_followerid");
            await queryRunner.dropForeignKey("followers", "FK_followers_followingid");
            await queryRunner.dropTable("followers");
        }
    }
    

