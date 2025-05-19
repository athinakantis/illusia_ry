import React from "react";
import { Link as RouterLink } from 'react-router-dom';
import dayjs from "dayjs";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Avatar,
} from "@mui/material";
import { Reservation } from "../../../types/types";

interface Props {
  reservations: Reservation[];
  itemName: (id: string) => string;
  itemImage: (id: string) => string | undefined;
  itemLink: (id: string) => string;
}

const CollapsibleDetail: React.FC<Props> = ({
  reservations,
  itemName,
  itemImage,
  itemLink,
}) => (
  <Box sx={{ m: 2 }}>
    <Typography variant="subtitle1" gutterBottom>
      Reservation items
    </Typography>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell />
          <TableCell>Item</TableCell>
          <TableCell>Start Date</TableCell>
          <TableCell>End Date</TableCell>
          <TableCell align="right">Quantity</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {reservations.map((r) => (
          <TableRow key={r.id}>
            <TableCell sx={{ width: 56 }}>
              <Avatar
                src={itemImage(r.item_id)}
                alt={itemName(r.item_id)}
                variant="square"
                sx={{ width: 48, height: 48 }}
              />
            </TableCell>
            <TableCell>
              <Typography
                component={RouterLink}
                to={itemLink(r.item_id)}
                sx={{
                  textDecoration: 'none',
                  color: 'primary.main',
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                {itemName(r.item_id)}
              </Typography>
            </TableCell>
            <TableCell>{dayjs(r.start_date).format("DD/MM/YYYY")}</TableCell>
            <TableCell>{dayjs(r.end_date).format("DD/MM/YYYY")}</TableCell>
            <TableCell align="right">{r.quantity}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Box>
);

export default CollapsibleDetail;
