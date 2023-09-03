"use client";

import { useEffect, useState } from "react";
import CustomTable, { musicData } from "../components/Table";
import { Order, RowPerPage } from "../components/tableUtils";
import AddModal from "../components/Modal";

export default function Home() {
  const [rows, setRows] = useState<musicData[]>([]);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof musicData>("name");
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState<RowPerPage>(20);
  const [search, setSearch] = useState("");
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);

  const fetchMusicData = async (
    offset: number,
    limit: number,
    search: string
  ) => {
    const res = await fetch(
      `http://5525.fr:19001/?offset=${offset}&limit=${limit}` +
        (search ? `&search=${search}` : "")
    );
    const data = (await res.json()) as musicData[];
    setRows(data);
  };

  useEffect(() => {
    fetchMusicData(page * rowsPerPage, rowsPerPage, search);
  }, [page, rowsPerPage, search]);

  return (
    <main className="m-8">
      <AddModal open={openAddModal} setOpen={setOpenAddModal} />
      <CustomTable
        rows={rows}
        order={order}
        setOrder={setOrder}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
        selected={selected}
        setSelected={setSelected}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        search={search}
        setSearch={setSearch}
        setOpenAddModal={setOpenAddModal}
      />
    </main>
  );
}
