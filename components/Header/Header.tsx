"use client";

import { FC, useEffect, useState } from "react";
import {
  Avatar,
  Input,
  Menu,
  MenuButton,
  MenuButtonProps,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Subtitle1,
  Toast,
  ToastTitle,
  Toaster,
  mergeClasses,
  useToastController,
  Spinner,
  Button,
} from "@fluentui/react-components";

import { HeaderProps } from "./Header.types";
import { useStyles } from "./Header.styles";
import {
  ArrowLeft24Filled,
  Navigation24Filled,
  Play20Filled,
} from "@fluentui/react-icons";
import { usePathname, useParams } from "next/navigation";
import useSlidesStore from "@/src/stores/store";
import { ServerClient } from "@/src/apis/server.client";
import { TOASTER_ID } from "@/src/constants";
import {
  useMutationUpdateVideo,
  useQueryGetVideo,
} from "@/src/query/video.query";
import { debounce } from "lodash";
import Language from "@/components/Language/Language";
import { ELanguage } from "@/src/types/video.types";
import { VideoClient } from "@/src/apis/video.client";
import { generatePreviewUrl } from "@/src/helpers";
import { useMyToastController } from "@/components/MyToast";

let debouncedMutation: any = undefined;

export const Header: FC<HeaderProps> = ({
  title,
  type,
  user,
  projectList,
  currentProject,
  checkForCreatePath,
}) => {
  const classes = useStyles();
  const path = usePathname();
  const params = useParams();
  const [presentationName, setPresentationName] = useState("");
  const { isLoading, isFetching, data } = useQueryGetVideo(
    params.video_id as string,
  );
  const { mutate } = useMutationUpdateVideo();
  const { dispatchToast } = useMyToastController();
  const createVideo = async () => {
    VideoClient.generateVideoV2(params.video_id as string, {
      videoId: params.video_id[0] as string,
      url: generatePreviewUrl(params.video_id as string),
    });
    dispatchToast({
      title: "Video is being created",
      body: "You will be notified once the video is ready for download.",
      intent: "success",
    });
  };

  const goBack = () => {
    history.back();
  };

  function onLanguageChange(language: ELanguage) {
    mutate({
      id: params.video_id as string,
      name: presentationName,
      data: { audioLanguage: language },
    });
  }
  function onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (debouncedMutation) {
      debouncedMutation.cancel();
    }

    debouncedMutation = debounce(mutate, 1000);

    debouncedMutation({ id: params.video_id, name: e.target.value });
    setPresentationName(e.target.value);
  }

  if (checkForCreatePath && path.includes("/auth/slides/create")) {
    type = "create";
  }

  if (checkForCreatePath && path.includes("/auth/slides/create-new")) {
    type = "create-new";
  }

  useEffect(() => {
    setPresentationName(data?.name || "UnTitled");
  }, [data]);

  return (
    <>
      <Toaster toasterId={TOASTER_ID} position="top-end" />
      <header
        className={mergeClasses(
          classes.root,
          "flex h-12 w-full items-center pb-2 pl-4 pr-4 pt-2",
        )}
      >
        {type === "public" && (
          <Subtitle1 className={mergeClasses(classes.title)}>{title}</Subtitle1>
        )}
        {type === "auth" && (
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-4">
              <Navigation24Filled
                className={mergeClasses(classes.title, "cursor-pointer")}
              />
              {/* TODO: This could be a separate component */}
              <Menu>
                <MenuTrigger>
                  <MenuButton>{currentProject?.projectName}</MenuButton>
                </MenuTrigger>

                <MenuPopover>
                  <MenuList>
                    {projectList?.map((project) => (
                      <MenuItem key={project.id}>
                        {project.projectName}
                      </MenuItem>
                    ))}
                  </MenuList>
                </MenuPopover>
              </Menu>
            </div>
            <div>
              <Avatar
                className="cursor-pointer"
                image={{
                  src: user?.image,
                  as: "img",
                }}
              />
            </div>
          </div>
        )}
        {/*Create video header*/}
        {(type === "create" || type === "create-new") && (
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-4">
              <ArrowLeft24Filled
                className={mergeClasses(classes.title, "cursor-pointer")}
                onClick={goBack}
              />
              <Menu>
                <MenuTrigger>
                  <MenuButton>{currentProject?.projectName}</MenuButton>
                </MenuTrigger>

                <MenuPopover>
                  <MenuList>
                    {projectList?.map((project) => (
                      <MenuItem key={project.id}>
                        {project.projectName}
                      </MenuItem>
                    ))}
                  </MenuList>
                </MenuPopover>
              </Menu>
              <Subtitle1 className={mergeClasses(classes.title)}>/</Subtitle1>
              <Input
                placeholder="Enter name"
                size="medium"
                value={presentationName}
                onChange={onNameChange}
              />
              <Language
                language={data?.audioLanguage || ""}
                onSelect={onLanguageChange}
              />
              {(isLoading || isFetching) && (
                <div style={{ position: "relative" }}>
                  <Spinner size={"small"} />
                </div>
              )}
            </div>
            <div>
              <Button onClick={createVideo}>
                Create Video
                <Play20Filled className="cursor-pointer" />
              </Button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
