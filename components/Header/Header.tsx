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
  SplitButton,
  Subtitle1,
  Toast,
  ToastTitle,
  Toaster,
  mergeClasses,
  useToastController,
  Dialog,
  DialogTrigger,
  Button,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  Spinner,
} from "@fluentui/react-components";

import { HeaderProps } from "./Header.types";
import { useStyles } from "./Header.styles";
import {
  ArrowLeft24Filled,
  ImageAdd24Filled,
  Navigation24Filled,
} from "@fluentui/react-icons";
import { usePathname, useParams } from "next/navigation";
import useSlidesStore from "@/src/stores/store";
import { ServerClient } from "@/src/apis/server.client";
import { TOASTER_ID } from "@/src/constants";
import UploadImage from "../UploadImage/UploadImage";
import {
  useMutationUpdateVideo,
  useQueryGetVideo,
} from "@/src/query/video.query";
import { useMutation } from "@tanstack/react-query";
import { debounce } from "lodash";

function CreatePresentationHeader() {
  const classes = useStyles();

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-4">
        <Dialog>
          <DialogTrigger>
            <ImageAdd24Filled
              className={mergeClasses(classes.title, "cursor-pointer")}
            />
          </DialogTrigger>
          <DialogSurface>
            <DialogBody>
              <DialogTitle>Upload Image</DialogTitle>
              <DialogContent>
                <UploadImage
                  onUploadSuccess={() => console.log("uploaded successfully!")}
                />
              </DialogContent>
              <DialogActions>
                <DialogTrigger disableButtonEnhancement>
                  <Button appearance="secondary">Close</Button>
                </DialogTrigger>
                <Button appearance="primary">Do Something</Button>
              </DialogActions>
            </DialogBody>
          </DialogSurface>
        </Dialog>
      </div>
    </div>
  );
}

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
  const editorFile = useSlidesStore((state) => state.createSlide?.editorFile);
  const { isLoading, isFetching, data } = useQueryGetVideo(
    params.video_id as string,
  );
  const { mutate } = useMutationUpdateVideo();

  // TODO: A new hook for toast creation at application level can be created
  const { dispatchToast } = useToastController(TOASTER_ID);

  const notify = () => {
    dispatchToast(
      <Toast>
        <ToastTitle>{`${presentationName} Presentation created.`}</ToastTitle>
      </Toast>,
      { intent: "success" },
    );
  };

  const goBack = () => {
    history.back();
  };

  const publish = (isDraft?: boolean) => {
    ServerClient.createPresentation(
      presentationName,
      currentProject?.projectId || "",
      editorFile,
    ).then((res) => {
      notify();
    });
  };

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
                      <MenuItem key={project.projectId}>
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
                      <MenuItem key={project.projectId}>
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
              {(isLoading || isFetching) && (
                <div style={{ position: "relative" }}>
                  <Spinner size={"small"} />
                </div>
              )}
            </div>
            <div>
              {/* TODO: This could be a separate component */}
              <Menu positioning="below-end">
                <MenuTrigger disableButtonEnhancement>
                  {(triggerProps: MenuButtonProps) => (
                    <SplitButton
                      onClick={() => publish()}
                      menuButton={triggerProps}
                    >
                      Publish
                    </SplitButton>
                  )}
                </MenuTrigger>

                <MenuPopover>
                  <MenuList>
                    <MenuItem onClick={() => publish(true)}>Draft</MenuItem>
                  </MenuList>
                </MenuPopover>
              </Menu>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
