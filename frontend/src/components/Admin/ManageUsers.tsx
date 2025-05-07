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

const STATUS_OPTIONS = ['pending', 'approved', 'rejected', 'deactivated'] as const;
const STATUS_LABELS: Record<typeof STATUS_OPTIONS[number], string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  deactivated: 'Deactivated',
};

const ManageUsers: React.FC = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectAllUsers);
  const loading = useAppSelector(selectUserLoading);
  // const { role } = useAuth();
// const role = 'Admin'; // TODO: Replace with actual role from context
const role = 'Head Admin'; // TODO: Replace with actual role from context
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'ACTIVE' | 'DEACTIVATED'>('ALL');

  // Pull the complete user list (with roles) once on mount
  useEffect(() => {
    dispatch(fetchAllUsersWithRole());
  }, [dispatch]);

  const handleTabChange = (_: React.SyntheticEvent, value: 'ALL' | 'PENDING' | 'ACTIVE' | 'DEACTIVATED') => {
    setFilter(value);
  };

  // Filter rows based on status tab
  const filtered = users.filter((u) => {
    if (filter === 'ALL') return true;
    if (filter === 'PENDING') return u.user_status === 'Pending';
    if (filter === 'ACTIVE') return u.user_status === 'Approved';
    if (filter === 'DEACTIVATED') return u.user_status === 'Deactivated';
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
              fullWidth
              onChange={(e) =>
                dispatch(
                  updateUserRole({
                    userId: params.row.user_id,
                    role: e.target.value as any,
                  })
                )
                  .unwrap()
                  .then(() => showCustomSnackbar('Role updated', 'success'))
                  .catch((err) =>
                    showCustomSnackbar(err.message || 'Failed updating role', 'error')
                  )
              }
              renderValue={(val) => (val === '' ? 'Unapproved' : val)}
            >
              {/* Show “Unapproved” disabled option */}
              {currentRole === 'Unapproved' && (
                <MenuItem value="" disabled>
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
              value={currentRole}
              size="small"
              fullWidth
              onChange={(e) => {
                const next = e.target.value as string;
                if (next !== currentRole) {
                  dispatch(updateUserRole({ userId: params.row.user_id, role: next as any }))
                    .unwrap()
                    .then(() => showCustomSnackbar('Role updated', 'success'))
                    .catch((err) => showCustomSnackbar(err.message || 'Failed updating role', 'error'));
                }
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

        // Non-admins just see text
        return <Typography>{currentRole}</Typography>;
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
              value={status}
              size="small"
              fullWidth
              onChange={(e) =>
                dispatch(updateUserStatus({ userId: params.row.user_id, status: e.target.value as any }))
                  .unwrap()
                  .then(() => showCustomSnackbar('Status updated', 'success'))
                  .catch((err) =>
                    showCustomSnackbar(err.message || 'Failed updating status', 'error')
                  )
              }
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
    <Box className="container" sx={{ mt: 4 }}>
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