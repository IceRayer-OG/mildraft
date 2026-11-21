import "server-only";

export const MLB_TEAM_SLUGS: Record<string, string> = {
  dbacks: "Arizona Diamondbacks",
  athletics: "Athletics",
  braves: "Atlanta Braves",
  orioles: "Baltimore Orioles",
  redsox: "Boston Red Sox",
  cubs: "Chicago Cubs",
  whitesox: "Chicago White Sox",
  reds: "Cincinnati Reds",
  guardians: "Cleveland Guardians",
  rockies: "Colorado Rockies",
  tigers: "Detroit Tigers",
  astros: "Houston Astros",
  royals: "Kansas City Royals",
  angels: "Los Angeles Angels",
  dodgers: "Los Angeles Dodgers",
  marlins: "Miami Marlins",
  brewers: "Milwaukee Brewers",
  twins: "Minnesota Twins",
  mets: "New York Mets",
  yankees: "New York Yankees",
  phillies: "Philadelphia Phillies",
  pirates: "Pittsburgh Pirates",
  padres: "San Diego Padres",
  mariners: "Seattle Mariners",
  giants: "San Francisco Giants",
  cardinals: "St. Louis Cardinals",
  rays: "Tampa Bay Rays",
  rangers: "Texas Rangers",
  bluejays: "Toronto Blue Jays",
  nationals: "Washington Nationals",
};

export type ValidPosition =
  | "RHP"
  | "LHP"
  | "C"
  | "1B"
  | "2B"
  | "3B"
  | "SS"
  | "OF"
  | "CI"
  | "MI"
  | "INF"
  | "DH"
  | "UTIL";

const VALID_POSITIONS = new Set<ValidPosition>([
  "RHP",
  "LHP",
  "C",
  "1B",
  "2B",
  "3B",
  "SS",
  "OF",
  "CI",
  "MI",
  "INF",
  "DH",
  "UTIL",
]);

export function parsePositions(
  rawPos: string,
  throwsArm?: string | null,
): ValidPosition[] {
  const parts = rawPos
    .split(/[/,]/)
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);

  const result: ValidPosition[] = [];

  for (const part of parts) {
    if (part === "CF" || part === "LF" || part === "RF") {
      if (!result.includes("OF")) result.push("OF");
    } else if (part === "P" || part === "RHP" || part === "LHP") {
      const p = part === "LHP" || throwsArm === "L" ? "LHP" : "RHP";
      if (!result.includes(p)) result.push(p);
    } else if (VALID_POSITIONS.has(part as ValidPosition)) {
      if (!result.includes(part as ValidPosition)) {
        result.push(part as ValidPosition);
      }
    }
  }

  return result.length > 0
    ? result
    : throwsArm === "L"
      ? ["LHP"]
      : ["RHP"];
}

interface GraphQlPlayerEntity {
  eta?: string | null;
  position?: string | null;
  playerPhotoCustomUrl?: string | null;
  player: {
    id: number;
    fullName: string;
    useName?: string | null;
    useLastName?: string | null;
    currentAge?: number | null;
    height?: string | null;
    weight?: number | null;
    batSideCode?: string | null;
    pitchHandCode?: string | null;
    activeRoster?: {
      id?: number | null;
      name?: string | null;
      parentOrgId?: number | null;
      parentOrgName?: string | null;
      sport?: {
        abbreviation?: string | null;
        id?: string | null;
      } | null;
    } | null;
  };
}

interface GraphQlRankingItem {
  rank: number;
  playerEntity: GraphQlPlayerEntity;
}

const GRAPHQL_QUERY = `
  query GetRankings($slug: String!, $limit: Int) {
    getPlayerRankingsFromSelection(slug: $slug, limit: $limit) {
      rank
      playerEntity {
        eta
        position
        playerPhotoCustomUrl
        player {
          id
          fullName
          useName
          useLastName
          currentAge
          height
          weight
          batSideCode
          pitchHandCode
          activeRoster {
            id
            name
            parentOrgId
            parentOrgName
            sport {
              abbreviation
              id
            }
          }
        }
      }
    }
  }
`;

async function fetchGraphQlSlug(
  slug: string,
  limit = 100,
): Promise<GraphQlRankingItem[]> {
  try {
    const res = await fetch("https://data-graph.mlb.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GRAPHQL_QUERY,
        variables: { slug, limit },
      }),
      // Next.js caching: revalidate every hour or fetch fresh
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn(`[MLB Sync] Warning: GraphQL query for ${slug} returned HTTP ${res.status}`);
      return [];
    }

    const json = (await res.json()) as {
      data?: { getPlayerRankingsFromSelection?: GraphQlRankingItem[] };
      errors?: unknown;
    };

    return json.data?.getPlayerRankingsFromSelection ?? [];
  } catch (err) {
    console.error(`[MLB Sync] Error fetching slug ${slug}:`, err);
    return [];
  }
}

interface PersonCareerStats {
  atBats: number;
  inningsPitched: string;
  mlbDebutDate: string | null;
}

async function fetchBulkCareerStats(
  personIds: number[],
): Promise<Map<number, PersonCareerStats>> {
  const statsMap = new Map<number, PersonCareerStats>();
  if (personIds.length === 0) return statsMap;

  // Batch in chunks of 100
  const CHUNK_SIZE = 100;
  for (let i = 0; i < personIds.length; i += CHUNK_SIZE) {
    const chunk = personIds.slice(i, i + CHUNK_SIZE);
    const idList = chunk.join(",");
    const url = `https://statsapi.mlb.com/api/v1/people?personIds=${idList}&hydrate=stats(group=[hitting,pitching],type=[career])`;

    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        console.warn(`[MLB Stats API] Warning: Stats request returned HTTP ${res.status}`);
        continue;
      }

      const data = (await res.json()) as {
        people?: Array<{
          id: number;
          mlbDebutDate?: string;
          stats?: Array<{
            group: { displayName: string };
            splits?: Array<{
              stat?: {
                atBats?: number;
                inningsPitched?: string;
              };
            }>;
          }>;
        }>;
      };

      for (const p of data.people ?? []) {
        const hittingSplit = p.stats
          ?.find((s) => s.group.displayName === "hitting")
          ?.splits?.[0]?.stat;
        const pitchingSplit = p.stats
          ?.find((s) => s.group.displayName === "pitching")
          ?.splits?.[0]?.stat;

        statsMap.set(p.id, {
          atBats: hittingSplit?.atBats ?? 0,
          inningsPitched: pitchingSplit?.inningsPitched ?? "0.0",
          mlbDebutDate: p.mlbDebutDate ?? null,
        });
      }
    } catch (err) {
      console.error("[MLB Stats API] Error fetching batch career stats:", err);
    }
  }

  return statsMap;
}

export interface SyncProspectResult {
  mlbamId: number;
  playerName: string;
  playerFirstName: string | null;
  playerLastName: string | null;
  position: ValidPosition[];
  team: string | null;
  org: string | null;
  orgId: number | null;
  affiliateTeam: string | null;
  level: string | null;
  age: number | null;
  height: string | null;
  weight: number | null;
  throws: "R" | "L" | "B" | "S" | null;
  bats: "R" | "L" | "B" | "S" | null;
  eta: number | null;
  headshotUrl: string | null;
  rank: number | null;
  teamRank: number | null;
  draftRank: number | null;
  intlRank: number | null;
  lists: string[];
  careerMlbAtBats: number;
  careerMlbInningsPitched: string;
  mlbDebutDate: string | null;
  isMilEligible: boolean;
}

export interface SyncOptions {
  year?: number;
  maxCareerAtBats?: number;
  maxCareerInningsPitched?: number;
}

export async function fetchAllProspectsFromMlb(
  options: SyncOptions = {},
): Promise<SyncProspectResult[]> {
  const year = options.year ?? new Date().getFullYear();
  const maxAtBats = options.maxCareerAtBats ?? 130;
  const maxInningsPitched = options.maxCareerInningsPitched ?? 50.0;

  console.log(`[MLB Sync] Starting fetch for year ${year}...`);

  // Build list of all 33 slugs
  const slugTasks: Array<{
    slug: string;
    listType: "top100" | "team" | "draft" | "international";
    teamName?: string;
  }> = [
    { slug: `sel-pr-${year}-top100`, listType: "top100" },
    { slug: `sel-pr-${year}-draft`, listType: "draft" },
    { slug: `sel-pr-${year}-international`, listType: "international" },
  ];

  for (const [teamSlug, teamName] of Object.entries(MLB_TEAM_SLUGS)) {
    slugTasks.push({
      slug: `sel-pr-${year}-${teamSlug}`,
      listType: "team",
      teamName,
    });
  }

  // Fetch in concurrency batches of 6
  const BATCH_CONCURRENCY = 6;
  const rawResults: Array<{
    task: (typeof slugTasks)[0];
    items: GraphQlRankingItem[];
  }> = [];

  for (let i = 0; i < slugTasks.length; i += BATCH_CONCURRENCY) {
    const chunk = slugTasks.slice(i, i + BATCH_CONCURRENCY);
    const chunkResults = await Promise.all(
      chunk.map(async (task) => {
        const limit =
          task.listType === "top100"
            ? 100
            : task.listType === "team"
              ? 30
              : 100;
        const items = await fetchGraphQlSlug(task.slug, limit);
        return { task, items };
      }),
    );
    rawResults.push(...chunkResults);
  }

  console.log(
    `[MLB Sync] Fetched ${rawResults.length} slug lists. Consolidating players...`,
  );

  // Merge into unique prospects map by mlbamId
  const playerMap = new Map<number, SyncProspectResult>();

  for (const { task, items } of rawResults) {
    for (const item of items) {
      const p = item.playerEntity?.player;
      if (!p || !p.id) continue;

      const existing = playerMap.get(p.id);
      const parentOrg =
        p.activeRoster?.parentOrgName ?? task.teamName ?? null;
      const parsedPositions = parsePositions(
        item.playerEntity?.position ?? "",
        p.pitchHandCode,
      );

      const parsedEta = item.playerEntity?.eta
        ? parseInt(item.playerEntity.eta, 10) || null
        : null;

      if (!existing) {
        const listsSet = new Set<string>();
        listsSet.add(task.listType);

        playerMap.set(p.id, {
          mlbamId: p.id,
          playerName: p.fullName || `${p.useName ?? ""} ${p.useLastName ?? ""}`.trim(),
          playerFirstName: p.useName ?? null,
          playerLastName: p.useLastName ?? null,
          position: parsedPositions,
          team: parentOrg,
          org: parentOrg,
          orgId: p.activeRoster?.parentOrgId ?? null,
          affiliateTeam: p.activeRoster?.name ?? null,
          level: p.activeRoster?.sport?.abbreviation ?? null,
          age: p.currentAge ?? null,
          height: p.height ?? null,
          weight: p.weight ?? null,
          throws: (p.pitchHandCode as "R" | "L" | "B" | "S") ?? null,
          bats: (p.batSideCode as "R" | "L" | "B" | "S") ?? null,
          eta: parsedEta,
          headshotUrl: item.playerEntity?.playerPhotoCustomUrl ?? null,
          rank: task.listType === "top100" ? item.rank : null,
          teamRank: task.listType === "team" ? item.rank : null,
          draftRank: task.listType === "draft" ? item.rank : null,
          intlRank: task.listType === "international" ? item.rank : null,
          lists: [task.listType],
          careerMlbAtBats: 0,
          careerMlbInningsPitched: "0.0",
          mlbDebutDate: null,
          isMilEligible: true,
        });
      } else {
        // Merge list memberships and ranks
        if (!existing.lists.includes(task.listType)) {
          existing.lists.push(task.listType);
        }

        if (task.listType === "top100" && !existing.rank) {
          existing.rank = item.rank;
        } else if (task.listType === "team" && !existing.teamRank) {
          existing.teamRank = item.rank;
        } else if (task.listType === "draft" && !existing.draftRank) {
          existing.draftRank = item.rank;
        } else if (task.listType === "international" && !existing.intlRank) {
          existing.intlRank = item.rank;
        }

        // Fill in missing metadata if available
        if (!existing.headshotUrl && item.playerEntity?.playerPhotoCustomUrl) {
          existing.headshotUrl = item.playerEntity.playerPhotoCustomUrl;
        }
        if (!existing.eta && parsedEta) {
          existing.eta = parsedEta;
        }
        if (!existing.level && p.activeRoster?.sport?.abbreviation) {
          existing.level = p.activeRoster.sport.abbreviation;
        }
        if (!existing.affiliateTeam && p.activeRoster?.name) {
          existing.affiliateTeam = p.activeRoster.name;
        }
        if (!existing.org && parentOrg) {
          existing.org = parentOrg;
          existing.team = parentOrg;
        }
      }
    }
  }

  const uniquePlayerIds = Array.from(playerMap.keys());
  console.log(
    `[MLB Sync] Found ${uniquePlayerIds.length} unique prospects. Fetching career MLB stats...`,
  );

  // Bulk hydrate career stats for all prospects
  const statsMap = await fetchBulkCareerStats(uniquePlayerIds);

  // Compute eligibility
  for (const prospect of playerMap.values()) {
    const stats = statsMap.get(prospect.mlbamId);
    if (stats) {
      prospect.careerMlbAtBats = stats.atBats;
      prospect.careerMlbInningsPitched = stats.inningsPitched;
      prospect.mlbDebutDate = stats.mlbDebutDate;

      const numericIp = parseFloat(stats.inningsPitched) || 0;
      prospect.isMilEligible =
        stats.atBats <= maxAtBats && numericIp <= maxInningsPitched;
    } else {
      prospect.careerMlbAtBats = 0;
      prospect.careerMlbInningsPitched = "0.0";
      prospect.mlbDebutDate = null;
      prospect.isMilEligible = true;
    }
  }

  console.log(`[MLB Sync] Successfully processed ${playerMap.size} prospects.`);
  return Array.from(playerMap.values());
}
