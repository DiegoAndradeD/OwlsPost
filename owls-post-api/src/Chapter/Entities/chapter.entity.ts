import { Story } from "../../Story/Entities/story.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({name: 'chapters'}) 
export class Chapter{

    @PrimaryGeneratedColumn('rowid')
    id: Number;

    @Column({name: 'title', nullable: false})
    title: string;

    @Column({name: 'content', nullable: false})
    content: string;

    @ManyToOne(() => Story, (story) => story.chapters)
    @JoinColumn({ name: "storyid" })
    story: Story;
    
    @Column({name: 'created_at'})
    created_at: Date;


}