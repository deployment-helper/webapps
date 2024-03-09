"use client";

import { FC, useState } from "react";
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
} from "@fluentui/react-components";

import { HeaderProps } from "./Header.types";
import { useStyles } from "./Header.styles";
import {
  ArrowLeft24Filled,
  ImageAdd24Filled,
  Navigation24Filled,
} from "@fluentui/react-icons";
import { usePathname } from "next/navigation";
import useSlidesStore from "@/src/stores/store";
import { ServerClient } from "@/src/server-client";
import { TOASTER_ID } from "@/src/constants";
import UploadImage from "../UploadImage/UploadImage";

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
  const [presentationName, setPresentationName] = useState("UnTitled");
  const editorFile = useSlidesStore((state) => state.createSlide?.editorFile);

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

  if (checkForCreatePath && path === "/auth/slides/create") {
    type = "create";
  } else if (checkForCreatePath && path === "/auth/slides/create-new") {
    type = "create-new";
  }

  function CreatePresentationHeader() {
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
                  <UploadImage />
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
                placeholder="UnTitled"
                size="medium"
                value={presentationName}
                onChange={(e) => {
                  setPresentationName(e.target.value);
                }}
              />
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
