// React
import { use } from "react";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Shield } from "lucide-react";

// UI Components
import { ScrollArea } from "~/_components/ui/scroll-area";
import { Badge } from "~/_components/ui/badge";

// Types
import { type Post } from "~/app/_features/posts/utils/posts";

export default function Posts({
  posts,
}: {
  posts: Promise<Post[]>;
}) {
  const allPosts = posts ? use(posts) : [];

  if (!allPosts || allPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center rounded-xl bg-white/5 border border-white/10 text-gray-400 gap-2">
        <MessageSquare className="size-8 text-gray-400" />
        <p className="text-sm font-medium text-gray-300">No Announcements Yet</p>
        <p className="text-xs text-gray-400">
          Share updates, trade blocks, or league news with everyone.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-80 w-full pr-3">
      <div className="flex flex-col gap-2.5">
        {allPosts.map((post) => {
          const timeAgo = post.createdAt
            ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
            : null;

          return (
            <div
              key={post.id}
              className="flex flex-col gap-1.5 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <Badge
                  variant="outline"
                  className="bg-white/10 text-white border-white/20 text-xs font-normal flex items-center gap-1 px-1.5 py-0.5"
                >
                  {post.teamName ? (
                    <>
                      <span>⚾</span>
                      <span className="truncate max-w-28">{post.teamName}</span>
                    </>
                  ) : (
                    <>
                      <Shield className="size-3 text-amber-400" />
                      <span>Commissioner</span>
                    </>
                  )}
                </Badge>
                {timeAgo && (
                  <span className="text-[11px] text-gray-400 font-normal shrink-0">
                    {timeAgo}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1 pt-0.5">
                <p className="text-sm font-semibold text-white leading-snug">
                  {post.title}
                </p>
                <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line break-words">
                  {post.body}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
