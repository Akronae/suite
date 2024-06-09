import { Col } from "@/components/col";
import { ModeToggle } from "@/components/mode-toggle";
import { Row } from "@/components/row";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <Col style={{ display: "flex", width: "100%", height: "100%" }}>
        <Outlet />
        <TanStackRouterDevtools />
      </Col>
    </>
  ),
});
