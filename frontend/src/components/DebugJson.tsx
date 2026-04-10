import { FC } from "react";

export const DebugJson: FC<{ data: unknown }> = ({ data }) => {
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};
