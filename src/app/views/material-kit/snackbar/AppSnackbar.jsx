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
import funcionarioService from "__api__/FuncionarioService";

// Styled Components
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

export default function GerenciamentoFuncionarios() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    nome_funcionario: "",
    numero_registro: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedFuncionarioId, setSelectedFuncionarioId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [funcionarioToDelete, setFuncionarioToDelete] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  const fetchFuncionarios = async () => {
    setLoading(true);
    try {
      const funcionarios = await funcionarioService.findAll();
      setData(funcionarios);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erro ao carregar funcionários.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (funcionario = null) => {
    if (funcionario) {
      setEditMode(true);
      setSelectedFuncionarioId(funcionario.id_funcionario);
      setFormData({
        nome_funcionario: funcionario.nome_funcionario,
        numero_registro: funcionario.numero_registro,
      });
    } else {
      setEditMode(false);
      setSelectedFuncionarioId(null);
      setFormData({
        nome_funcionario: "",
        numero_registro: "",
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
        await funcionarioService.update(selectedFuncionarioId, formData);
        setSnackbar({ open: true, message: "Funcionário atualizado com sucesso!", severity: "success" });
      } else {
        await funcionarioService.create(formData);
        setSnackbar({ open: true, message: "Funcionário cadastrado com sucesso!", severity: "success" });
      }
      fetchFuncionarios();
    } catch (error) {
      setSnackbar({ open: true, message: "Erro ao salvar funcionário.", severity: "error" });
    } finally {
      setOpenDialog(false);
    }
  };

  const handleOpenConfirmDialog = (id) => {
    setFuncionarioToDelete(id);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (funcionarioToDelete) {
      await handleDelete(funcionarioToDelete);
      handleCloseConfirmDialog();
    }
  };

  const handleCloseConfirmDialog = () => {
    setFuncionarioToDelete(null);
    setOpenConfirmDialog(false);
  };

  const handleDelete = async (id) => {
    try {
      await funcionarioService.delete(id);
      setSnackbar({ open: true, message: "Funcionário excluído com sucesso!", severity: "success" });
      fetchFuncionarios();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erro ao excluir funcionário.",
        severity: "error",
      });
    }
  };

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Administração", path: "/usuarios" }, { name: "Funcionários" }]} />
      </Box>

      <SimpleCard title="Gerenciamento de Funcionários">
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
                  <TableCell>Nome</TableCell>
                  <TableCell>Número Registro</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((funcionario) => (
                  <TableRow key={funcionario.id_funcionario}>
                    <TableCell>{funcionario.id_funcionario}</TableCell>
                    <TableCell>{funcionario.nome_funcionario}</TableCell>
                    <TableCell>{funcionario.numero_registro}</TableCell>
                    <TableCell>
                      <Box display="flex" justifyContent="center" gap={1}>
                        <Button variant="contained" color="primary" onClick={() => handleOpenDialog(funcionario)}>
                          Editar
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleOpenConfirmDialog(funcionario.id_funcionario)}
                        >
                          Excluir
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
            Adicionar Funcionário
          </Button>
        </Box>
      </SimpleCard>

      {/* Modal para Adicionar/Editar Funcionário */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editMode ? "Editar Funcionário" : "Adicionar Funcionário"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome do Funcionário"
            name="nome_funcionario"
            value={formData.nome_funcionario}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Número de Registro"
            name="numero_registro"
            value={formData.numero_registro}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="text"
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

      {/* Modal de Confirmação para Excluir */}
      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>Tem certeza que deseja excluir este funcionário?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para Notificações */}
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
    </Container>
  );
}
