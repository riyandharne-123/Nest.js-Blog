/* eslint-disable prettier/prettier */
import { Repository, EntityRepository } from "typeorm";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { Post } from "./post.entity";

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {

    async getPosts(data): Promise<any> {

        const page: number = parseInt(data.page as any) || 1;
        const per_page: number = parseInt(data.per_page as any) || 5;
        const order_by_col: any = data.order_by_col
        const order_by_dir: any = data.order_by_dir

        const posts = await Post.createQueryBuilder('post')

        posts.select(['post.post_id', 'post.user_id', 'post.title', 'post.description',
        'user.user_id', 'user.name', 'user.email', 'comment.comment_id','comment.text'])
        .leftJoin('post.user', 'user')
        .leftJoin('post.comments', 'comment', 'comment.post_id = post.post_id')

        //paginating
        posts.skip(page - 1).take(per_page)

        //ordering
        if(order_by_col != null && order_by_dir != null) {
            posts.addOrderBy(`post.${order_by_col}`, order_by_dir.toUpperCase())
        }

        const total = await posts.getCount()

        //returning paginated data
        return {
            data: await posts.getMany(),
            total: total,
            last_page: Math.ceil(total / per_page)
        }
    }

    async getPost(post_id): Promise<Post> {
        return await Post.createQueryBuilder('post')
        .select(['post.post_id', 'post.user_id', 'post.title', 'post.description',
        'user.user_id', 'user.name', 'user.email', 'comment.comment_id','comment.text'])
        .leftJoin('post.user', 'user')
        .leftJoin('post.comments', 'comment', 'comment.post_id = post.post_id')
        .where('post.post_id = :post_id', { post_id })
        .getOne()
    }

    async getUserPosts(user_id, data): Promise<any> {

        const page: number = parseInt(data.page as any) || 1;
        const per_page: number = parseInt(data.per_page as any) || 5;
        const order_by_col: any = data.order_by_col
        const order_by_dir: any = data.order_by_dir

        const posts = await Post.createQueryBuilder('post')

        posts.select(['post.post_id', 'post.user_id', 'post.title', 'post.description',
        'user.user_id', 'user.name', 'user.email', 'comment.comment_id','comment.text'])
        .leftJoin('post.user', 'user')
        .leftJoin('post.comments', 'comment', 'comment.post_id = post.post_id')
        .where('post.user_id = :user_id', { user_id })
        
        //paginating
        posts.skip(page - 1).take(per_page)

        //ordering
        if(order_by_col != null && order_by_dir != null) {
            posts.addOrderBy(`post.${order_by_col}`, order_by_dir.toUpperCase())
        }
        
        const total = await posts.getCount()

        //returning paginated data
        return {
            data: await posts.getMany(),
            total: total,
            last_page: Math.ceil(total / per_page)
        }
    }

    async createPost(createPostDto: CreatePostDto): Promise<Post> {
        const post = new Post();
        post.user_id = createPostDto['user_id'];
        post.title = createPostDto.title;
        post.description = createPostDto.description;
        return await post.save();
    }

    async updatePost(updatePostDto: UpdatePostDto): Promise<any> {
        await this.update(updatePostDto.post_id, updatePostDto);
        return await Post.findOne({ post_id: updatePostDto.post_id });
    }
}