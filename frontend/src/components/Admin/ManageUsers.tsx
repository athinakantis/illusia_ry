import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Box, Typography, Select, MenuItem, CircularProgress } from '@mui/material';
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

/**
 * Valid role & status options reflected in `usersSlice` thunks
 */
const ROLE_OPTIONS = ['Admin', 'Head Admin', 'User'] as const; // “-” acts as a placeholder for “no role yet”
const STATUS_OPTIONS = [
  'approved',
  'rejected',
  'active',
  'deactivated',
] as const;
type RoleOption = typeof ROLE_OPTIONS[number];
type StatusOption = typeof STATUS_OPTIONS[number];

const ManageUsers: React.FC = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectAllUsers);
  const loading = useAppSelector(selectUserLoading);

  // Tab filter state
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'ACTIVE' | 'DEACTIVATED'>('ALL');

  /**
   * Pull the complete user list (with roles) once on mount
   */
  useEffect(() => {
    dispatch(fetchAllUsersWithRole());
  }, [dispatch]);

  const handleTabChange = (_: React.SyntheticEvent, value: 'ALL' | 'PENDING' | 'ACTIVE' | 'DEACTIVATED') => {
    setFilter(value);
  };

  /**
   * When an admin changes the user's role
   */
  const handleRoleChange = async (userId: string, role: RoleOption) => {
    try {
      await dispatch(updateUserRole({ userId, role })).unwrap();
      showCustomSnackbar('User role updated', 'success');
    } catch (err: unknown) {
      if(err instanceof Error) {
        console.error('Error updating user role:', err.message);
        showCustomSnackbar(err.message || 'Failed to update user role', 'error');
      }else{
        console.error('Error updating user role:', err);
        showCustomSnackbar(`Failed to update user role: ${err}`, 'error');

      }

    }
  };

  /**
   * When an admin changes the user's status
   */
  const handleStatusChange = async (userId: string, status: StatusOption) => {
    try {
      await dispatch(updateUserStatus({ userId, status })).unwrap();
      showCustomSnackbar('User status updated', 'success');
    } catch (err: unknown ){
      if(err instanceof Error) {
        console.error('Error updating user status:', err.message);
        showCustomSnackbar(err.message || 'Failed to update user status', 'error');
      }else{
        console.error('Error updating user status:', err);
        showCustomSnackbar(`Failed to update user status: ${err}`, 'error');
      }
    }
  };

  /**
   * Apply the current tab filter
   */
  const filteredUsers = users.filter((u) => {
    switch (filter) {
      case 'PENDING':
        return u.user_status === 'pending'
      case 'ACTIVE':
        return u.user_status === 'active';
      case 'DEACTIVATED':
        return u.user_status === 'deactivated';
      default:
        return true;
    }
  });

  const columns: GridColDef[] = [
    { field: 'display_name', headerName: 'Name', flex: 1, minWidth: 140 },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 220 },
    {
      field: 'role_title',
      headerName: 'User role',
      flex: 1,
      minWidth: 140,
      renderCell: (params: GridRenderCellParams) => {
        const currentRole = (params.row.role_title ?? 'Unapproved') as RoleOption | 'Unapproved';

        return (
          <Select
            value={currentRole}
            size="small"
            fullWidth
            onChange={(e) =>
              handleRoleChange(params.row.user_id, e.target.value as RoleOption)
            }
          >
            {/* Show “Unapproved” only when that’s the current value */}
            {currentRole === 'Unapproved' && (
              <MenuItem value="Unapproved" disabled>
                Unapproved
              </MenuItem>
            )}

            {ROLE_OPTIONS.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </Select>
        );
      },
    },
    {
      field: 'user_status',
      headerName: 'Status',
      flex: 1,
      minWidth: 140,
      renderCell: (params: GridRenderCellParams) => {
        const currentStatus = (params.row.user_status ?? 'pending') as StatusOption | 'pending';

        return (
          <Select
            value={currentStatus}
            size="small"
            fullWidth
            onChange={(e) =>
              handleStatusChange(params.row.user_id, e.target.value as StatusOption)
            }
          >
            {/* Show current status if it’s “pending” (disabled so it can’t be picked) */}
            {currentStatus === 'pending' && (
              <MenuItem value="pending" disabled>
                Pending
              </MenuItem>
            )}

            {STATUS_OPTIONS.map((status) => (
              <MenuItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </MenuItem>
            ))}
          </Select>
        );
      },
    },
  ];

  return (
    <Box className="container" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Users
      </Typography>

      {/* Filter tabs */}
      <Tabs
        value={filter}
        onChange={handleTabChange}
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 2 }}
      >
        <Tab value="ALL" label="All" />
        <Tab value="PENDING" label="Pending Approvals" />
        <Tab value="ACTIVE" label="Active" />
        <Tab value="DEACTIVATED" label="Deactivated" />
      </Tabs>

      {/* Data grid */}
      {loading ? (
        <CircularProgress />
      ) : (
        <DataGrid
          rows={filteredUsers}
          columns={columns}
          getRowId={(row) => row.user_id}
          autoHeight
          pageSizeOptions={[5, 10, 25,50, 100]}
          disableRowSelectionOnClick
          /* Couldnt get the Generic Datagrid to work with me so copied the CSS */
          sx={{
            // Header CSS
            '& .super-app-theme--header': {
                backgroundColor: 'secondary.light',
                color: 'text.light',
                fontSize: '1.1rem',
            },
            // Individual Cell CSS
            '& .MuiDataGrid-cell': {
                pl: 2,// padding left

            },
            // Footer CSS
            '& .MuiDataGrid-footerContainer': {
                backgroundColor: 'secondary.light',

            },
            // Hover CSS
            '& .MuiDataGrid-row:hover': {
                backgroundColor: 'background.lightgrey',
                transition: 'background-color 0.3s ease',
            },
            // Focus CSS
            '& .MuiDataGrid-cell:focus': {
                outline: 'none',
            },
            // Selected Row CSS
            '& .MuiDataGrid-row.Mui-selected': {
                outline: '2px solid #7b1fa2',
                outlineOffset: '-2px',
            },
            // Even Row CSS
            '& .MuiDataGrid-row:nth-of-type(even)': {
                backgroundColor: 'background.lightgrey',
            },
            // Odd Row CSS
            '& .MuiDataGrid-row:nth-of-type(odd)': {
                backgroundColor: 'background.default',
                border: '1px solid',
                borderColor: 'secondary.main',
            },
        }}
        />
      )}
    </Box>
  );
};

export default ManageUsers;