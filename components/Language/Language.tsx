import {
  Button,
  makeStyles,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from "@fluentui/react-components";
import { LocalLanguage20Filled } from "@fluentui/react-icons";
import { Text } from "@fluentui/react-text";
import { ELanguage } from "@/src/types/video.types";
import { SUPPORTED_LANGUAGES } from "@/src/constants";

const useStyles = makeStyles({
  scrollableMenu: {
    maxHeight: "300px",
    overflowY: "auto",
  },
});
export function Language({ language, onSelect }: ILanguageProps) {
  const classes = useStyles();

  return (
    <Menu positioning="below-end">
      <MenuTrigger disableButtonEnhancement>
        <Button>
          <Text className={"pr-2"}>{language}</Text> <LocalLanguage20Filled />
        </Button>
      </MenuTrigger>

      <MenuPopover>
        <MenuList className={classes.scrollableMenu}>
          {Object.values(SUPPORTED_LANGUAGES).map(({ label, value }) => (
            <MenuItem key={value} onClick={() => onSelect(value)}>
              {label}
            </MenuItem>
          ))}
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
