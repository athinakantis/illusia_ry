import React, { useEffect, useState } from 'react';
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Container,
  useTheme,
  Stack,
  Button,
  Tooltip,
} from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchAllUsersWithRole,
  selectAllUsers,
  selectUserLoading,
  updateUserRole,
} from '../../slices/usersSlice';
import { useAuth } from '../../hooks/useAuth';
import { StyledDataGrid } from '../CustomComponents/StyledDataGrid';
import { useSearchParams } from 'react-router-dom';
import { useTranslatedSnackbar } from '../CustomComponents/TranslatedSnackbar/TranslatedSnackbar';
import { useTranslation } from 'react-i18next';
import { toCamelCase } from '../../utility/formatCamelCase';
import Spinner from '../Spinner';

const VALID_FILTERS = ['ALL', 'PENDING', 'ACTIVE', 'BANNED'];
type VALID_FILTER = (typeof VALID_FILTERS)[number];

const ManageUsers: React.FC = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectAllUsers);
  const loading = useAppSelector(selectUserLoading);
  const { role } = useAuth();
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState<VALID_FILTER>('ALL');
  const { t } = useTranslation();
  const { showSnackbar } = useTranslatedSnackbar();

  const isAdmin = (role === 'Admin' || role === 'Head Admin')
  const isHeadAdmin = role === 'Head Admin'

  // Fetch all users with role on component mount
  useEffect(() => {
    dispatch(fetchAllUsersWithRole());
    const param = searchParams.get('filter');
    if (param && VALID_FILTERS.includes(param.toUpperCase()))
      setFilter(param.toUpperCase());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // ---------------------  Handlers  --------------------------------------------------------------

  const handleTabChange = (
    _: React.SyntheticEvent,
    value: 'ALL' | 'PENDING' | 'ACTIVE' | 'BANNED',
  ) => {
    setFilter(value);
  };

  // Handle role change
  const handleRoleChange = async (
    userId: string,
    role: 'User' | 'Admin' | 'Banned',
  ) => {
    let changedUser = users.find((u) => u.user_id === userId);
    try {
      await dispatch(updateUserRole({ userId, role })).unwrap();
      // Find the user by ID to get their display name
      changedUser = users.find((u) => u.user_id === userId);
      const name = changedUser?.display_name ?? 'User';
      showSnackbar({
        message: t('manageUsers', {
          name: name,
          role: t(`admin.dashboard.roles.${role}`),
        }),
        variant: 'info',
      });
      // Refresh the grid data without reloading the page
    } catch (err: unknown) {
      // Handle error
      if (err instanceof Error) {
        console.error('Error updating user role:', err.message);
        showSnackbar({
          message: t('manageUsers.roleUpdateFailed', {
            error: err.message,
            target: changedUser?.display_name ?? 'User',
            defaultValue: `${changedUser?.display_name ?? 'User'}: ${err.message
              }`,
          }),
          variant: 'error',
        });
      } else {
        console.error('Error updating user role:', err);
        showSnackbar({
          message: t('manageUsers.snackbar.roleUpdateFailed', {
            defaultValue: `Failed to update user role: ${err}`,
          }),
          variant: 'error',
        });
      }
    }
  };
  // --------------------------------------------------------------------------------------------------------------

  // Filter rows based on status tab
  // Here we can change what each tab shows
  const filtered = users.filter((u) => {
    if (filter === 'ALL') return true;
    // Lists pending users
    if (filter === 'PENDING') return u.role_title === 'Unapproved';
    // Lists all active users(we need to figure out our database structure)
    if (filter === 'ACTIVE')
      return u.role_title !== 'Unapproved' && u.role_title !== 'Banned';
    if (filter === 'BANNED') return u.role_title === 'Banned';
    return true;
  });

  // Define columns for DataGrid
  const columns: GridColDef[] = [
    {
      field: 'display_name',
      headerName: t('manageUsers.columnHeaders.name', { defaultValue: 'Name' }),
      flex: 1,
      minWidth: 150,
      headerClassName: 'columnHeader',
      renderCell: (params: GridRenderCellParams) => {
        return <Typography variant="body2">{params.value}</Typography>;
      },
    },
    {
      field: 'email',
      headerName: t('manageUsers.columnHeaders.email', { defaultValue: 'Email' }),
      flex: 1,
      minWidth: 200,
      headerClassName: 'columnHeader',
    },
    {
      field: 'role_title',
      headerName: t('manageUsers.columnHeaders.roleTitle', { defaultValue: 'User Role' }),
      headerClassName: 'columnHeader',
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Typography variant="body2">
            {t(`manageUsers.roles.${toCamelCase(params.value)}`, {
              defaultValue: params.value,
            })}
          </Typography>
        );
      },
    },
    {
      field: 'action',
      headerName: t('manageUsers.columnHeaders.action', { defaultValue: 'Action' }),
      headerClassName: 'columnHeader',
      headerAlign: 'center',
      flex: 1,
      minWidth: 180,
      align: 'right',
      renderCell: (params: GridRenderCellParams) => {
        if (filter === 'BANNED') {
          return (
            <Button variant='text_contained' color='info'
              onClick={() => handleRoleChange(params.row.user_id, 'User')}>
              {t('manageUsers.actions.unban', { defaultValue: 'Unban' })}
            </Button>
          )
        }
        if (
          filter === 'PENDING' &&
          isAdmin
        ) {
          return (
            <Stack direction="row" gap="10px">
              <Button variant="text_contained" color="info"
                onClick={() => handleRoleChange(params.row.user_id, 'User')}>
                {t('manageUsers.actions.approve', { defaultValue: 'Approve' })}

              </Button>
              <Button variant="text_contained" color="error"
                onClick={() => handleRoleChange(params.row.user_id, 'Banned')}>
                {t('manageUsers.actions.reject', { defaultValue: 'Reject' })}
              </Button>
            </Stack>
          );
        }
        if (filter === 'ALL' || filter === 'ACTIVE') {
          return (
            <Stack
              direction="row"
              gap="10px"
              sx={{ justifyContent: 'end', width: '100%' }}
            >
              {params.row.role_title === 'User' && (
                <>
                  <Tooltip title={t('manageUsers.tooltips.makeAdmin', { defaultValue: 'Make user an administrator' })} placement='top'>
                    <Button variant="text_contained" color="info"
                      onClick={() => handleRoleChange(params.row.user_id, 'Admin')}
                    >
                      {t('manageUsers.actions.promote', { defaultValue: 'Promote' })}
                    </Button>
                  </Tooltip>
                  <Button variant="text_contained" color="error"
                    onClick={() => handleRoleChange(params.row.user_id, 'Banned')}>
                    {t('manageUsers.actions.ban', { defaultValue: 'Ban' })}
                  </Button>
                </>
              )}
              {isHeadAdmin && params.row.role_title === 'Admin' && (
                <Tooltip title={t('manageUsers.tooltips.makeUser', { defaultValue: 'Demote Admin to User' })} placement='top'>
                  <Button variant="text_contained" color="info"
                    onClick={() => handleRoleChange(params.row.user_id, 'User')}>
                    {t('manageUsers.actions.demote', { defaultValue: 'Demote' })}
                  </Button>
                </Tooltip>
              )}
              {isAdmin && params.row.role_title === 'Unapproved' && (
                <>
                  <Button variant="text_contained" color="info"
                    onClick={() => handleRoleChange(params.row.user_id, 'User')}>
                    {t('manageUsers.actions.approve', { defaultValue: 'Approve' })}
                  </Button>
                  <Button variant="text_contained" color="error"
                    onClick={() => handleRoleChange(params.row.user_id, 'Banned')}>
                    {t('manageUsers.actions.reject', { defaultValue: 'Reject' })}
                  </Button>
                </>
              )}
            </Stack>
          );
        }
      },
    },
  ];

  return (
    <Container className="container" sx={{ mt: 6, mx: 'auto' }} maxWidth="lg">
      <Typography variant="heading_secondary_bold" gutterBottom>
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
        <Tab value="BANNED" label="Banned" />
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
            <Spinner />
          </Box>
        ) : (
          <StyledDataGrid
            rows={filtered}
            getRowId={(row) => row.user_id}
            columns={columns}
            sx={{
              '& .columnHeader, .MuiDataGrid-scrollbarFiller ': {
                bgcolor: theme.palette.background.verylightgrey,
              },
            }}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
            }}
            pageSizeOptions={[5, 10, 20]}
          />
        )}
      </Box>
    </Container>
  );
};

export default ManageUsers;
