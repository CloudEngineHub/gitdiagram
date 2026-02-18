import type { Metadata } from "next";
import RepoPageClient from "./repo-page-client";

type RepoPageProps = {
  params: Promise<{ username: string; repo: string }>;
};

export async function generateMetadata({
  params,
}: RepoPageProps): Promise<Metadata> {
  const { username, repo } = await params;
  return {
    title: `${username}/${repo} Diagram | GitDiagram`,
    description: `Interactive architecture diagram for ${username}/${repo}.`,
  };
}

export default async function Repo({ params }: RepoPageProps) {
  const { username, repo } = await params;
  return <RepoPageClient username={username} repo={repo} />;
}
