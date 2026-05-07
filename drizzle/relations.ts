import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	mildraftDraft: {
		mildraftLeague: r.one.mildraftLeague({
			from: r.mildraftDraft.leagueId,
			to: r.mildraftLeague.id,
			alias: "mildraftDraft_leagueId_mildraftLeague_id"
		}),
		mildraftDraftPicks: r.many.mildraftDraftPick(),
		mildraftLeagues: r.many.mildraftLeague({
			from: r.mildraftDraft.id.through(r.mildraftDraftSettings.draftId),
			to: r.mildraftLeague.id.through(r.mildraftDraftSettings.leagueId),
			alias: "mildraftDraft_id_mildraftLeague_id_via_mildraftDraftSettings"
		}),
		mildraftQueues: r.many.mildraftQueue(),
	},
	mildraftLeague: {
		mildraftDraftsLeagueId: r.many.mildraftDraft({
			alias: "mildraftDraft_leagueId_mildraftLeague_id"
		}),
		mildraftDraftPicks: r.many.mildraftDraftPick(),
		mildraftDraftsViaMildraftDraftSettings: r.many.mildraftDraft({
			alias: "mildraftDraft_id_mildraftLeague_id_via_mildraftDraftSettings"
		}),
		mildraftPlayers: r.many.mildraftPlayer(),
		mildraftPosts: r.many.mildraftPost(),
		mildraftQueues: r.many.mildraftQueue(),
		mildraftSettings: r.many.mildraftSettings(),
		mildraftTeams: r.many.mildraftTeam(),
	},
	mildraftDraftPick: {
		mildraftDraft: r.one.mildraftDraft({
			from: r.mildraftDraftPick.draftId,
			to: r.mildraftDraft.id
		}),
		mildraftLeague: r.one.mildraftLeague({
			from: r.mildraftDraftPick.leagueId,
			to: r.mildraftLeague.id
		}),
		mildraftPro: r.one.mildraftPros({
			from: r.mildraftDraftPick.playerId,
			to: r.mildraftPros.id
		}),
		mildraftTeam: r.one.mildraftTeam({
			from: r.mildraftDraftPick.teamId,
			to: r.mildraftTeam.id
		}),
	},
	mildraftPros: {
		mildraftDraftPicks: r.many.mildraftDraftPick(),
		mildraftPlayers: r.many.mildraftPlayer(),
		mildraftQueues: r.many.mildraftQueue(),
	},
	mildraftTeam: {
		mildraftDraftPicks: r.many.mildraftDraftPick(),
		mildraftPlayers: r.many.mildraftPlayer(),
		mildraftQueues: r.many.mildraftQueue(),
		mildraftLeague: r.one.mildraftLeague({
			from: r.mildraftTeam.leagueId,
			to: r.mildraftLeague.id
		}),
	},
	mildraftPlayer: {
		mildraftLeague: r.one.mildraftLeague({
			from: r.mildraftPlayer.leagueId,
			to: r.mildraftLeague.id
		}),
		mildraftPro: r.one.mildraftPros({
			from: r.mildraftPlayer.proId,
			to: r.mildraftPros.id
		}),
		mildraftTeam: r.one.mildraftTeam({
			from: r.mildraftPlayer.teamId,
			to: r.mildraftTeam.id
		}),
	},
	mildraftPost: {
		mildraftLeague: r.one.mildraftLeague({
			from: r.mildraftPost.leagueId,
			to: r.mildraftLeague.id
		}),
	},
	mildraftQueue: {
		mildraftDraft: r.one.mildraftDraft({
			from: r.mildraftQueue.draftId,
			to: r.mildraftDraft.id
		}),
		mildraftLeague: r.one.mildraftLeague({
			from: r.mildraftQueue.leagueId,
			to: r.mildraftLeague.id
		}),
		mildraftPro: r.one.mildraftPros({
			from: r.mildraftQueue.playerId,
			to: r.mildraftPros.id
		}),
		mildraftTeam: r.one.mildraftTeam({
			from: r.mildraftQueue.teamId,
			to: r.mildraftTeam.id
		}),
	},
	mildraftSettings: {
		mildraftLeague: r.one.mildraftLeague({
			from: r.mildraftSettings.leagueId,
			to: r.mildraftLeague.id
		}),
	},
}))