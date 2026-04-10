import { useFormContext } from "react-hook-form";

import { Button, ButtonProps } from "@mantine/core";

type FormSubmitButtonProps = {
  thinking?: boolean;
  hideOnSave?: boolean;
} & ButtonProps;

export const FormSubmitButton = ({
  thinking = false,
  children,
  hideOnSave,
  ...rest
}: FormSubmitButtonProps) => {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <Button
      type="submit"
      loading={isSubmitting || thinking}
      hidden={hideOnSave && (isSubmitting || thinking)}
      loaderProps={{
        type: "dots",
      }}
      {...rest}
    >
      {children ? children : "Save"}
    </Button>
  );
};
