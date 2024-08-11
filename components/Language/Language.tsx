import {
  Button,
  makeStyles,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from '@fluentui/react-components';
import { Text } from '@fluentui/react-text';
import { ELanguage } from '@/src/types/video.types';
import { SUPPORTED_LANGUAGES } from '@/src/constants';
import { Globe24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  scrollableMenu: {
    maxHeight: '300px',
    overflowY: 'auto',
  },
});

export function Language({
  currentLanguage = 'Select Language',
  onSelect,
}: ILanguageProps) {
  const classes = useStyles();

  return (
    <Menu positioning="below-end">
      <MenuTrigger disableButtonEnhancement>
        <Button>
          <Text className={'pr-2'}>{currentLanguage}</Text> <Globe24Regular />
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
  currentLanguage?: ELanguage | 'Select Language';
}

export default Language;
