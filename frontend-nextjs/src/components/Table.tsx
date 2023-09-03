import {
  Box,
  Paper,
  Table,
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
  // Checkbox,
  TablePagination,
  Toolbar,
  // Typography,
  // Tooltip,
  IconButton,
  alpha,
  TableHead,
  TableSortLabel,
  TextField,
} from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import {
  Order,
  RowPerPage,
  // getComparator,
  rowPerPageOptions,
  // stableSort,
} from "./tableUtils";
import { visuallyHidden } from "@mui/utils";

export interface musicData {
  name: string;
  original_url: string;
  instruments_url: string;
  vocals_url: string;
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof musicData;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  {
    id: "original_url",
    numeric: false,
    disablePadding: false,
    label: "Original",
  },
  {
    id: "instruments_url",
    numeric: false,
    disablePadding: false,
    label: "Instruments",
  },
  {
    id: "vocals_url",
    numeric: false,
    disablePadding: false,
    label: "Vocals",
  },
];

interface EnhancedTableToolbarProps {
  numSelected: number;
  search: string;
  setSearch: (value: string) => void;
  setOpenAddModal: (value: boolean) => void;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, search, setSearch, setOpenAddModal } = props;

  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
        paddingTop: "12px",
      }}
    >
      {/* {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <></>
      )} */}
      {/* {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )} */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Paper>
          <TextField
            variant="outlined"
            label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Paper>
        <IconButton aria-label="add" size="large" onClick={handleOpenAddModal}>
          <AddIcon fontSize="inherit" />
        </IconButton>
      </div>
    </Toolbar>
  );
}

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof musicData
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    // onSelectAllClick,
    order,
    orderBy,
    // numSelected,
    // rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof musicData) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          {/* <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          /> */}
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface TableProps {
  rows: musicData[];
  order: Order;
  setOrder: (value: Order) => void;
  orderBy: string;
  setOrderBy: (value: keyof musicData) => void;
  selected: readonly string[];
  setSelected: (value: readonly string[]) => void;
  page: number;
  setPage: (value: number) => void;
  rowsPerPage: RowPerPage;
  setRowsPerPage: (value: RowPerPage) => void;
  search: string;
  setSearch: (value: string) => void;
  setOpenAddModal: (value: boolean) => void;
}

const CustomTable = (props: TableProps) => {
  const {
    rows,
    order,
    setOrder,
    orderBy,
    setOrderBy,
    selected,
    setSelected,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    search,
    setSearch,
    setOpenAddModal,
  } = props;

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof musicData
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  //   const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
  //     const selectedIndex = selected.indexOf(name);
  //     let newSelected: readonly string[] = [];

  //     if (selectedIndex === -1) {
  //       newSelected = newSelected.concat(selected, name);
  //     } else if (selectedIndex === 0) {
  //       newSelected = newSelected.concat(selected.slice(1));
  //     } else if (selectedIndex === selected.length - 1) {
  //       newSelected = newSelected.concat(selected.slice(0, -1));
  //     } else if (selectedIndex > 0) {
  //       newSelected = newSelected.concat(
  //         selected.slice(0, selectedIndex),
  //         selected.slice(selectedIndex + 1)
  //       );
  //     }

  //     setSelected(newSelected);
  //   };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10) as 20 | 50 | 100);
    setPage(0);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const Audio = ({ url, id }: { url: string; id: string }) => {
    return (
      <audio id={id} controls className="w-full">
        <source src={url} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          search={search}
          setSearch={setSearch}
          setOpenAddModal={setOpenAddModal}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {rows.map((row, index) => {
                const isItemSelected = isSelected(row.name);
                const labelId = `enhanced-table-checkbox-${index}`;

                const handlePlayOnClick = () => {
                  const instrumentsAudio = document.getElementById(
                    `instruments-${index}`
                  ) as HTMLAudioElement;
                  
                  const vocalsAudio = document.getElementById(
                    `vocals-${index}`
                  ) as HTMLAudioElement;

                  if (instrumentsAudio && vocalsAudio) {
                    if (instrumentsAudio.paused && vocalsAudio.paused) {
                      instrumentsAudio.play();
                      vocalsAudio.play();
                    } else {
                      instrumentsAudio.pause();
                      vocalsAudio.pause();
                    }
                  }
                };

                return (
                  <TableRow
                    hover
                    // onClick={(event) => handleClick(event, row.name)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.name}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                    id={`music-${index}`}
                  >
                    <TableCell padding="checkbox">
                      {/* <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      /> */}
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.name}
                      <IconButton onClick={handlePlayOnClick}>
                        <PlayCircleIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell align="left">
                      <Audio url={row.original_url} id={`original-${index}`} />
                    </TableCell>
                    <TableCell align="left">
                      <Audio
                        url={row.instruments_url}
                        id={`instruments-${index}`}
                      />
                    </TableCell>
                    <TableCell align="left">
                      <Audio url={row.vocals_url} id={`vocals-${index}`} />
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={rowPerPageOptions}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default CustomTable;
