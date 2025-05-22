import React from 'react';
import { Box, Tooltip } from '@mui/material';
import { useUserName } from '../../../hooks/useUserName';
import { useCategoryLabel } from '../../../hooks/useCategoryLabel';
import { useUserNameForBooking } from '../../../hooks/useUserBookings';
import { useItemLabel } from '../../../hooks/useItemLabel';
import { Database } from '../../../types/supabase';

// Import your Supabase-generated types
// Alias the row type for item_reservations
type ReservationMetadata = Database['public']['Tables']['item_reservations']['Row'];

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
 * @description Renders a label for a booking target showing the reserved item name.
 * 
 * ![label](https://http.cat/302)
 * 
 * My little hidden art, right in the docs.
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
export const ReservationLabelCell: React.FC<{ value: string; metadata: ReservationMetadata }> = ({ value, metadata }) => {
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