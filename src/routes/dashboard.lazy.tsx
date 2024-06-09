import { useQuery } from "@/commands/query";
import { Codeblock } from "@/components/codeblock";
import { Col } from "@/components/col";
import { ModeToggle } from "@/components/mode-toggle";
import { Nav } from "@/components/nav";
import { Row, RowProps } from "@/components/row";
import { SpinLoader } from "@/components/spin-loader";
import { Title } from "@/components/typo/title";
import { Input } from "@/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Sheet } from "@/sheet";
import { useCommands } from "@/state/commands";
import { useConnections } from "@/state/connections";
import { State } from "@/utils/state";
import { useState } from "@/utils/use-state";
import { SelectTriggerProps } from "@radix-ui/react-select";
import { Navigate, createLazyFileRoute } from "@tanstack/react-router";
import {
  Search,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Table,
  Database,
} from "lucide-react";
import { useEffect } from "react";

export type TopBarProps = RowProps & {
  search?: State<string>;
};
export function TopBar(props: TopBarProps) {
  const { search, ...rest } = props;

  return (
    <Row
      alignSelf="start"
      alignItems="center"
      className="border-b bg-muted/40"
      style={{ width: "100%", height: 40, padding: "0 20px" }}
      gap={10}
      {...rest}
    >
      <Row gap={10}>
        <RotateCw className="text-muted-foreground/75 cursor-pointer hover:bg-white/10 rounded h-6 w-6 p-1" />
        <ArrowLeft className="text-muted-foreground/75 cursor-pointer hover:bg-white/10 rounded h-6 w-6 p-1" />
        <ArrowRight className="text-muted-foreground/75 cursor-pointer hover:bg-white/10 rounded h-6 w-6 p-1" />
      </Row>
      <Row>
        <Input
          type="search"
          placeholder="Search..."
          left={Search}
          size="sm"
          style={{ width: 300 }}
          model={search}
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
    <Select value={selected.value} onValueChange={selected.set}>
      <SelectTrigger
        className={cn(
          "flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
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
  const dbSelected = useState<string | undefined>(undefined);
  const tables = useQuery<{ [index: string]: string }[]>(
    poolid,
    `SHOW TABLES IN ${dbSelected.value}`,
    [dbSelected.value],
    { enabled: !!dbSelected.value },
  );
  const tableSelected = useState<string | undefined>(undefined);
  const tableSchema = useQuery<
    {
      Default: string;
      Extra: string;
      Field: string;
      Key: string;
      Null: string;
      Type: string;
    }[]
  >(
    poolid,
    `DESCRIBE ${dbSelected.value}.${tableSelected.value}`,
    [tableSelected.value],
    { enabled: !!tableSelected.value },
  );
  const search = useState("");

  let where: string = "";
  const fields = tableSchema.value?.map((x) => x.Field);
  if (search.value && fields) {
    where = `WHERE ${fields.map((x) => x + ` LIKE '%${search.value}%'`).join(" OR ")}`;
  }
  const tableData = useQuery<{ [index: string]: string }[]>(
    poolid,
    `SELECT * FROM ${dbSelected.value}.${tableSelected.value} ${where} LIMIT 100000`,
    [tableSelected.value],
    { enabled: !!tableSelected.value },
  );
  const commands = useCommands();
  useEffect(() => {
    tableSelected.value = undefined;
  }, [dbSelected.value]);
  useEffect(() => {
    tableData.value = undefined;
  }, [tableSelected.value]);
  useEffect(() => {
    if (!databases.value) return;
    const goToDbCommands = databases.value.map((x) => ({
      label: x.Database,
      icon: Database,
      onSelect: () => (dbSelected.value = x.Database),
    }));
    const goToDbGroup = commands.value.find(
      (x) => x.label === "Go to Database",
    ) ?? {
      label: "Go to Database",
      commands: [],
    };
    goToDbGroup.commands = goToDbCommands;
    commands.value = [
      ...commands.value.filter((x) => x !== goToDbGroup),
      goToDbGroup,
    ];
  }, [databases.value]);
  useEffect(() => {
    if (!tables.value) return;
    const goToTableCommands = tables.value.map((x) => ({
      label: Object.values(x)[0],
      icon: Table,
      onSelect: () => (tableSelected.value = Object.values(x)[0]),
    }));
    const goToTableGroup = commands.value.find(
      (x) => x.label === "Go to table",
    ) ?? {
      label: "Go to table",
      commands: [],
    };
    goToTableGroup.commands = goToTableCommands;
    commands.value = [
      ...commands.value.filter((x) => x !== goToTableGroup),
      goToTableGroup,
    ];
  }, [tables.value]);

  if (!databases.value) {
    return <SpinLoader />;
  }

  const jsonToMatrix = (data: { [index: string]: string }[]) => {
    if (!data.length) {
      return null;
    }
    const keys = Object.keys(data[0]);
    const values = data.map((x) => Object.values(x));
    return [keys, ...values];
  };

  const loading = tableData.loading || tables.loading || databases.loading;

  return (
    <Row flex={1} style={{ maxHeight: "100%" }}>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} style={{ margin: 10 }}>
          <Col gap={10}>
            <DatabaseSwitcher
              databases={databases.value.map((x) => ({
                icon: <Database />,
                label: x.Database,
              }))}
              selected={dbSelected}
            />
            <hr />
            <Nav
              isCollapsed={false}
              links={(tables.value ?? []).map((x) => ({
                title: Object.values(x)[0],
                variant: "ghost",
              }))}
              selected={tableSelected}
            />
          </Col>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel minSize={30}>
          <Col
            flex={1}
            width={"100%"}
            height={"100%"}
            style={{ overflow: "auto" }}
          >
            <TopBar search={search} />
            {tableData.value && fields ? (
              <Sheet
                data={jsonToMatrix(tableData.value) ?? [fields]}
                search={search.value}
              />
            ) : loading ? (
              <SpinLoader />
            ) : (
              <Col gap={50} alignItems="center" className="m-auto">
                <img src="src/assets/icon.png" className="m-auto w-80" />
                <Title size="2xl" className="text-zinc-600 font-semibold">
                  Press <Codeblock>Ctrl+K</Codeblock> to open the command
                  palette.
                </Title>
              </Col>
            )}
          </Col>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Row>
  );
}
