import { NextResponse } from "next/server";

export const revalidate = 3600; // cache for 1 hour

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!token) {
    return NextResponse.json({ posts: [], configured: false });
  }

  try {
    const res = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=6&access_token=${token}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) throw new Error("Instagram API error");

    const data = await res.json();
    const posts = (data.data ?? [])
      .filter((p: { media_type: string }) => p.media_type === "IMAGE" || p.media_type === "CAROUSEL_ALBUM")
      .slice(0, 6)
      .map((p: { id: string; media_url: string; thumbnail_url?: string; caption?: string; permalink: string }) => ({
        id: p.id,
        src: p.media_url ?? p.thumbnail_url,
        caption: p.caption?.split("\n")[0]?.slice(0, 80) ?? "",
        href: p.permalink,
      }));

    return NextResponse.json({ posts, configured: true });
  } catch {
    return NextResponse.json({ posts: [], configured: false });
  }
}
