import { useQuery } from "@/commands/query";
import { Col } from "@/components/col";
import { ModeToggle } from "@/components/mode-toggle";
import { Nav, NavLink } from "@/components/nav";
import { Row } from "@/components/row";
import { Input } from "@/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Sheet } from "@/sheet";
import { useConnections } from "@/state/connections";
import { State } from "@/utils/state";
import { useState } from "@/utils/use-state";
import { SelectTriggerProps } from "@radix-ui/react-select";
import { Navigate, createLazyFileRoute } from "@tanstack/react-router";
import { Search, ArrowLeft, ArrowRight, RotateCw, Inbox, Loader2 } from "lucide-react";
import { useRef } from "react";

function TopBar() {
  return (
    <Row
      alignSelf="start"
      alignItems="center"
      className="border-b bg-muted/40"
      style={{ width: "100%", height: 40, padding: "0 20px" }}
      gap={10}
    >
      <Row gap={10}>
        <RotateCw className="text-muted-foreground/75 cursor-pointer hover:bg-white/10 rounded h-6 w-6 p-1" />
        <ArrowLeft className="text-muted-foreground/75 cursor-pointer hover:bg-white/10 rounded h-6 w-6 p-1" />
        <ArrowRight className="text-muted-foreground/75 cursor-pointer hover:bg-white/10 rounded h-6 w-6 p-1" />
      </Row>
      <Row>
        <Input
          type="search"
          placeholder="Search products..."
          left={Search}
          size="sm"
          style={{ width: 300 }}
        />
      </Row>
      <ModeToggle variant={"ghost"} style={{ alignSelf: "end" }} />
    </Row>
  );
}

export type DatabaseSwitcherProps = SelectTriggerProps & {
  databases: {
    label: string;
    icon: React.ReactNode;
  }[];
  selected: State<string | undefined>;
};

export function DatabaseSwitcher(props: DatabaseSwitcherProps) {
  const { databases, selected, ...rest } = props;

  return (
    <Select defaultValue={selected[0]} onValueChange={selected[1]}>
      <SelectTrigger
        className={cn(
          "flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0"
        )}
        aria-label="Select account"
        {...rest}
      >
        <SelectValue placeholder="Select a database">
          {databases.find((db) => db.label === selected.value)?.icon}
          <span className={cn("ml-2")}>
            {databases.find((db) => db.label === selected.value)?.label}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {databases.map((db) => (
          <SelectItem key={db.label} value={db.label}>
            <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
              {db.icon}
              {db.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export const Route = createLazyFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const connections = useConnections();
  if (connections.value.length === 0) {
    return <Navigate to="/" />;
  }
  const poolid = connections.value[0].id;
  const databases = useQuery<{ Database: string }[]>(poolid, "SHOW DATABASES");
  const dbSelected = useState(databases.value?.[0].Database);
  const tables = useQuery<{ [index: string]: string }[]>(
    poolid,
    `SHOW TABLES IN ${dbSelected.value}`,
    [dbSelected.value],
    { enabled: !!dbSelected.value }
  );
  const tableSelected = useState<NavLink | undefined>(undefined);
  const table = useQuery<{ [index: string]: string }[]>(
    poolid,
    `SELECT * FROM ${dbSelected.value}.${tableSelected.value?.title}`,
    [tableSelected.value?.title],
    { enabled: !!tableSelected.value }
  );

  if (!databases.value) {
    return null;
  }

  const jsonToMatrix = (data: { [index: string]: string }[]) => {
    if (!data.length) {
      return [];
    }
    const keys = Object.keys(data[0]);
    const values = data.map((x) => Object.values(x));
    return [keys, ...values];
  }

  return (
    <Row flex={1} style={{ maxHeight: "100%" }}>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} style={{ margin: 10 }}>
          <Col gap={10}>
            <DatabaseSwitcher
              databases={databases.value.map((x) => ({
                icon: <Inbox />,
                label: x.Database,
              }))}
              selected={dbSelected}
            />
            <hr />
            <Nav
              isCollapsed={false}
              links={(tables.value ?? []).map((x) => ({
                icon: Inbox,
                title: Object.values(x)[0],
                variant: "ghost",
              }))}
              selected={tableSelected}
            />
          </Col>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel minSize={30}>
          <Col flex={1} width={"100%"} height={"100%"} style={{ overflow: "auto" }}>
            <TopBar />
            <ScrollArea>
              {table.value ? <Sheet data={jsonToMatrix(table.value)} /> : <Loader2 className="mr-2 h-12 w-12 animate-spin" />}

              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </Col>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Row>
  );
}
