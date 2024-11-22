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
import freteService from "__api__/freteService";

const ProgressRoot = styled("div")(({ theme }) => ({
  margin: "30px",
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

export default function GerenciamentoFretes() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    data_frete: "",
    valor_mercadoria: "",
    frete_tipo: "",
    peso: "",
    frete_valor: "",
    valor_icms: "",
    valor_pedagio: "",
    quem_paga_frete: "",
    id_remetente: "",
    id_destinatario: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedFreteId, setSelectedFreteId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [freteToDelete, setFreteToDelete] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    fetchFretes();
  }, []);

  const fetchFretes = async () => {
    setLoading(true);
    try {
      const fretes = await freteService.findAll(); // Busca todos os fretes
      setData(fretes);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erro ao carregar fretes.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (frete = null) => {
    if (frete) {
      setEditMode(true);
      setSelectedFreteId(frete.id_frete);
      setFormData({
        data_frete: frete.data_frete,
        valor_mercadoria: frete.valor_mercadoria,
        frete_tipo: frete.frete_tipo,
        peso: frete.peso,
        frete_valor: frete.frete_valor,
        valor_icms: frete.valor_icms,
        valor_pedagio: frete.valor_pedagio,
        quem_paga_frete: frete.quem_paga_frete,
        id_remetente: frete.id_remetente,
        id_destinatario: frete.id_destinatario,
      });
    } else {
      setEditMode(false);
      setSelectedFreteId(null);
      setFormData({
        data_frete: "",
        valor_mercadoria: "",
        frete_tipo: "",
        peso: "",
        frete_valor: "",
        valor_icms: "",
        valor_pedagio: "",
        quem_paga_frete: "",
        id_remetente: "",
        id_destinatario: "",
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
        await freteService.update(selectedFreteId, formData);
        setSnackbar({ open: true, message: "Frete atualizado com sucesso!", severity: "success" });
      } else {
        await freteService.create(formData);
        setSnackbar({ open: true, message: "Frete cadastrado com sucesso!", severity: "success" });
      }
      fetchFretes();
    } catch (error) {
      setSnackbar({ open: true, message: "Erro ao salvar frete.", severity: "error" });
    } finally {
      setOpenDialog(false);
    }
  };

  const handleOpenConfirmDialog = (id) => {
    setFreteToDelete(id);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (freteToDelete) {
      await handleDelete(freteToDelete);
      handleCloseConfirmDialog();
    }
  };

  const handleCloseConfirmDialog = () => {
    setFreteToDelete(null);
    setOpenConfirmDialog(false);
  };

  const handleDelete = async (id) => {
    try {
      await freteService.delete(id);
      setSnackbar({ open: true, message: "Frete excluído com sucesso!", severity: "success" });
      fetchFretes();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.error || "Erro ao excluir frete.",
        severity: "error",
      });
    }
  };

  return (
    <ProgressRoot>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Ferramentas", path: "/fretes" }, { name: "Fretes" }]} />
      </Box>

      <SimpleCard title="Gerenciamento de Fretes">
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
                  <TableCell>Data</TableCell>
                  <TableCell>Valor Mercadoria</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Peso</TableCell>
                  <TableCell>Valor Frete</TableCell>
                  <TableCell>ICMS</TableCell>
                  <TableCell>Pedágio</TableCell>
                  <TableCell>Pagador</TableCell>
                  <TableCell>ID Remetente</TableCell>
                  <TableCell>ID Destinatário</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((frete) => (
                  <TableRow key={frete.id_frete}>
                    <TableCell>{frete.id_frete}</TableCell>
                    <TableCell>{frete.data_frete}</TableCell>
                    <TableCell>{frete.valor_mercadoria}</TableCell>
                    <TableCell>{frete.frete_tipo}</TableCell>
                    <TableCell>{frete.peso}</TableCell>
                    <TableCell>{frete.frete_valor}</TableCell>
                    <TableCell>{frete.valor_icms}</TableCell>
                    <TableCell>{frete.valor_pedagio}</TableCell>
                    <TableCell>{frete.quem_paga_frete}</TableCell>
                    <TableCell>{frete.id_remetente}</TableCell>
                    <TableCell>{frete.id_destinatario}</TableCell>
                    <TableCell>
                      <Box display="flex" justifyContent="space-between" gap={1} flexWrap="wrap">
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleOpenDialog(frete)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={() => handleOpenConfirmDialog(frete.id_frete)}
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
            Adicionar Frete
          </Button>
        </Box>
      </SimpleCard>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editMode ? "Editar Frete" : "Adicionar Frete"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Data do Frete"
            name="data_frete"
            type="date"
            value={formData.data_frete}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Valor da Mercadoria"
            name="valor_mercadoria"
            value={formData.valor_mercadoria}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Tipo de Frete"
            name="frete_tipo"
            value={formData.frete_tipo}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Peso"
            name="peso"
            value={formData.peso}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Valor do Frete"
            name="frete_valor"
            value={formData.frete_valor}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="ICMS"
            name="valor_icms"
            value={formData.valor_icms}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Pedágio"
            name="valor_pedagio"
            value={formData.valor_pedagio}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Quem Paga o Frete"
            name="quem_paga_frete"
            value={formData.quem_paga_frete}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="ID Remetente"
            name="id_remetente"
            value={formData.id_remetente}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="ID Destinatário"
            name="id_destinatario"
            value={formData.id_destinatario}
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

      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>Tem certeza que deseja excluir este frete?</DialogContent>
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
    </ProgressRoot>
  );
}
