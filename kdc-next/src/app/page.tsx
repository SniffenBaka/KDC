import { supabase } from "../lib/supabase";

export default async function Home() {
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main style={{ padding: 24 }}>
        <h1>DB ERROR</h1>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </main>
    );
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>KDC News</h1>

      {posts && posts.length === 0 && (
        <p>Chưa có bài viết</p>
      )}

      {posts?.map((p) => (
        <article key={p.id} style={{ marginTop: 16 }}>
          <h2>{p.title}</h2>
          <p>{p.content}</p>
          <small>Views: {p.view_count}</small>
        </article>
      ))}
    </main>
  );
}
