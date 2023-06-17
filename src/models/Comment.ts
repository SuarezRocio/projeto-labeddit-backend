export interface CommentDB {
    id: string,
    postId: string,
    creator_id: string,
    dislikes: number,
    likes: number,
    content: string,
    created_at: string,
    update_at: string,
}

// é o modelo de Product que o front receberá (createdAt camelCase)
export interface CommentModel {
    id: string,
    postId: string,
    dislikes: number,
    likes: number,
    content: string,
    created_at: string,
    update_at: string,
    creator: {
        id: string
    }
}

export enum COMMENT_LIKE {
    ALREDY_LIKED = "ALREDY LIKED",
    ALREDY_DISLIKED = "ALREDY DISLIKED"
}


export interface CommentDBWhitCreatorName {
    id: string,
    postId: string,
    creator_id: string,
    dislikes: number,
    likes: number,
    content: string,
    created_at: string,
    update_at: string
}



export interface LikeDislikeDB {
    user_id: string,
    comment_id: string,
    likes: number
}

export interface PostCommentDB {
    post_id: string,
    comment_id: string
}


export interface PostCommentModel {
    postId: string,
    creator_id: string,
    dislikes: number,
    likes: number,
    content: string,
    created_at: string,
    update_at: string
}


export class Comment {
    constructor(
        private id: string,
        private postId: string,
        private creator_id: string,
        private dislikes: number,
        private likes: number,
        private content: string,
        private created_at: string,
        private update_at: string

    ) { }

    public getId(): string {
        return this.id
    }

    public setId(value: string): void {
        this.id = value
    }


    public getposttId(): string {
        return this.postId
    }


    public setposttId(value: string): void {
        this.postId = value
    }

    public getContent(): string {
        return this.content
    }

    public setContent(value: string): void {
        this.content = value
    }

    public getLikes(): number {
        return this.likes
    }

    public setLikes(value: number): void {
        this.likes = value
    }

    public getDislikes(): number {
        return this.dislikes
    }

    public setDislikes(value: number): void {
        this.dislikes = value
    }

    public getCreatedAt(): string {
        return this.created_at
    }

    public setCreatedAt(value: string): void {
        this.created_at = value
    }

    public getUpdateAt(): string {
        return this.update_at
    }

    public setUpdatedAt(value: string): void {
        this.update_at = value
    }


    public getCreator_id(): string {
        return this.creator_id
    }

    public setCreator_id(value: string): void {
        this.creator_id = value
    }


    public addLike = (): void => {
        this.likes++
    }

    public removeLike = (): void => {
        this.likes--
    }


    public addDisLike = (): void => {
        this.likes--
    }

    public removeDisLike = (): void => {
        this.likes--
    }

    // para facilitar nossa vida, temos o método que gera um ProductDB
    public toDBModel(): CommentDB {
        return {
            id: this.id,
            postId: this.postId,
            creator_id: this.creator_id,
            dislikes: this.dislikes,
            likes: this.likes,
            created_at: this.created_at,
            content: this.content,
            update_at: this.update_at,
        }
    }

    // para facilitar nossa vida, temos o método que gera um ProductModel
    public toBusinessModel(): CommentModel {
        return {
            id: this.id,
            postId: this.postId,
            dislikes: this.dislikes,
            likes: this.likes,
            content: this.content,
            created_at: this.created_at,
            update_at: this.update_at,
            creator: {
                id: this.creator_id
            }
        }
    }
}

