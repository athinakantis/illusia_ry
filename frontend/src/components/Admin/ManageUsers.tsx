import React, { useEffect, useState } from 'react';
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchAllUsersWithRole,
  selectAllUsers,
  selectUserLoading,
  updateUserRole,
  updateUserStatus,
} from '../../slices/usersSlice';
import { showCustomSnackbar } from '../CustomSnackbar';
import { useAuth } from '../../hooks/useAuth';


const STATUS_OPTIONS = ['pending', 'approved', 'rejected', 'deactivated', 'active'] as const;
const STATUS_LABELS: Record<typeof STATUS_OPTIONS[number], string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  deactivated: 'Deactivated',
  active: 'Active',
};

const ManageUsers: React.FC = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectAllUsers);
  const loading = useAppSelector(selectUserLoading);
  const { role } = useAuth();

  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'ACTIVE' | 'DEACTIVATED'>('ALL');

  // Fetch all users with role on component mount
  useEffect(() => {
    dispatch(fetchAllUsersWithRole());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
// ---------------------  Handlers  --------------------------------------------------------------

  const handleTabChange = (_: React.SyntheticEvent, value: 'ALL' | 'PENDING' | 'ACTIVE' | 'DEACTIVATED') => {
    setFilter(value);
  };

  // Handle role change
  const handleRoleChange = async (userId: string, role:'User' | 'Admin' | 'Head Admin') => {
    let changedUser = users.find((u) => u.user_id === userId);
    try {
      await dispatch(updateUserRole({ userId, role })).unwrap();
      // Find the user by ID to get their display name
      changedUser = users.find((u) => u.user_id === userId);
      const name = changedUser?.display_name ?? 'User';
      showCustomSnackbar(`${name}'s role changed to ${role}`, 'success');
      // Refresh the grid data without reloading the page
    } catch (err: unknown) {
      // Handle error
      if (err instanceof Error) {
        console.error('Error updating user role:', err.message);
        showCustomSnackbar(`${changedUser?.display_name ?? 'User'}: ${err.message}`, 'error');
      } else {
        console.error('Error updating user role:', err);
        showCustomSnackbar(`Failed to update user role: ${err}`, 'error');
      }
    }
  };
  // --------------------------------------------------------------------------------------------------------------
  // Handle status change
  const handleStatusChange = async (userId: string, status: 'approved' | 'rejected' | 'deactivated' | 'active') => {
    let changedUser = users.find((u) => u.user_id === userId);
    try {
      await dispatch(updateUserStatus({ userId, status })).unwrap();
      // Find the user by ID to get their display name
      changedUser = users.find((u) => u.user_id === userId);
      const name = changedUser?.display_name ?? `User: ${userId}`;
      showCustomSnackbar(`${name}'s status changed to ${STATUS_LABELS[status]}`, 'success');
      // Refresh the grid data without reloading the page
    } catch (err: unknown) {
      // Handle error
      if (err instanceof Error) {
        console.error('Error updating user status:', err.message);
        showCustomSnackbar(`${changedUser?.display_name ?? `User ${userId}}`}: ${err.message}`, 'error');
      } else {
        console.error('Error updating user status:', err);
        showCustomSnackbar(`Failed to update user status: ${err}`, 'error');
      }
    }
  };
  // Filter rows based on status tab
  // Here we can change what each tab shows
  const filtered = users.filter((u) => {
    if (filter === 'ALL') return true;
    // Lists pending users
    if (filter === 'PENDING') return u.user_status === 'pending';
    // Lists all active users(we need to figure out our database structure)
    if (filter === 'ACTIVE') return u.user_status === 'active'|| u.user_status === 'approved'; 
    if (filter === 'DEACTIVATED') return u.user_status === 'deactivated';
    return true;
  });

  // Define columns for DataGrid
  const columns: GridColDef[] = [
    { field: 'display_name', headerName: 'Name', flex: 1, minWidth: 150 },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 200 },

    {
      field: 'role_title',
      headerName: 'User role',
      flex: 1,
      minWidth: 180,
      renderCell: (params: GridRenderCellParams) => {

        const currentRole = (params.row.role_title ?? 'Unapproved') as
          | 'Unapproved'
          | 'User'
          | 'Admin'
          | 'Head Admin';

        // Head Admin: full control
        if (role === 'Head Admin') {
          return (
            <Select
              value={currentRole}
              size="small"
              type="button"
              fullWidth
              onChange={(e) => {
                handleRoleChange(params.row.user_id, e.target.value as 'User' | 'Admin' | 'Head Admin')
              }}
              renderValue={val => val}
            >
              {/* Show “Unapproved” disabled option */}
              {currentRole === 'Unapproved' && (
                <MenuItem value="Unapproved" disabled>
                  Unapproved
                </MenuItem>
              )}
              {['User', 'Admin', 'Head Admin'].map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          );
        }

        // Admin: show a Select that always displays currentRole,
        // and only allows promoting Unapproved → User
        if (role === 'Admin') {
          // Build options: always include currentRole (disabled),
          // and if Unapproved, include 'User' as actionable.
          const options = currentRole === 'Unapproved'
            ? ['Unapproved', 'User']
            : [currentRole];
          return (
            <Select
              type="button"
              value={currentRole}
              size="small"
              sx={{ width: 150 }}
              disabled={currentRole !== 'Unapproved'}
              onChange={(e) => {
                handleRoleChange(params.row.user_id, e.target.value as 'User' | 'Admin' | 'Head Admin');
              }}
            >
              {options.map((opt) => (
                <MenuItem key={opt} value={opt} disabled={opt === currentRole}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          );
        }
      },
    },

    {
      field: 'user_status',
      headerName: 'Status',
      flex: 1,
      minWidth: 160,
      renderCell: (params: GridRenderCellParams) => {
        const status = params.row.user_status as typeof STATUS_OPTIONS[number];
        // Only Admins and Head Admins can change status
        if (role === 'Admin' || role === 'Head Admin') {
          return (
            <Select
              type="button"
              value={status}
              size="small"
              sx={{ width: 150 }}
              onChange={(e) => {
                handleStatusChange(params.row.user_id, e.target.value as 'approved' | 'rejected' | 'deactivated' | 'active');
              }}
            >
              {STATUS_OPTIONS.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {STATUS_LABELS[opt]}
                </MenuItem>
              ))}
            </Select>
          );
        }
        // other roles see text only
        return <Typography>{STATUS_LABELS[status]}</Typography>;
      },
    },
  ];

  return (
    <Box className="container" sx={{ mt: 4, maxWidth: 1200, mx: 'auto' }}>
      <Typography component='h1' variant='heading_secondary_bold' mb={4} gutterBottom>
      <Typography variant="h4" gutterBottom>
        Manage Users
      </Typography>

      {/* Filter tabs */}
      <Tabs value={filter} onChange={handleTabChange} textColor="primary" indicatorColor="primary" sx={{ mb: 2 }}>
        <Tab value="ALL" label="All" />
        <Tab value="PENDING" label="Pending Approvals" />
        <Tab value="ACTIVE" label="Active" />
        <Tab value="DEACTIVATED" label="Deactivated" />
      </Tabs>

      {/* Data grid */}
      <Box sx={{ height: 500, width: '100%', mt: 2 }}>
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={filtered}
            getRowId={(row) => row.user_id}
            columns={columns}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
            }}
            pageSizeOptions={[5, 10, 20]}
          />
        )}
      </Box>
    </Box>
  );
};

export default ManageUsers;