import { makeStyles } from "@fluentui/react-components";
import { tokens } from "@fluentui/react-theme";

export const useStyles = makeStyles({
  root: {
    backgroundColor: tokens.colorBrandBackground,
  },
  title: {
    color: tokens.colorNeutralForegroundOnBrand,
  },
});

export default useStyles;
