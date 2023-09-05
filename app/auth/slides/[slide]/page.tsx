export const Page = ({
  params,
  searchParams,
}: {
  params: { slide: string };
  searchParams: { updatedAt: string; apiKey: string };
}) => {
  return `PresentationId: ${params.slide}, updatedAt:${searchParams.updatedAt}, apiKey:${searchParams.apiKey}`;
};

export default Page;
