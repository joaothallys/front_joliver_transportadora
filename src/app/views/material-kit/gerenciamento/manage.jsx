import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import styled from "@mui/material/styles/styled";
import { Breadcrumb, SimpleCard } from "app/components";
import userService from "__api__/db/user";

// Styled Components
const AppButtonRoot = styled("div")(({ theme }) => ({
  margin: "30px",
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

export default function AppButton() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [deactivationDate, setDeactivationDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Fetch Data on Page Change
  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  // Fetch Users
  const fetchData = async (page) => {
    setLoading(true);
    try {
      const response = await userService.getCustomers(page);
      if (response?.data && Array.isArray(response.data)) {
        setData(response.data);
        setLastPage(response.last_page || 1);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleToggleActive = async () => {
    setLoading(true);
    try {
      const selectedUser = data.find((user) => user.customer_id === selectedUserId);

      if (!selectedUser) {
        throw new Error("Cliente não encontrado.");
      }

      if (selectedUser.deleted_at) {
        await userService.reactivateClient(selectedUser.customer_id);
        setSnackbar({
          open: true,
          message: "Usuário ativado com sucesso.",
          severity: "success",
        });
      } else {
        if (!deactivationDate) {
          throw new Error("Data de desativação é necessária para desativar um cliente.");
        }
        await userService.deactivateClient(selectedUser.customer_id, deactivationDate);
        setSnackbar({
          open: true,
          message: "Usuário desativado com sucesso.",
          severity: "success",
        });
      }

      fetchData(currentPage);
    } catch (error) {
      console.error("Erro ao alterar status do cliente:", error);
      setSnackbar({
        open: true,
        message: "Erro ao alterar status do cliente.",
        severity: "error",
      });
    } finally {
      setOpenDialog(false);
      setDeactivationDate("");
      setLoading(false);
    }
  };

  const openActivationDialog = (id) => {
    setSelectedUserId(id);
    setOpenDialog(true);
  };

  const copyToClipboard = (token) => {
    navigator.clipboard.writeText(token);
    setSnackbar({
      open: true,
      message: "Token copiado para a área de transferência.",
      severity: "info",
    });
  };

  const filteredData = Array.isArray(data)
    ? data.filter((user) =>
      user.customer_id.toString().toLowerCase().includes(search.toLowerCase())
    )
    : [];

  return (
    <AppButtonRoot>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: "Ferramentas", path: "/material" },
            { name: "Gerenciamento" },
          ]}
        />
      </Box>

      <SimpleCard title="Gerenciamento de Usuários">
        <Box mb={2}>
          <TextField
            label="Pesquisar por Customer ID"
            variant="outlined"
            fullWidth
            value={search}
            onChange={handleSearch}
          />
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer ID</TableCell>
                  <TableCell>Token</TableCell>
                  <TableCell>Criado em</TableCell>
                  <TableCell>Última Atualização</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Ação</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.customer_id}</TableCell>
                    <TableCell>
                      {user.token ? `${user.token.slice(0, 10)}...` : "vazio"}
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(user.updated_at).toLocaleString()}
                    </TableCell>
                    <TableCell>{user.type_name}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color={user.deleted_at ? "primary" : "secondary"}
                        onClick={() => openActivationDialog(user.customer_id)}
                      >
                        {user.deleted_at ? "Ativar" : "Desativar"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Anterior
          </Button>
          <Box mx={2}>{`Página ${currentPage} de ${lastPage}`}</Box>
          <Button
            disabled={currentPage === lastPage}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, lastPage))
            }
          >
            Próxima
          </Button>
        </Box>
      </SimpleCard>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {data.find((user) => user.customer_id === selectedUserId)?.deleted_at
            ? "Ativar Usuário"
            : "Desativar Usuário"}
        </DialogTitle>
        <DialogContent>
          {data.find((user) => user.customer_id === selectedUserId)?.deleted_at ? (
            <DialogContentText>
              Tem certeza que deseja ativar este usuário?
            </DialogContentText>
          ) : (
            <>
              <DialogContentText>
                Insira a data para desativação do usuário:
              </DialogContentText>
              <TextField
                type="date"
                fullWidth
                value={deactivationDate}
                onChange={(e) => setDeactivationDate(e.target.value)}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleToggleActive} color="secondary" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // Altere "horizontal" para "right"
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AppButtonRoot>
  );
}