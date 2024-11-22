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
import pessoaFisicaService from "__api__/pessoaFisicaService";

// Styled Components
const ProgressRoot = styled("div")(({ theme }) => ({
  margin: "30px",
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

export default function GerenciamentoPessoaFisica() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    CPF: "",
    endereco: "",
    telefone: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedPessoaId, setSelectedPessoaId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [pessoaToDelete, setPessoaToDelete] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenConfirmDialog = (id) => {
    setPessoaToDelete(id);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (pessoaToDelete) {
      await handleDelete(pessoaToDelete);
      handleCloseConfirmDialog();
    }
  };

  const handleCloseConfirmDialog = () => {
    setPessoaToDelete(null);
    setOpenConfirmDialog(false);
  };

  useEffect(() => {
    fetchPessoas();
  }, []);

  const fetchPessoas = async () => {
    setLoading(true);
    try {
      const pessoas = await pessoaFisicaService.findAll();
      setData(pessoas);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erro ao carregar pessoas físicas.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (pessoa = null) => {
    if (pessoa) {
      setEditMode(true);
      setSelectedPessoaId(pessoa.id_cliente);
      setFormData({
        nome: pessoa.nome,
        CPF: pessoa.CPF,
        endereco: pessoa.endereco,
        telefone: pessoa.telefone,
      });
    } else {
      setEditMode(false);
      setSelectedPessoaId(null);
      setFormData({
        nome: "",
        CPF: "",
        endereco: "",
        telefone: "",
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
        await pessoaFisicaService.update(selectedPessoaId, formData);
        setSnackbar({ open: true, message: "Pessoa Física atualizada com sucesso!", severity: "success" });
      } else {
        await pessoaFisicaService.create(formData);
        setSnackbar({ open: true, message: "Pessoa Física cadastrada com sucesso!", severity: "success" });
      }
      fetchPessoas();
    } catch (error) {
      setSnackbar({ open: true, message: "Erro ao salvar pessoa física.", severity: "error" });
    } finally {
      setOpenDialog(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await pessoaFisicaService.delete(id);
      setSnackbar({ open: true, message: "Pessoa Física excluída com sucesso!", severity: "success" });
      fetchPessoas();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.error || "Erro ao excluir pessoa física.",
        severity: "error",
      });
    }
  };

  return (
    <ProgressRoot>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[{ name: "Ferramentas", path: "/material" }, { name: "Gerenciamento de Pessoa Física" }]}
        />
      </Box>

      <SimpleCard title="Gerenciamento de Pessoa Física">
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
                  <TableCell>CPF</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((pessoa) => (
                  <TableRow key={pessoa.id_cliente}>
                    <TableCell>{pessoa.id_cliente}</TableCell>
                    <TableCell>{pessoa.nome}</TableCell>
                    <TableCell>{pessoa.CPF}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenDialog(pessoa)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleOpenConfirmDialog(pessoa.id_cliente)}
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
            Adicionar Pessoa Física
          </Button>
        </Box>
      </SimpleCard>

      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>Tem certeza que deseja excluir esta pessoa física?</DialogContent>
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
        <DialogTitle>{editMode ? "Editar Pessoa Física" : "Cadastrar Pessoa Física"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="CPF"
            name="CPF"
            value={formData.CPF}
            onChange={handleChange}
            fullWidth
            margin="normal"
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
    </ProgressRoot>
  );
}
