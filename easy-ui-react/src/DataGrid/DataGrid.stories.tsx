import { Meta, StoryObj } from "@storybook/react";
import React, { useMemo } from "react";
import { Selection } from "react-stately";
import { DataGrid } from "./DataGrid";
import { Menu } from "../Menu";
import CheckCircleIcon from "@easypost/easy-ui-icons/CheckCircle";

type Story = StoryObj<typeof DataGrid>;

const meta: Meta<typeof DataGrid> = {
  title: "Components/DataGrid",
  component: DataGrid,
};

export default meta;

// export const Basic: Story = {
//   render: () => {
//     return (
//       <Table aria-label="Basic table" selectionMode="single">
//         <TableHeader>
//           <Column>Name</Column>
//           <Column>Type</Column>
//           <Column>Level</Column>
//           <Column textValue="action">&nbsp;</Column>
//         </TableHeader>
//         <TableBody>
//           <Row key="1">
//             <Cell>Charizard</Cell>
//             <Cell>Fire, Flying</Cell>
//             <Cell>67</Cell>
//             <Cell>
//               <button
//                 onPointerDown={(e) => {
//                   e.stopPropagation();
//                 }}
//                 onClick={() => {
//                   window.alert("hello");
//                 }}
//               >
//                 Test
//               </button>
//             </Cell>
//           </Row>
//           <Row key="2">
//             <Cell>Blastoise</Cell>
//             <Cell>Water</Cell>
//             <Cell>56</Cell>
//             <Cell>
//               <button>Test</button>
//             </Cell>
//           </Row>
//           <Row key="3">
//             <Cell>Venusaur</Cell>
//             <Cell>Grass, Poison</Cell>
//             <Cell>83</Cell>
//             <Cell>
//               <button>Test</button>
//             </Cell>
//           </Row>
//           <Row key="4">
//             <Cell>Pikachu</Cell>
//             <Cell>Electric</Cell>
//             <Cell>100</Cell>
//             <Cell>
//               <button>Test</button>
//             </Cell>
//           </Row>
//         </TableBody>
//       </Table>
//     );
//   },
// };

// export const SingleSelection: Story = {
//   render: () => {
//     return (
//       <Table aria-label="Single selection" selectionMode="single">
//         <TableHeader>
//           <Column>Name</Column>
//           <Column>Type</Column>
//           <Column>Level</Column>
//         </TableHeader>
//         <TableBody>
//           <Row key="1">
//             <Cell>Charizard</Cell>
//             <Cell>Fire, Flying</Cell>
//             <Cell>67</Cell>
//           </Row>
//           <Row key="2">
//             <Cell>Blastoise</Cell>
//             <Cell>Water</Cell>
//             <Cell>56</Cell>
//           </Row>
//           <Row key="3">
//             <Cell>Venusaur</Cell>
//             <Cell>Grass, Poison</Cell>
//             <Cell>83</Cell>
//           </Row>
//           <Row key="4">
//             <Cell>Pikachu</Cell>
//             <Cell>Electric</Cell>
//             <Cell>100</Cell>
//           </Row>
//         </TableBody>
//       </Table>
//     );
//   },
// };

// export const MultipleSelection: Story = {
//   render: () => {
//     return (
//       <Table aria-label="Multiple selection" selectionMode="multiple">
//         <TableHeader>
//           <Column>Name</Column>
//           <Column>Type</Column>
//           <Column>Level</Column>
//         </TableHeader>
//         <TableBody>
//           <Row key="1">
//             <Cell>Charizard</Cell>
//             <Cell>Fire, Flying</Cell>
//             <Cell>67</Cell>
//           </Row>
//           <Row key="2">
//             <Cell>Blastoise</Cell>
//             <Cell>Water</Cell>
//             <Cell>56</Cell>
//           </Row>
//           <Row key="3">
//             <Cell>Venusaur</Cell>
//             <Cell>Grass, Poison</Cell>
//             <Cell>83</Cell>
//           </Row>
//           <Row key="4">
//             <Cell>Pikachu</Cell>
//             <Cell>Electric</Cell>
//             <Cell>100</Cell>
//           </Row>
//         </TableBody>
//       </Table>
//     );
//   },
// };

export const Test: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const columns = useMemo(
      () => [
        { key: "name", name: "Name" },
        { key: "type", name: "Type" },
        { key: "date", name: "Date Modified" },
      ],
      [],
    );

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const rows = useMemo(
      () => [
        { key: 1, name: "Games", date: "6/7/2020", type: "File folder" },
        {
          key: 2,
          name: "Program Files",
          date: "4/7/2021",
          type: "File folder",
        },
        { key: 3, name: "bootmgr", date: "11/20/2010", type: "System file" },
        { key: 4, name: "log.txt", date: "1/18/2016", type: "Text Document" },
      ],
      [],
    );

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
      new Set([2]),
    );

    return (
      <DataGrid
        aria-label="Example dynamic collection table"
        disabledKeys={[3]}
        onSelectionChange={setSelectedKeys}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        columns={columns}
        rows={rows}
        hasExpandableRows
        renderExpandedRow={(rowKey) => <>Custom Content {rowKey}</>}
        renderColumnCell={(column) => {
          return <>{column.name}</>;
        }}
        renderRowCell={(item) => {
          return <>{item}</>;
        }}
        rowActions={[
          {
            type: "menu",
            renderMenuOverlay: () => (
              <Menu.Overlay
                onAction={() => {
                  console.log("menu");
                }}
              >
                <Menu.Item>Test 1</Menu.Item>
                <Menu.Item>Test 2</Menu.Item>
              </Menu.Overlay>
            ),
          },
          {
            type: "action",
            iconSymbol: CheckCircleIcon,
            accessibilityLabel: "test",
            onAction: () => {},
          },
        ]}
      />
    );
  },
};

// export const Sort: Story = {
//   render: () => {
//     // eslint-disable-next-line react-hooks/rules-of-hooks
//     const list = useAsyncList<{
//       name: string;
//       height: string;
//       mass: string;
//       birth_year: string;
//     }>({
//       load() {
//         return {
//           items: [
//             {
//               name: "Luke Skywalker",
//               height: "172",
//               mass: "77",
//               birth_year: "19BBY",
//             },
//             {
//               name: "C-3PO",
//               height: "167",
//               mass: "75",
//               birth_year: "112BBY",
//             },
//             {
//               name: "R2-D2",
//               height: "96",
//               mass: "32",
//               birth_year: "33BBY",
//             },
//           ],
//         };
//       },
//       sort({ items, sortDescriptor }) {
//         return {
//           items: items.sort((a, b) => {
//             const first = a[sortDescriptor.column as keyof typeof a];
//             const second = b[sortDescriptor.column as keyof typeof b];
//             let cmp =
//               (parseInt(first) || first) < (parseInt(second) || second)
//                 ? -1
//                 : 1;
//             if (sortDescriptor.direction === "descending") {
//               cmp *= -1;
//             }
//             return cmp;
//           }),
//         };
//       },
//     });
//     return (
//       <Table
//         aria-label="Example table with client side sorting"
//         sortDescriptor={list.sortDescriptor}
//         onSortChange={list.sort}
//       >
//         <TableHeader>
//           <Column key="name" allowsSorting>
//             Name
//           </Column>
//           <Column key="height" allowsSorting>
//             Height
//           </Column>
//           <Column key="mass" allowsSorting>
//             Mass
//           </Column>
//           <Column key="birth_year" allowsSorting>
//             Birth Year
//           </Column>
//         </TableHeader>
//         <TableBody items={list.items}>
//           {(item) => (
//             <Row key={item.name}>
//               {(columnKey) => (
//                 <Cell>{item[columnKey as keyof typeof item]}</Cell>
//               )}
//             </Row>
//           )}
//         </TableBody>
//       </Table>
//     );
//   },
// };
