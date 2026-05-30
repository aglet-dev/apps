// GitHub PR ingest —— Scheduler C jobs 模式：interval 触发 ingest handler。
//
// 依赖：`gh` CLI 已装 + `gh auth login`。host.spawn 调它，桌面 only。
// 两条查询：review-requested:@me / author:@me，分别落 reviewed_by_me /
// authored_by_me 旗标。同 PR 命中两条 → merge（保 true）。
// 幂等 dedup by pr_id = "<owner/repo>#<number>"。
// 上一轮在库但本轮未命中 → 视为关闭/合并，自动 delete。

const APP_ID = "gh";
const FIELDS = "number,title,url,repository,author,state,isDraft,updatedAt,commentsCount,labels";

function ghSearch(filter) {
  const r = host.spawn("gh", [
    "search", "prs",
    filter,
    "--state=open",
    "--json", FIELDS,
    "--limit", "100",
  ]);
  if (!r.ok) throw new Error(`gh search ${filter} failed (code=${r.code}): ${r.stderr.slice(0, 200)}`);
  return JSON.parse(r.stdout);
}

function upsert(pr, kind, seen, counters) {
  const pr_id = `${pr.repository.nameWithOwner}#${pr.number}`;
  seen.add(pr_id);
  const labels = (pr.labels || []).map(l => l.name).join(", ");
  let reviewed = kind === "review";
  let authored = kind === "mine";

  const existing = aglet.data.list(APP_ID, "prs", { where: { pr_id }, limit: 1 });
  if (existing.items.length > 0) {
    const ex = existing.items[0].data;
    if (ex.reviewed_by_me) reviewed = true;
    if (ex.authored_by_me) authored = true;
  }

  const data = {
    pr_id,
    number: pr.number,
    title: pr.title,
    url: pr.url,
    repo: pr.repository.nameWithOwner,
    author: (pr.author && pr.author.login) || "",
    state: pr.state,
    is_draft: !!pr.isDraft,
    reviewed_by_me: reviewed,
    authored_by_me: authored,
    comments_count: pr.commentsCount || 0,
    labels,
    updated_at: pr.updatedAt,
  };

  if (existing.items.length > 0) {
    aglet.data.update(APP_ID, "prs", existing.items[0].id, data);
    counters.updated++;
  } else {
    aglet.data.create(APP_ID, "prs", data);
    counters.added++;
  }
}

export default {
  async ingest(_, _ctx) {
    const reviews = ghSearch("--review-requested=@me");
    const mine    = ghSearch("--author=@me");

    const counters = { added: 0, updated: 0, removed: 0 };
    const seen = new Set();
    for (const pr of reviews) upsert(pr, "review", seen, counters);
    for (const pr of mine)    upsert(pr, "mine", seen, counters);

    const all = aglet.data.list(APP_ID, "prs", { limit: 500 });
    for (const row of all.items) {
      if (!seen.has(row.data.pr_id)) {
        aglet.data.delete(APP_ID, "prs", row.id);
        counters.removed++;
      }
    }

    return { reviewed: reviews.length, mine: mine.length, ...counters };
  },
};
