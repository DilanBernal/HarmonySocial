type Post = {
  id: number;
  user_id: number;
  song_id: number;
  publication_date: Date;
  title: string;
  description: string;
  short_description: string;
  likes_number: number;
  comments_number: number;
  created_at: Date;
  updated_at?: Date;
}