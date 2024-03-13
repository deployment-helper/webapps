import { useQuery } from "@tanstack/react-query";
import { VideoClient } from "@/src/apis/video.client";

export const useQueryGetVideo = (id: string) => {
  return useQuery({
    queryKey: ["video", id],
    queryFn: () => VideoClient.get(id),
  });
};
