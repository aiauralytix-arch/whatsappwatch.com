import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

type WhapiGroupsResponse = {
  groups?: unknown;
};

type WhapiGroupPayload = {
  id?: string;
  name?: string;
  description?: string;
  participants_count?: number;
  participants?: Array<{ id?: string; rank?: string }>;
};

type WhapiGroupResponse = {
  id: string;
  name: string | null;
  description: string | null;
  participants_count: number;
  admin_ids: string[];
};

const isAdminRank = (rank?: string) =>
  rank === "admin" || rank === "creator";

const toAdminIds = (
  participants?: Array<{ id?: string; rank?: string }>,
) => {
  const adminIds =
    participants
      ?.filter((participant) => isAdminRank(participant.rank))
      .map((participant) => participant.id)
      .filter((id): id is string => Boolean(id)) ?? [];

  return Array.from(new Set(adminIds));
};

const normalizeParticipantsCount = (
  count?: number,
  participants?: Array<{ id?: string; rank?: string }>,
) => {
  if (typeof count === "number" && Number.isFinite(count) && count >= 0) {
    return Math.trunc(count);
  }

  return participants?.length ?? 0;
};

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const token = process.env.WHAPI_API_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "WHAPI_API_TOKEN is not set." },
      { status: 500 },
    );
  }

  const response = await fetch("https://gate.whapi.cloud/groups", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json(
      {
        error: `Failed to fetch Whapi groups.${errorText ? ` Details: ${errorText}` : ""}`,
      },
      { status: 502 },
    );
  }

  const payload = (await response.json()) as WhapiGroupsResponse;
  const groups = Array.isArray(payload.groups)
    ? (payload.groups as WhapiGroupPayload[])
    : [];

  const sanitized: WhapiGroupResponse[] = groups
    .map((group) => {
      if (!group.id) return null;

      return {
        id: group.id,
        name: group.name?.trim() || null,
        description: group.description?.trim() || null,
        participants_count: normalizeParticipantsCount(
          group.participants_count,
          group.participants,
        ),
        admin_ids: toAdminIds(group.participants),
      };
    })
    .filter((group): group is WhapiGroupResponse => Boolean(group));

  return NextResponse.json({ groups: sanitized });
}
