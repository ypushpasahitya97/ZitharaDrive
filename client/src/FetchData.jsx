import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostAddIcon from '@mui/icons-material/AddBox';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import { useTable, useFilters, useGlobalFilter, usePagination, useSortBy } from 'react-table';
import { saveAs } from 'file-saver'; 
import { SearchIcon } from './components/SearchIcon';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const FetchData = () => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newRowData, setNewRowData] = useState({
        CUSTOMER_NAME: '',
        AGE: '',
        PHONE: '',
        LOCATION: '',
    });
    const [isFormCollapsed, setIsFormCollapsed] = useState(true);
    const [originalData, setOriginalData] = useState([]);
    const [darkMode, setDarkMode] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/customer');
                const formattedData = response.data.map(item => ({
                    ...item,
                    CREATED_AT: format(new Date(item.CREATED_AT), 'yyyy-MM-dd HH:mm:ss'),
                }));
                setData(formattedData);
                setOriginalData(formattedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const columns = React.useMemo(
        () => [
            {
                Header: 'SNO',
                accessor: (row, index) => index + 1,
            },
            {
                Header: 'CUSTOMER NAME',
                accessor: 'CUSTOMER_NAME',
            },
            {
                Header: 'AGE',
                accessor: 'AGE',
            },
            {
                Header: 'PHONE',
                accessor: 'PHONE',
            },
            {
                Header: 'LOCATION',
                accessor: 'LOCATION',
            },
            {
                Header: 'CREATED_AT',
                accessor: 'CREATED_AT',
            },
            {
                Header: 'DELETE',
                Cell: ({ row }) => (
                    <button onClick={() => handleDelete(row.index)} style={{padding: '0', background: 'none', border: 'none'}}>
        <DeleteIcon style={deleteIconStyle} />
    </button>
                ),
            },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        gotoPage,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageCount,
        state: { pageIndex, pageSize },
        setPageSize,
        preGlobalFilteredRows,
        setGlobalFilter,
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 20 },
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    useEffect(() => {
        setGlobalFilter(searchTerm);
    }, [searchTerm, setGlobalFilter]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRowData({
            ...newRowData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setData([...data, newRowData]);
        setNewRowData({
            CUSTOMER_NAME: '',
            AGE: '',
            PHONE: '',
            LOCATION: '',
            CREATED_AT: '',
        });
    };

    const handleDelete = (rowIndex) => {
        setData(prevData => prevData.filter((_, index) => index !== rowIndex));
    };

    const toggleForm = () => {
        setIsFormCollapsed(!isFormCollapsed);
        if (!isFormCollapsed) {
            // Reset data to original data when collapsing the form
            setData(originalData);
            setSearchTerm(''); // Clear search term
        }
    };

    const resetForm = () => {
        setNewRowData({
            CUSTOMER_NAME: '',
            AGE: '',
            PHONE: '',
            LOCATION: '',
        });
    };

    const downloadCSV = () => {
        // Convert data to CSV format
        const csvData = data.map(row => Object.values(row).join(',')).join('\n');
        // Create a Blob with the CSV data
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
        // Save the Blob as a file
        saveAs(blob, 'customer_data.csv');
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const deleteIconStyle = {
        fontSize: 16, // Adjust the font size as needed
    };
    

    return (
        <div className={`w-full px-24 mx-auto mt-0 py-0 text-white fill-gray-400 ${darkMode ? 'dark' : 'light'}`}>
            {/* Search */}
            <div className="flex items-center justify-between mb-4">

                <div className="sw-full flex items-center gap-1 text-sm">
                    <SearchIcon />
                    <input
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="p-2 bg-transparent outline-none border-b-2 w-4/8 focus:w-3/4 duration-300 border-indigo-500 my-4"
                        placeholder="Search ..."
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={toggleForm} className="flex items-center text-white underline cursor-pointer gap-1 mr-2">
                        <span>Add
                        <PostAddIcon fontSize="small" /></span>
                    </button>
                    <button onClick={downloadCSV} className="flex items-center text-white underline cursor-pointer gap-1">
                       |  <CloudDownloadIcon className='ml-2 mr-2'/> 
                    </button>
                    <button onClick={toggleDarkMode} className="flex items-center text-white underline cursor-pointer gap-1">
                       |  {darkMode ? <Brightness7Icon className='ml-2 mr-2'/> : <Brightness4Icon className='ml-2 mr-2'/>}
                    </button>
                </div>
            </div>
            {!isFormCollapsed && (
                <form onSubmit={handleSubmit} className="flex items-center justify-between mb-4 my-4 text-sm">
                    <div>
                        <input
                            type="text"
                            name="CUSTOMER_NAME"
                            value={newRowData.CUSTOMER_NAME}
                            onChange={handleInputChange}
                            placeholder="Customer Name"
                            className=" p-2 mb-2 mr-2 bg-transparent outline-none border-b-2 border-indigo-500"
                        />
                        <input
                            type="text"
                            name="AGE"
                            value={newRowData.AGE}
                            onChange={handleInputChange}
                            placeholder="Age"
                            className="p-2 mb-2 mr-2 bg-transparent outline-none border-b-2 border-indigo-500"
                        />
                        <input
                            type="text"
                            name="PHONE"
                            value={newRowData.PHONE}
                            onChange={handleInputChange}
                            placeholder="Phone"
                            className="p-2 mb-2 mr-2 bg-transparent outline-none border-b-2 border-indigo-500"
                        />
                        <input
                            type="text"
                            name="LOCATION"
                            value={newRowData.LOCATION}
                            onChange={handleInputChange}
                            placeholder="Location"
                            className="p-2 mb-2 mr-2 bg-transparent outline-none border-b-2 border-indigo-500"
                        />
                    </div>
                    <div>
                        <button type="button" onClick={resetForm} className="p-1 border border-gray-300 px-2 mr-1 rounded">Reset Form</button>
                        <button type="submit" className="p-1 border border-gray-300 px-2 rounded">Add</button>
                    </div>
                </form>
            )}
            {/* Table */}
            <table {...getTableProps()} className='bg-gray-200 w-full  text-xs font-sans rounded overflow-hidden'>
                <thead className='bg-indigo-600'>
                    <tr>
                        <th colSpan={7} className='py-2 px-5 text-xl text-white font-bold bg-gray-600'>
                            Customer List
                        </th>
                    </tr>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()} className='py-2 px-5 border-b border-black bg-gray-700 text-center'>
                                    {column.render('Header')}
                                    {column.id === 'CREATED_AT' && (
                                        <span {...column.getSortByToggleProps()} style={{ cursor: 'pointer', marginLeft: '4px' }}>
                                            {column.isSorted ? (
                                                column.isSortedDesc ? <SwapVertIcon /> : <SwapVertIcon />
                                            ) : (
                                                <SwapVertIcon />
                                            )}
                                        </span>
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody {...getTableBodyProps()}>
                    {page.map((row, index) => {
                        prepareRow(row);
                        return (
                            <tr key={index} {...row.getRowProps()} className={`${index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}`}>
                                {row.cells.map(cell => {
                                    return <td {...cell.getCellProps()} className="px-3.5 py-2 text-center font-custom border-b border-black">{cell.render('Cell')}</td>
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            {/* Pagination */}
            <div className=' text-xs mt-6 flex items-center justify-center gap-4 pb-4'>
                <button className="p-1 border border-gray-300 px-2" onClick={() => gotoPage(0)} disabled={pageIndex === 0}>{"<<"}</button>
                <button className="p-1 border border-gray-300 px-2" onClick={() => previousPage()} disabled={!canPreviousPage}>{"<"}</button>
                <span>
                    Page {' '}
                    <strong>
                        {pageIndex + 1} of {pageCount}
                    </strong>{' '}
                </span>
                <input
                    type="number"
                    className="lst p-1 bg-black border border-gray-300 px-2 w-16 text-center"
                    value={pageIndex + 1}
                    onChange={(e) => {
                        const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
                        gotoPage(pageNumber);
                    }}
                />
                <select
                    className="p-1 border border-gray-300 px-2 disabled:opacity-30 show-size"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                >
                    {[20, 40, 60].map((size) => (
                        <option
                            key={size}
                            value={size}
                            style={{ backgroundColor: size === pageSize ? 'lightblue' : 'black' }}
                        >
                            Show {size}
                        </option>
                    ))}
                </select>
                <button className="p-1 border border-gray-300 px-2" onClick={() => nextPage()} disabled={!canNextPage}>{">"}</button>
                <button className="p-1 border border-gray-300 px-2" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>{">>"}</button>
            </div>
        </div>
    );
}

export default FetchData;
