/* eslint-disable prettier/prettier */
import { Repository, EntityRepository } from "typeorm";
import { Comment } from "./comment.entity";
import { CreateCommentDto } from "./dto/create-comments.dto";
import { UpdateCommentDto } from "./dto/update-comments.dto";

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {

    async getComment(comment_id): Promise<Comment> {
        return await Comment.createQueryBuilder('comment')
        .select(['comment.comment_id', 'comment.user_id', 'comment.text', 'user.user_id', 'user.name', 'user.email'])
        .leftJoin('comment.user', 'user')
        .where('comment.comment_id = :comment_id', { comment_id })
        .getOne()
    }

    async getComments(data): Promise<any> {
        const post_id = data.post_id;
        const page: number = parseInt(data.page as any) || 1;
        const per_page: number = parseInt(data.per_page as any) || 5;
        const order_by_col: any = data.order_by_col
        const order_by_dir: any = data.order_by_dir

        const comments = await Comment.createQueryBuilder('comment')

        comments.select(['comment.comment_id', 'comment.post_id', 'comment.user_id', 'comment.text', 'user.user_id', 'user.name'])
        .leftJoin('comment.user', 'user')
        .where('comment.post_id = :post_id', { post_id })

        //paginating
        comments.skip(page - 1).take(per_page)

        //ordering
        if(order_by_col != null && order_by_dir != null) {
            comments.addOrderBy(`comment.${order_by_col}`, order_by_dir.toUpperCase())
        }

        const total = await comments.getCount()

        //returning paginated data
        return {
            data: await comments.getMany(),
            total: total,
            last_page: Math.ceil(total / per_page)
        }
    }

    async createComment(createCommentsDto: CreateCommentDto): Promise<Comment> {
        const comment = new Comment();
        comment.user_id = createCommentsDto.user_id;
        comment.post_id = createCommentsDto.post_id;
        comment.text = createCommentsDto.text;
        return await comment.save();
    }

    async updateComment(updateCommentDto: UpdateCommentDto): Promise<Comment> {
        await this.update(updateCommentDto.comment_id, updateCommentDto);
        return await Comment.findOne({ comment_id: updateCommentDto.comment_id });
    }
}