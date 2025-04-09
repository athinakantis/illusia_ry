import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, IconButton } from '@mui/material';
import { renderCellExpand } from './RenderCellExpand';

import { ReactElement } from 'react';

interface BasicFunction {
    functionBody: (id: string) => void;
    functionIcon?: ReactElement;
    functionName: string;
}

interface DataGridGeneric {
    data: Object[],
    functions: BasicFunction[];
    idColumn: string,
}


export const DataGridGeneric: React.FC<DataGridGeneric> = ({ data, idColumn, functions }) => {

    const columns: GridColDef[] = [];
    if (data[0]) {
        console.log(data);


        Object.keys(data[0]).forEach(column => columns.push({
            field: column,// ID of the item
            headerClassName: 'super-app-theme--header',// Class to edit the Header CSS
            headerAlign: 'left',
            headerName: column,
            width: 200, // Adjust width as needed
            renderCell: renderCellExpand,// Function to render the cell content with word wrapping
        }));

        columns.push(
            {
                field: 'actions',
                headerClassName: 'super-app-theme--header',
                headerName: 'Actions',
                width: 200,
                sortable: false,
                filterable: false,
                renderCell: (params) => (
                    <>
                        {functions.map((functionItem) => (

                            < IconButton
                                key={functionItem.functionName}
                                onClick={() => functionItem.functionBody(params.row.item_id)}
                                aria-label="view"
                                color="primary"
                                size="medium"
                            >

                                {functionItem.functionIcon ? (functionItem.functionIcon) : (functionItem.functionName)
                                }
                            </IconButton>

                        ))}

                    </>
                )
            }
        );
    }

    return (
        <Box sx={{ height: '700px', width: '100%', mt: 2 }}>
            <DataGrid
                rows={data}
                loading={data.length === 0}
                getRowId={(row) => row[idColumn]}
                columns={columns}
                pageSizeOptions={[10, 25, 50, 100]}
                // getRowHeight={()=> "auto"}
                rowHeight={110}
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
        </Box>
    );
};
