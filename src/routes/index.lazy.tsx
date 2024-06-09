import { Col } from "@/components/col";
import { ModeToggle } from "@/components/mode-toggle";
import { Row } from "@/components/row";
import { ConnectionAddForm } from "@/connection-add-form";
import { useConnections } from "@/state/connections";
import {
  StorageConnection,
  StorageConnections,
} from "@/storage/storage-connections";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const connections = useConnections();
  const navigate = useNavigate();

  async function add(value: StorageConnection) {
    const poolId = await invoke<string>("connect", value);
    StorageConnections.add(value);
    connections.value = [...connections.value, { id: poolId }];
    await navigate({ to: "/dashboard" });
  }

  return (
    <Col>
      <Row justifyContent="end" style={{ padding: 10 }}>
        <ModeToggle />
      </Row>
      <Row
        flex={1}
        justifyContent="center"
        alignItems="center"
        style={{ flexGrow: 1 }}
      >
        <ConnectionAddForm onAdd={add} style={{ maxWidth: 400 }} />
      </Row>
    </Col>
  );
}
