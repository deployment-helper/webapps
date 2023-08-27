"use client";

import { FC } from "react";
import { SidebarProps } from "./Sidebar.types";
import { useStyles } from "./Sidebar.styles";
import {
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Subtitle1,
  mergeClasses,
} from "@fluentui/react-components";
import { Add32Filled, AddSquare24Filled } from "@fluentui/react-icons";

export const Sidebar: FC<SidebarProps> = ({ title }) => {
  const classes = useStyles();

  return (
    <>
      <div
        className={mergeClasses("flex h-screen w-72 flex-col p-2", classes.bg)}
      >
        <div
          className={mergeClasses(
            "flex w-full justify-between border-b-4 pb-2",
            classes.borderBottom,
          )}
        >
          <Subtitle1>{title}</Subtitle1>
          <Menu>
            <MenuTrigger>
              <Add32Filled />
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItem>Item1</MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
