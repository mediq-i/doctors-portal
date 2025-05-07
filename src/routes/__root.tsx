import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import AgoraWrapper from "@/providers/agora-wrapper";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      {/* <div>Hello "__root"!</div> */}
      <AgoraWrapper>
        <Outlet />
      </AgoraWrapper>
    </React.Fragment>
  );
}
