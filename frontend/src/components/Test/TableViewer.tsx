import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import { DynamicTable } from "../DynamicTable";

interface TableViewerProps {
  endpoint: string; // e.g., "/protected-data" or "/users"
  title?: string;
}

export const TableViewer = ({ endpoint, title = "Table Viewer" }: TableViewerProps) => {
  const { session } = useAuth();
  console.log("Session in TableViewer:", session?.access_token);
  const [data, setData] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.access_token) {
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5001${endpoint}`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();
        setData(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, session]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>{title}</Typography>
      {data.length ? <DynamicTable data={data} /> : <div>No data found.</div>}
    </Box>
  );
};