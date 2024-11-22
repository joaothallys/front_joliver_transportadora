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
  Select,
  MenuItem,
} from "@mui/material";
import { InputLabel, FormControl } from "@mui/material";
import styled from "@mui/material/styles/styled";
import { Breadcrumb, SimpleCard } from "app/components";
import pessoaJuridicaService from "__api__/pessoaJuridicaService";
import clienteService from "__api__/clienteService";
import pessoaFisicaService from "__api__/pessoaFisicaService";

// Styled Components
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

export default function GerenciamentoPessoaJuridica() {
  const [data, setData] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [representantes, setRepresentantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    razao_social: "",
    CNPJ: "",
    inscricao_estadual: "",
    id_cliente: "",
    id_representante: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedPJId, setSelectedPJId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [pjToDelete, setPjToDelete] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    fetchPJs();
    fetchClientes();
    fetchRepresentantes();
  }, []);

  const fetchPJs = async () => {
    setLoading(true);
    try {
      const pjs = await pessoaJuridicaService.findAll();
      setData(pjs);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erro ao carregar pessoas jurídicas.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchClientes = async () => {
    try {
      const clientes = await clienteService.findAll();
      setClientes(clientes);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erro ao carregar clientes.",
        severity: "error",
      });
    }
  };

  const fetchRepresentantes = async () => {
    try {
      const representantes = await pessoaFisicaService.findAll();
      setRepresentantes(representantes);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erro ao carregar representantes.",
        severity: "error",
      });
    }
  };

  const handleOpenDialog = (pj = null) => {
    if (pj) {
      setEditMode(true);
      setSelectedPJId(pj.id_cliente);
      setFormData({
        razao_social: pj.razao_social,
        CNPJ: pj.CNPJ,
        inscricao_estadual: pj.inscricao_estadual,
        id_cliente: pj.id_cliente,
        id_representante: pj.id_representante,
      });
    } else {
      setEditMode(false);
      setSelectedPJId(null);
      setFormData({
        razao_social: "",
        CNPJ: "",
        inscricao_estadual: "",
        id_cliente: "",
        id_representante: "",
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
        await pessoaJuridicaService.update(selectedPJId, formData);
        setSnackbar({ open: true, message: "Pessoa Jurídica atualizada com sucesso!", severity: "success" });
      } else {
        await pessoaJuridicaService.create(formData);
        setSnackbar({ open: true, message: "Pessoa Jurídica cadastrada com sucesso!", severity: "success" });
      }
      fetchPJs();
    } catch (error) {
      setSnackbar({ open: true, message: "Erro ao salvar pessoa jurídica.", severity: "error" });
    } finally {
      setOpenDialog(false);
    }
  };

  const handleOpenConfirmDialog = (id) => {
    setPjToDelete(id);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (pjToDelete) {
      await handleDelete(pjToDelete);
      handleCloseConfirmDialog();
    }
  };

  const handleCloseConfirmDialog = () => {
    setPjToDelete(null);
    setOpenConfirmDialog(false);
  };

  const handleDelete = async (id) => {
    try {
      await pessoaJuridicaService.delete(id);
      setSnackbar({ open: true, message: "Pessoa Jurídica excluída com sucesso!", severity: "success" });
      fetchPJs();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.error || "Erro ao excluir pessoa jurídica.",
        severity: "error",
      });
    }
  };

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[{ name: "Ferramentas", path: "/pj" }, { name: "Pessoa Jurídica" }]}
        />
      </Box>

      <SimpleCard title="Gerenciamento de Pessoa Jurídica">
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
                  <TableCell>Razão Social</TableCell>
                  <TableCell>CNPJ</TableCell>
                  <TableCell>Inscrição Estadual</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Representante</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((pj) => {
                  const cliente = clientes.find((c) => c.id_cliente === pj.id_cliente);
                  const representante = representantes.find(
                    (r) => r.id_cliente === pj.id_representante
                  );

                  return (
                    <TableRow key={pj.id_cliente}>
                      <TableCell>{pj.id_cliente}</TableCell>
                      <TableCell>{pj.razao_social}</TableCell>
                      <TableCell>{pj.CNPJ}</TableCell>
                      <TableCell>{pj.inscricao_estadual}</TableCell>
                      <TableCell>{cliente?.nome || "Cliente não encontrado"}</TableCell>
                      <TableCell>{representante?.nome || "Representante não encontrado"}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpenDialog(pj)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleOpenConfirmDialog(pj.id_cliente)}
                          style={{ marginLeft: "10px" }}
                        >
                          Excluir
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
            Adicionar Pessoa Jurídica
          </Button>
        </Box>
      </SimpleCard>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editMode ? "Editar Pessoa Jurídica" : "Cadastrar Pessoa Jurídica"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Razão Social"
            name="razao_social"
            value={formData.razao_social}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="CNPJ"
            name="CNPJ"
            value={formData.CNPJ}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Inscrição Estadual"
            name="inscricao_estadual"
            value={formData.inscricao_estadual}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="cliente-label">Cliente</InputLabel>
            <Select
              labelId="cliente-label"
              name="id_cliente"
              value={formData.id_cliente}
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>Selecione um cliente</em>
              </MenuItem>
              {clientes.map((cliente) => (
                <MenuItem key={cliente.id_cliente} value={cliente.id_cliente}>
                  {cliente.id_cliente}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="representante-label">Representante</InputLabel>
            <Select
              labelId="representante-label"
              name="id_representante"
              value={formData.id_representante}
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>Selecione um representante</em>
              </MenuItem>
              {representantes.map((representante) => (
                <MenuItem key={representante.id_cliente} value={representante.id_cliente}>
                  {representante.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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

      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>Tem certeza que deseja excluir esta pessoa jurídica?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Confirmar
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
    </Container>
  );
}
