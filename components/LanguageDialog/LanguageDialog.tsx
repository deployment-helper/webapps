"use client";
import * as React from "react";
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  Button,
  Dropdown,
  Option,
  OptionOnSelectData,
  SelectionEvents,
} from "@fluentui/react-components";
import { SUPPORTED_LANGUAGES } from "@/src/constants";

interface LanguageDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (language: string) => void;
}

export const LanguageDialog: React.FC<LanguageDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [language, setLanguage] = React.useState<string>("");

  const handleChange = (event: SelectionEvents, data: OptionOnSelectData) => {
    setLanguage(data.optionValue as string);
  };

  return (
    <Dialog open={open}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Select Language</DialogTitle>
          <Dropdown
            positioning={"below"}
            placeholder="Select an option"
            onOptionSelect={handleChange}
          >
            {Object.entries(SUPPORTED_LANGUAGES).map(([key, value]) => (
              <Option key={key} value={value.value}>
                {value.label}
              </Option>
            ))}
          </Dropdown>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>
              Close
            </Button>
            <Button appearance="primary" onClick={() => onSubmit(language)}>
              Submit
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
