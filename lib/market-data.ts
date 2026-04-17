import axios from "axios";

import type { MarketDataSnapshot, MarketSignal } from "@/types/analysis";

const api = axios.create({
  timeout: 9000,
  headers: {
    "User-Agent": "agent-economy-market-intelligence/1.0"
  }
});

interface GitHubRepo {
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
}

interface GitHubResponse {
  total_count: number;
  items: GitHubRepo[];
}

interface HNHit {
  points: number;
  num_comments: number;
  created_at_i: number;
}

interface HNResponse {
  hits: HNHit[];
}

interface RedditChild {
  data: {
    upvote_ratio: number;
    num_comments: number;
    created_utc: number;
  };
}

interface RedditResponse {
  data: {
    children: RedditChild[];
  };
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

async function fetchGitHubSignal(query: string): Promise<MarketSignal & { snapshot: Partial<MarketDataSnapshot> }> {
  const endpoint = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}+in:name,description&sort=updated&order=desc&per_page=25`;
  const { data } = await api.get<GitHubResponse>(endpoint);

  const now = Date.now();
  const ninetyDays = 90 * 24 * 60 * 60 * 1000;
  const recentPushes = data.items.filter((repo) => now - new Date(repo.pushed_at).getTime() < ninetyDays).length;
  const recentPushRatio = data.items.length > 0 ? recentPushes / data.items.length : 0;
  const averageStars = average(data.items.map((repo) => repo.stargazers_count));
  const averageForks = average(data.items.map((repo) => repo.forks_count));

  return {
    source: "github",
    signalVolume: clamp(Math.log10(Math.max(data.total_count, 1)) * 20),
    momentum: clamp(recentPushRatio * 100),
    sentiment: clamp((averageStars / 500) * 100),
    confidence: 80,
    summary: `${data.total_count.toLocaleString()} repositories indexed for this market with ${Math.round(recentPushRatio * 100)}% active in last 90 days.`,
    snapshot: {
      githubRepos: data.total_count,
      githubRecentPushRatio: Number(recentPushRatio.toFixed(2))
    }
  };
}

async function fetchHnSignal(query: string): Promise<MarketSignal & { snapshot: Partial<MarketDataSnapshot> }> {
  const endpoint = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=50`;
  const { data } = await api.get<HNResponse>(endpoint);

  const now = Date.now() / 1000;
  const thirtyDays = 30 * 24 * 60 * 60;
  const recentMentions = data.hits.filter((hit) => now - hit.created_at_i < thirtyDays).length;
  const avgPoints = average(data.hits.map((hit) => hit.points ?? 0));
  const avgComments = average(data.hits.map((hit) => hit.num_comments ?? 0));

  return {
    source: "hackernews",
    signalVolume: clamp((data.hits.length / 50) * 100),
    momentum: clamp((recentMentions / Math.max(data.hits.length, 1)) * 100),
    sentiment: clamp((avgPoints * 0.7 + avgComments * 0.3) / 2),
    confidence: 74,
    summary: `${data.hits.length} relevant Hacker News discussions, averaging ${avgPoints.toFixed(1)} points.`,
    snapshot: {
      hnMentions: data.hits.length,
      hnAvgPoints: Number(avgPoints.toFixed(2))
    }
  };
}

async function fetchRedditSignal(query: string): Promise<MarketSignal & { snapshot: Partial<MarketDataSnapshot> }> {
  const endpoint = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=top&t=year&limit=30`;
  const { data } = await api.get<RedditResponse>(endpoint);

  const now = Date.now() / 1000;
  const sixtyDays = 60 * 24 * 60 * 60;
  const posts = data.data.children ?? [];
  const recentMentions = posts.filter((post) => now - post.data.created_utc < sixtyDays).length;
  const avgComments = average(posts.map((post) => post.data.num_comments ?? 0));
  const avgUpvoteRatio = average(posts.map((post) => (post.data.upvote_ratio ?? 0.5) * 100));

  return {
    source: "reddit",
    signalVolume: clamp((posts.length / 30) * 100),
    momentum: clamp((recentMentions / Math.max(posts.length, 1)) * 100),
    sentiment: clamp((avgUpvoteRatio * 0.5 + avgComments * 1.2) / 2),
    confidence: 68,
    summary: `${posts.length} Reddit market conversations with average ${Math.round(avgComments)} comments per thread.`,
    snapshot: {
      redditMentions: posts.length,
      redditAvgComments: Number(avgComments.toFixed(2))
    }
  };
}

function fallbackSignal(source: MarketSignal["source"], market: string): MarketSignal & { snapshot: Partial<MarketDataSnapshot> } {
  const defaults: Record<MarketSignal["source"], Omit<MarketSignal, "source">> = {
    github: {
      signalVolume: 55,
      momentum: 50,
      sentiment: 58,
      confidence: 35,
      summary: `Live ${source} signal temporarily unavailable. Falling back to baseline demand for ${market}.`
    },
    hackernews: {
      signalVolume: 48,
      momentum: 44,
      sentiment: 53,
      confidence: 35,
      summary: `Live ${source} signal temporarily unavailable. Using conservative founder-demand baseline.`
    },
    reddit: {
      signalVolume: 52,
      momentum: 46,
      sentiment: 50,
      confidence: 35,
      summary: `Live ${source} signal temporarily unavailable. Using historical community engagement baseline.`
    }
  };

  return {
    source,
    ...defaults[source],
    snapshot: {}
  };
}

export interface AggregatedMarketData {
  marketSignals: MarketSignal[];
  snapshot: MarketDataSnapshot;
}

export async function gatherMarketData(market: string, agentType: string): Promise<AggregatedMarketData> {
  const query = `${market} ${agentType} ai agent automation`;

  const [githubResult, hnResult, redditResult] = await Promise.allSettled([
    fetchGitHubSignal(query),
    fetchHnSignal(query),
    fetchRedditSignal(query)
  ]);

  const github = githubResult.status === "fulfilled" ? githubResult.value : fallbackSignal("github", market);
  const hn = hnResult.status === "fulfilled" ? hnResult.value : fallbackSignal("hackernews", market);
  const reddit = redditResult.status === "fulfilled" ? redditResult.value : fallbackSignal("reddit", market);

  const snapshot: MarketDataSnapshot = {
    githubRepos: github.snapshot.githubRepos ?? 0,
    githubRecentPushRatio: github.snapshot.githubRecentPushRatio ?? 0,
    hnMentions: hn.snapshot.hnMentions ?? 0,
    hnAvgPoints: hn.snapshot.hnAvgPoints ?? 0,
    redditMentions: reddit.snapshot.redditMentions ?? 0,
    redditAvgComments: reddit.snapshot.redditAvgComments ?? 0
  };

  return {
    marketSignals: [github, hn, reddit],
    snapshot
  };
}
