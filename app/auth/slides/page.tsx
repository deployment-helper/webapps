import Header from "@/components/Header/Header";
import { FC } from "react";
import Server from "../apis/server";
import Link from "next/link";

export const Slides: FC = async () => {
  const user = await Server.getUserInfo();
  return (
    <>
      <Link href={"/auth/slides/create"}>Create Slide</Link>
    </>
  );
};

export default Slides;
