import {
  Button,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from "@fluentui/react-components";
import { LocalLanguage20Filled } from "@fluentui/react-icons";
import { Text } from "@fluentui/react-text";
import { ELanguage } from "@/src/types/video.types";

export function Language({ language, onSelect }: ILanguageProps) {
  return (
    <Menu positioning="below-end">
      <MenuTrigger disableButtonEnhancement>
        <Button>
          <Text className={"pr-2"}>{language}</Text> <LocalLanguage20Filled />
        </Button>
      </MenuTrigger>

      <MenuPopover>
        <MenuList>
          <MenuItem onClick={() => onSelect(ELanguage.Hindi)}>Hindi</MenuItem>
          <MenuItem onClick={() => onSelect(ELanguage.English)}>
            English
          </MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
}

export interface ILanguageProps {
  onSelect: (language: ELanguage) => void;
  language: string;
}

export default Language;
