import "./App.css";
import { Input } from "./components/ui/input";
import { Title } from "./components/typo/title.tsx";
import { Col, ColProps } from "./components/col.tsx";
import { Button } from "./components/ui/button.tsx";
import { useState } from "./utils/use-state.ts";
import { StorageConnection } from "./storage/storage-connections.ts";
import { ChipColorPicker } from "./components/chip-color-picker.tsx";

export type ConnectionAddFormProps = ColProps & {
  onAdd: (value: StorageConnection) => void;
};

export function ConnectionAddForm(props: ConnectionAddFormProps) {
  const { onAdd, ...rest } = props;

  const host = useState("192.168.1.26");
  const user = useState("root");
  const password = useState("pass");
  const port = useState("3306");
  const color = useState("#889397");

  async function add() {
    await onAdd({
      host: host.value,
      user: user.value,
      password: password.value,
      port: Number(port.value),
      color: color.value,
    });
  }

  return (
    <Col gap={40} {...rest}>
      <Title size="6xl">Add your first connection</Title>

      <Col gap={10}>
        <Input model={host} placeholder="Host" />
        <Input model={user} placeholder="User" />
        <Input model={password} placeholder="Password" />
        <Input model={port} placeholder="Port" />
      </Col>
      <ChipColorPicker
        model={color}
        colors={[
          "#889397",
          "#00a35c",
          "#71f6ba",
          "#016bf8",
          "#0498ec",
          "#f6c343",
          "#f6a343",
          "#f64343",
          "#b45af2",
          "#f1d4fd",
        ]}
      />
      <Button onClick={add}>Save & Connect</Button>
    </Col>
  );
}
