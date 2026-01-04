import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => setPost(data));
  }, [id]);

  if (!post) return <p>Đang tải...</p>;

  return (
    <>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </>
  );
}
