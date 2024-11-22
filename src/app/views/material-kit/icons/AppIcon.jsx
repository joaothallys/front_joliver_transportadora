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
  DialogTitle,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import styled from "@mui/material/styles/styled";
import { Breadcrumb, SimpleCard } from "app/components";
import estadoService from "__api__/estadoService";

// Styled Components
const AppButtonRoot = styled("div")(({ theme }) => ({
  margin: "30px",
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

export default function GerenciamentoEstados() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    nome_estado: "",
    icms_local: "",
    uf: "",
    icms_outro_uf: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedEstadoId, setSelectedEstadoId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [estadoToDelete, setEstadoToDelete] = useState(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Função para abrir o modal de confirmação de exclusão
  const handleOpenConfirmDialog = (id) => {
    setEstadoToDelete(id);
    setOpenConfirmDialog(true);
  };

  // Confirma a exclusão
  const handleConfirmDelete = async () => {
    if (estadoToDelete) {
      await handleDelete(estadoToDelete);
      handleCloseConfirmDialog();
    }
  };

  // Fecha o modal de confirmação
  const handleCloseConfirmDialog = () => {
    setEstadoToDelete(null);
    setOpenConfirmDialog(false);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    fetchEstados();
  }, []);

  const fetchEstados = async () => {
    setLoading(true);
    try {
      const estados = await estadoService.findAll();
      setData(estados);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erro ao carregar estados.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (estado = null) => {
    if (estado) {
      setEditMode(true);
      setSelectedEstadoId(estado.id_estado);
      setFormData({
        nome_estado: estado.nome_estado,
        icms_local: estado.icms_local,
        uf: estado.uf,
        icms_outro_uf: estado.icms_outro_uf,
      });
    } else {
      setEditMode(false);
      setSelectedEstadoId(null);
      setFormData({
        nome_estado: "",
        icms_local: "",
        uf: "",
        icms_outro_uf: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      if (editMode) {
        await estadoService.update(selectedEstadoId, formData);
        setSnackbar({ open: true, message: "Estado atualizado com sucesso!", severity: "success" });
      } else {
        await estadoService.create(formData);
        setSnackbar({ open: true, message: "Estado cadastrado com sucesso!", severity: "success" });
      }
      fetchEstados();
    } catch (error) {
      setSnackbar({ open: true, message: "Erro ao salvar estado.", severity: "error" });
    } finally {
      setOpenDialog(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await estadoService.delete(id);
      setSnackbar({ open: true, message: "Estado excluído com sucesso!", severity: "success" });
      fetchEstados();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.error || "Erro ao excluir estado.",
        severity: "error",
      });
    }
  };

  return (
    <AppButtonRoot>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[{ name: "Ferramentas", path: "/material" }, { name: "Gerenciamento de Estados" }]}
        />
      </Box>

      <SimpleCard title="Gerenciamento de Estados">
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nome do Estado</TableCell>
                  <TableCell>UF</TableCell>
                  <TableCell>ICMS Local</TableCell>
                  <TableCell>ICMS Outro UF</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((estado) => (
                  <TableRow key={estado.id_estado}>
                    <TableCell>{estado.id_estado}</TableCell>
                    <TableCell>{estado.nome_estado}</TableCell>
                    <TableCell>{estado.uf}</TableCell>
                    <TableCell>{estado.icms_local}</TableCell>
                    <TableCell>{estado.icms_outro_uf}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenDialog(estado)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleOpenConfirmDialog(estado.id_estado)}
                        style={{ marginLeft: "10px" }}
                      >
                        Excluir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
            Adicionar Estado
          </Button>
        </Box>
      </SimpleCard>

      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>Tem certeza que deseja excluir este estado?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editMode ? "Editar Estado" : "Cadastrar Estado"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome do Estado"
            name="nome_estado"
            value={formData.nome_estado}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="UF"
            name="uf"
            value={formData.uf}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="ICMS Local"
            name="icms_local"
            value={formData.icms_local}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="number"
          />
          <TextField
            label="ICMS Outro UF"
            name="icms_outro_uf"
            value={formData.icms_outro_uf}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="number"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSave} color="secondary">
            {editMode ? "Salvar Alterações" : "Cadastrar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AppButtonRoot>
  );
}
