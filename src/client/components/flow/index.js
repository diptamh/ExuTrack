import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import { Box } from "@mui/material";
import Block from "../shapes/block";
import Diamond from "../shapes/diamond";
import Table from "../table/index.js";
// used to select the object and get the object from the child object
import ObjectSelector from "../objectSelector/index.js";
// used to do all the axios calls to get the data from the salesforce
import APIService from "../../service/APIService.js";
import "reactflow/dist/style.css";

export default function App() {
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const [VRdata, setVRdata] = useState([null]);
  const [BTdata, setBTdata] = useState([null]);
  const [nodeTypes, setNodeTypes] = useState({
    block: Block,
    diamond: Diamond,
    table: Table,
  });

  useEffect(() => {
    setNodeTypes(() => {
      return {
        block: Block,
        diamond: Diamond,
        table: Table,
      };
    });

    setNodes([
      {
        id: "1",
        position: { x: 10, y: 200 },
        data: { label: "1. Loads the original Record", variant: "warn" },
        type: "block",
      },
      {
        id: "2",
        position: { x: 250, y: 200 },
        data: { label: "2. Loads the new record values", variant: "warn" },
        type: "block",
      },
      {
        id: "Q1",
        position: { x: 510, y: 165 },
        data: { label: "Did the request come from a standard UI edit page ?" },
        type: "diamond",
      },
      {
        id: "2B",
        position: { x: 510, y: 5 },
        data: {
          label: "2B. Salesforce validates only the foreign keys",
          variant: "info",
        },
        type: "block",
      },
      {
        id: "2A",
        position: { x: 900, y: 400 },
        data: {
          label: "2A. Runs system validation to check for:",
          variant: "info",
        },
        type: "block",
      },
      {
        id: "2C",
        position: { x: 900, y: 5 },
        data: { data: BTdata, label: "2C. Before Executing a trigger" },
        type: "table",
      },
      {
        id: "Q2",
        position: { x: 1200, y: 100 },
        data: { label: "Were multi-line items created ?" },
        type: "diamond",
      },
      {
        id: "2D",
        position: { x: 1600, y: 5 },
        data: { data: VRdata, label: "2D. Run custom validation rules" },
        type: "table",
      },
    ]);

    setEdges([
      {
        id: "e1-2",
        source: "1",
        target: "2",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#413978",
        },
        style: {
          strokeWidth: 2,
          stroke: "#413978",
        },
      },
      {
        id: "e2-Q1",
        source: "2",
        target: "Q1",
        type: "smoothstep",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#413978",
        },
        style: {
          strokeWidth: 2,
          stroke: "#413978",
        },
      },
      {
        id: "eQ1-2A",
        source: "Q1",
        target: "2B",
        sourceHandle: "top",
        targetHandle: "bottom", // Not working need to fix this
        label: "Yes",
        type: "smoothstep",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#12977e",
        },
        style: {
          strokeWidth: 2,
          stroke: "#12977e",
        },
      },
      {
        id: "eQ1-2B",
        source: "Q1",
        target: "2A",
        sourceHandle: "bottom",
        type: "smoothstep",
        label: "No",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#ca2936",
        },
        style: {
          strokeWidth: 2,
          stroke: "#ca2936",
        },
      },
      {
        id: "e2B-2C",
        source: "2B",
        target: "2C",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#413978",
        },
        style: {
          strokeWidth: 2,
          stroke: "#413978",
        },
      },
      {
        id: "e2C-Q2",
        source: "2C",
        target: "Q2",
        type: "smoothstep",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#413978",
        },
        style: {
          strokeWidth: 2,
          stroke: "#413978",
        },
      },
      {
        id: "eQ2-2D",
        source: "Q2",
        target: "2D",
        type: "smoothstep",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#413978",
        },
        style: {
          strokeWidth: 2,
          stroke: "#413978",
        },
      },
    ]);
  }, [VRdata]);

  // This is used to get the selected object from the child component and set it to the state
  const handleObjectSelection = async (selected) => {
    const validationRules = await APIService.getValidations(selected);

    const VRdata = validationRules.data.records.map((record) => {
      return record.ValidationName;
    });
    const BeforeTrigger = await APIService.getBeforeTrigger(selected);

    const BTdata = BeforeTrigger.data.records.map((record) => {
      return record.Name;
    });

    // Validation Set is the object name
    setVRdata(() => {
      return VRdata;
    });
    console.log("BTdata--->", VRdata);

    setBTdata(() => {
      return BTdata;
    });
    console.log("BTdata--->", BTdata);
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Box width={400}>
        {/* This is used to select the object and get the object from the child object */}
        <ObjectSelector OnObjectSelection={handleObjectSelection} />
      </Box>
      <ReactFlow
        nodesDraggable={false}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
