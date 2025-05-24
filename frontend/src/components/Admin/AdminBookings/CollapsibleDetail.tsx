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
import { useTranslation } from 'react-i18next';

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
}) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ m: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        {t('collapsibleDetail.title', { defaultValue: 'Reservation items' })}
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>{t('collapsibleDetail.item', { defaultValue: 'Item' })}</TableCell>
            <TableCell>{t('collapsibleDetail.start', { defaultValue: 'Start Date' })}</TableCell>
            <TableCell>{t('collapsibleDetail.end', { defaultValue: 'End Date' })}</TableCell>
            <TableCell align="right">
              {t('collapsibleDetail.qty', { defaultValue: 'Quantity' })}
            </TableCell>
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
};

export default CollapsibleDetail;
