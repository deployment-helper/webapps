import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerHeaderTitle,
  Input,
  Label,
  Textarea,
} from "@fluentui/react-components";
import { useRef } from "react";

export function FormAddProject({
  isOpen,
  onClose,
  onSubmit,
}: IFormAddProjectProps) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      projectName: "",
      projectDescription: "",
    },
  });

  const formRef = useRef<HTMLFormElement>(null);
  const handleFormSubmit = (data: any) => {
    onSubmit(data);
  };
  // TODO: color red for required fields
  return (
    <div>
      <Drawer
        type={"overlay"}
        onOpenChange={onClose}
        open={isOpen}
        position={"end"}
        size={"medium"}
      >
        <DrawerHeader>
          <DrawerHeaderTitle>Add Project</DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerBody>
          <form ref={formRef} onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="flex flex-col gap-4">
              <div>
                <Controller
                  name="projectName"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      id="projectName"
                      placeholder="Project Name"
                      className={"w-full"}
                    />
                  )}
                />
                {errors.projectName && <Label>This field is required</Label>}
              </div>
              <div>
                <Controller
                  name="projectDescription"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      id="projectDescription"
                      placeholder="Project Description"
                      className={"w-full"}
                    />
                  )}
                />
                {errors.projectDescription && (
                  <Label>This field is required</Label>
                )}
              </div>
            </div>
          </form>
        </DrawerBody>
        <DrawerFooter>
          <div className={"flex w-full justify-end gap-5"}>
            <Button size={"large"} onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={() => {
                formRef.current?.requestSubmit();
              }}
              size={"large"}
              appearance={"primary"}
            >
              Submit
            </Button>
          </div>
        </DrawerFooter>
      </Drawer>
    </div>
  );
}

interface IFormAddProjectProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { projectName: string; projectDescription: string }) => void;
}
export default FormAddProject;
