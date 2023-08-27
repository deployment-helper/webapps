import { makeStyles, tokens, shorthands } from "@fluentui/react-components";

export const useStyles = makeStyles({
  bg: {
    backgroundColor: tokens.colorNeutralBackground5,
    ...shorthands.border("1px", "solid", tokens.colorNeutralBackground6),
  },
  borderBottom: {
    ...shorthands.borderBottom(
      "1px",
      "solid",
      tokens.colorNeutralBackground3Pressed,
    ),
  },
});
