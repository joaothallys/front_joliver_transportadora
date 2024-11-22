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
import styled from "@mui/material/styles/styled";
import { Breadcrumb, SimpleCard } from "app/components";
import cidadeService from "__api__/cidadeService";
import estadoService from "__api__/estadoService";

// Styled Components
const AppButtonRoot = styled("div")(({ theme }) => ({
  margin: "30px",
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

export default function GerenciamentoCidades() {
  const [data, setData] = useState([]);
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    nome_cidade: "",
    preco_unit_valor: "",
    preco_unit_peso: "",
    id_estado: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // Controle do dialog
  const [cityToDelete, setCityToDelete] = useState(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  useEffect(() => {
    fetchCidades();
    fetchEstados();
  }, []);

  const fetchCidades = async () => {
    setLoading(true);
    try {
      const cidades = await cidadeService.findAll();
      setData(cidades);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erro ao carregar cidades.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchEstados = async () => {
    try {
      const estados = await estadoService.findAll();
      setEstados(estados);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erro ao carregar estados.",
        severity: "error",
      });
    }
  };

  const handleOpenDialog = (cidade = null) => {
    if (cidade) {
      setEditMode(true);
      setSelectedCityId(cidade.id_cidade);
      setFormData({
        nome_cidade: cidade.nome_cidade,
        preco_unit_valor: cidade.preco_unit_valor,
        preco_unit_peso: cidade.preco_unit_peso,
        id_estado: cidade.id_estado,
      });
    } else {
      setEditMode(false);
      setSelectedCityId(null);
      setFormData({
        nome_cidade: "",
        preco_unit_valor: "",
        preco_unit_peso: "",
        id_estado: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      if (editMode) {
        await cidadeService.update(selectedCityId, formData);
        setSnackbar({
          open: true,
          message: "Cidade atualizada com sucesso!",
          severity: "success",
        });
      } else {
        await cidadeService.create(formData);
        setSnackbar({
          open: true,
          message: "Cidade cadastrada com sucesso!",
          severity: "success",
        });
      }
      fetchCidades();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erro ao salvar cidade.",
        severity: "error",
      });
    } finally {
      setOpenDialog(false);
    }
  };

  const handleOpenConfirmDialog = (id) => {
    setCityToDelete(id);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (cityToDelete) {
      try {
        await cidadeService.delete(cityToDelete);
        setSnackbar({
          open: true,
          message: "Cidade excluída com sucesso!",
          severity: "success",
        });
        fetchCidades();
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.response?.data?.error || "Erro ao excluir cidade.",
          severity: "error",
        });
      } finally {
        handleCloseConfirmDialog();
      }
    }
  };

  const handleCloseConfirmDialog = () => {
    setCityToDelete(null);
    setOpenConfirmDialog(false);
  };

  return (
    <AppButtonRoot>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: "Ferramentas", path: "/material" },
            { name: "Gerenciamento de Cidades" },
          ]}
        />
      </Box>

      <SimpleCard title="Gerenciamento de Cidades">
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
                  <TableCell>Nome da Cidade</TableCell>
                  <TableCell>Preço por Valor</TableCell>
                  <TableCell>Preço por Peso</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((cidade) => (
                  <TableRow key={cidade.id_cidade}>
                    <TableCell>{cidade.id_cidade}</TableCell>
                    <TableCell>{cidade.nome_cidade}</TableCell>
                    <TableCell>{cidade.preco_unit_valor}</TableCell>
                    <TableCell>{cidade.preco_unit_peso}</TableCell>
                    <TableCell>
                      {estados.find((e) => e.id_estado === cidade.id_estado)?.nome_estado || "Desconhecido"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenDialog(cidade)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleOpenConfirmDialog(cidade.id_cidade)}
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
            Adicionar Cidade
          </Button>
        </Box>
      </SimpleCard>

      {/* Dialog para confirmar exclusão */}
      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          Tem certeza que deseja excluir esta cidade? Esta ação não pode ser desfeita.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para editar ou cadastrar cidade */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editMode ? "Editar Cidade" : "Cadastrar Cidade"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome da Cidade"
            name="nome_cidade"
            value={formData.nome_cidade}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Preço por Valor"
            name="preco_unit_valor"
            value={formData.preco_unit_valor}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="number"
          />
          <TextField
            label="Preço por Peso"
            name="preco_unit_peso"
            value={formData.preco_unit_peso}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="number"
          />
          <Select
            name="id_estado"
            value={formData.id_estado}
            onChange={handleChange}
            fullWidth
            displayEmpty
          >
            <MenuItem value="">
              <em>Selecione um estado</em>
            </MenuItem>
            {estados.map((estado) => (
              <MenuItem key={estado.id_estado} value={estado.id_estado}>
                {estado.nome_estado}
              </MenuItem>
            ))}
          </Select>
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