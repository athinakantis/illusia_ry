import React from 'react';
import { Box, Tooltip } from '@mui/material';
import { useUserName } from '../../../hooks/useUserName';
import { useCategoryLabel } from '../../../hooks/useCategoryLabel';
import { useUserNameForBooking } from '../../../hooks/useUserBookings';
import { useItemLabel } from '../../../hooks/useItemLabel';

/**
 * Renders a user’s display name.
 */
export const UserLabelCell: React.FC<{ value: string | null }> = ({ value }) => {
  const name = useUserName(value ?? undefined);
  return <Box sx={{ fontSize: 12 }}>{name}</Box>;
};

/**
 * Renders a category’s label.
 */
export const CategoryLabelCell: React.FC<{ value: string | null }> = ({ value }) => {
  const label = useCategoryLabel(value ?? undefined);
  return <Box sx={{ fontSize: 12 }}>{label}</Box>;
};

/**
 * Renders a human-readable label for a booking target, with tooltip of the raw ID.
 */
export const BookingLabelCell: React.FC<{ value: string }> = ({ value }) => {
  const { name } = useUserNameForBooking(value);
  return (
    <Tooltip title={value}>
      <Box sx={{ fontSize: 12 }}>{name}</Box>
    </Tooltip>
  );
};

/**
 * Renders a label for a reservation target showing the reserved item name.
 */
export const ReservationLabelCell: React.FC<{ value: string; metadata: any }> = ({ value, metadata }) => {
  const itemName = useItemLabel(metadata.item_id);
  return (
    <Tooltip title={value}>
      <Box sx={{ fontSize: 12, display: 'flex', alignItems: 'center' }}>
        {itemName}
        <Box component="span" sx={{ ml: 0.5 }}>reservation</Box>
      </Box>
    </Tooltip>
  );
};