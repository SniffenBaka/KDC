import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  User,
  Calendar,
  Clock,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Link as LinkIcon,
  School,
  BookOpen,
  Film,
  Lightbulb,
  MessageSquare,
} from "lucide-react";

// Detail page styled to match the original in-app article view.
export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadPost = async () => {
      try {
        const baseQuery = supabase.from("posts").select("*");
        let response;

        if (typeof baseQuery.eq === "function") {
          response = await baseQuery.eq("id", id).single();
        } else {
          const { data, error } = await supabase.from("posts").select("*");
          if (error) throw error;
          const match =
            (data || []).find((row) => String(row.id) === String(id)) || null;
          response = {
            data: match,
            error: match ? null : { message: "not found" },
          };
        }

        if (!mounted) return;

        if (response.error) {
          console.error(response.error);
          setPost(null);
        } else {
          setPost(response.data || null);
        }
      } catch (err) {
        if (!mounted) return;
        console.error(err);
        setPost(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadPost();

    return () => {
      mounted = false;
    };
  }, [id]);

  const readingMinutes = useMemo(() => {
    if (!post?.content) return 1;
    const text = post.content.replace(/<[^>]*>/g, " ");
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    return Math.max(1, Math.ceil(wordCount / 225));
  }, [post]);

  const shellStyle = {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 20% 20%, rgba(139,92,246,0.18), transparent 45%), radial-gradient(circle at 80% 0%, rgba(59,130,246,0.18), transparent 42%), #050505",
    color: "#f9fafb",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: "28px 14px 72px",
  };

  const frameStyle = {
    maxWidth: "1120px",
    margin: "0 auto",
    background: "linear-gradient(160deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "24px",
    padding: "26px",
    boxShadow: "0 30px 90px rgba(0,0,0,0.6)",
  };

  const pill = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "9px 14px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    color: "#e5e7eb",
    fontSize: "13px",
    lineHeight: 1,
  };

  const ghostBtn = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.14)",
    color: "#e5e7eb",
    borderRadius: "12px",
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
  };

  const metaIcon = (cat) => {
    switch (cat) {
      case "Học tập":
        return <School size={14} />;
      case "Sách hay":
        return <BookOpen size={14} />;
      case "Giải trí":
        return <Film size={14} />;
      default:
        return <Lightbulb size={14} />;
    }
  };

  const copyLink = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      });
    }
  };

  if (loading) {
    return (
      <div style={shellStyle}>
        <div style={frameStyle}>Đang tải bài viết...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={shellStyle}>
        <div style={frameStyle}>
          <button onClick={() => navigate(-1)} style={ghostBtn}>
            <ArrowLeft size={16} /> Quay lại
          </button>
          <p style={{ marginTop: 16 }}>Không tìm thấy bài viết</p>
        </div>
      </div>
    );
  }

  const createdAtText = post.created_at
    ? new Date(post.created_at).toLocaleString()
    : "Vừa xong";
  const authorText = post.author || "Ẩn danh";
  const categoryText = post.category || "Giải trí";
  const heroImage = post.image || "";
  const views = post.views || 0;
  const likes = post.likes || 0;
  const dislikes = post.dislikes || 0;

  return (
    <div style={shellStyle}>
      <div style={frameStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <button onClick={() => navigate(-1)} style={ghostBtn}>
            <ArrowLeft size={16} /> Quay lại trang chủ
          </button>
        </div>

        <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ ...pill, padding: "8px 12px", color: "#c4b5fd" }}>
            {metaIcon(categoryText)} {categoryText}
          </span>
          <span style={{ ...pill, padding: "8px 12px", color: "#a5b4fc" }}>
            <User size={14} /> {authorText}
          </span>
          <span style={{ ...pill, padding: "8px 12px", color: "#cbd5e1" }}>
            <Calendar size={14} /> {createdAtText}
          </span>
        </div>

        <h1 style={{ marginTop: 18, marginBottom: 14, fontSize: "32px", fontWeight: 700, letterSpacing: "-0.02em" }}>
          {post.title}
        </h1>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
          <span style={{ ...pill, padding: "9px 12px" }}>
            <Clock size={14} /> {readingMinutes} phút đọc
          </span>
          <span style={{ ...pill, padding: "9px 12px" }}>
            <TrendingUp size={14} /> {views.toLocaleString()} lượt xem
          </span>
        </div>

        {heroImage ? (
          <div
            style={{
              marginTop: 12,
              borderRadius: "22px",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "#0f0f11",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            <img
              src={heroImage}
              alt={post.title}
              style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }}
            />
          </div>
        ) : null}

        <div
          style={{
            marginTop: 22,
            padding: "16px 18px",
            borderRadius: "16px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 14, color: "#9ca3af" }}>Chia sẻ:</span>
            <button style={{ ...pill, padding: "8px 12px" }}>
              <Share2 size={14} /> Share
            </button>
            <button onClick={copyLink} style={{ ...pill, padding: "8px 12px", borderColor: copied ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.08)", color: copied ? "#4ade80" : "#e5e7eb" }}>
              {copied ? "Đã sao chép" : (<><LinkIcon size={14} /> Sao chép link</>)}
            </button>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ ...pill, padding: "8px 12px" }}>
              <ThumbsUp size={16} /> {likes}
            </span>
            <span style={{ ...pill, padding: "8px 12px" }}>
              <ThumbsDown size={16} /> {dislikes}
            </span>
          </div>
        </div>

        <div
          style={{
            marginTop: 22,
            padding: "22px",
            borderRadius: "22px",
            background: "linear-gradient(180deg, rgba(13,16,24,0.8), rgba(10,10,12,0.92))",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
            lineHeight: 1.65,
            color: "#e5e7eb",
          }}
        >
          {post.content ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            <p>Nội dung đang cập nhật.</p>
          )}
        </div>

        <div
          style={{
            marginTop: 28,
            padding: "18px",
            borderRadius: "16px",
            background: "rgba(255,255,255,0.02)",
            border: "1px dashed rgba(255,255,255,0.08)",
            color: "#cbd5e1",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <MessageSquare size={18} />
          Ý kiến của bạn rất quan trọng! Tính năng bình luận sẽ xuất hiện ở bản đầy đủ.
        </div>
      </div>
    </div>
  );
}
