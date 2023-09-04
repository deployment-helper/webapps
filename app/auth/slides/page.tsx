"use client";
import { FC, useEffect } from "react";
import Link from "next/link";
import useSlidesStore from "../../../src/store";

export const Slides: FC = () => {
  const { listPresentations } = useSlidesStore();
  const currentProject = useSlidesStore((store) => store.currentProject);
  const presentations = useSlidesStore((store) => store.presentations);

  useEffect(() => {
    if (currentProject && !presentations?.length) {
      listPresentations(currentProject?.projectId);
    }
  }, [currentProject]);

  return (
    <>
      <Link href={"/auth/slides/create"}>Create Slide</Link>
      <div className="w-100 max-w-7xl">
        {/* <>{JSON.stringify(presentations)}</>
        <DataGrid items={presentations.Items}></DataGrid> */}
        <>
          {presentations?.length
            ? JSON.stringify(presentations)
            : "No presentations exist"}
        </>
      </div>
    </>
  );
};

export default Slides;
