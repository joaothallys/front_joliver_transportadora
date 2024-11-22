import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import InputMask from "react-input-mask";
import { Breadcrumb, SimpleCard } from "app/components";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import clienteService from "/src/__api__/clienteService.js";

const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const MaskedInput = React.forwardRef(function MaskedInput(props, ref) {
  const { mask, ...rest } = props;
  return (
    <InputMask mask={mask} {...rest} inputRef={ref}>
      {(inputProps) => <TextField {...inputProps} />}
    </InputMask>
  );
});

export default function ClienteForm() {
  const [formData, setFormData] = useState({
    endereco: "",
    telefone: "",
    id_cidade: "",
    data_insc: "",
    tipo_cliente: "Física", // Valor padrão
  });

  const [clientes, setClientes] = useState([]); // Estado para armazenar os clientes
  const [cidades, setCidades] = useState([]); // Estado para armazenar as cidades
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isLoading, setIsLoading] = useState(false);

  // Busca as cidades e clientes ao carregar o componente
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Inicia o carregamento
      try {
        const cidadesData = await clienteService.findAllCidades();
        setCidades(cidadesData);

        const clientesData = await clienteService.findAll();
        setClientes(clientesData);
      } catch (error) {
        setSnackbarMessage("Erro ao carregar dados.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      } finally {
        setIsLoading(false); // Finaliza o carregamento
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id_cliente) {
        await clienteService.update(formData.id_cliente, formData);
        setSnackbarMessage("Cliente atualizado com sucesso!");
      } else {
        await clienteService.create(formData);
        setSnackbarMessage("Cliente cadastrado com sucesso!");
      }
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setFormData({
        endereco: "",
        telefone: "",
        id_cidade: "",
        data_insc: "",
        tipo_cliente: "Física",
      });

      // Recarregar a lista de clientes
      const clientesData = await clienteService.findAll();
      setClientes(clientesData);
    } catch (error) {
      setSnackbarMessage("Erro ao salvar cliente. Verifique os dados.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (cliente) => {
    setFormData(cliente);
  };

  const handleDelete = async (id) => {
    try {
      await clienteService.delete(id);
      setSnackbarMessage("Cliente excluído com sucesso!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      // Atualizar lista de clientes
      setClientes(clientes.filter((cliente) => cliente.id_cliente !== id));
    } catch (error) {
      setSnackbarMessage(
        "Erro ao excluir cliente. Verifique se ele está associado a outras entidades."
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[{ name: "Clientes", path: "/clientes" }, { name: "Cadastro" }]}
        />
      </Box>

      <SimpleCard title="Cadastro de Cliente">
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              label="Endereço"
              variant="outlined"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              fullWidth
              required
            />

            <MaskedInput
              label="Telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              fullWidth
              required
              mask="(99) 99999-9999"
            />

            <FormControl fullWidth required>
              <InputLabel id="cidade-label">Cidade</InputLabel>
              <Select
                labelId="cidade-label"
                name="id_cidade"
                value={formData.id_cidade}
                onChange={handleChange}
              >
                <MenuItem value="">Selecione uma cidade</MenuItem>
                {cidades.map((cidade) => (
                  <MenuItem key={cidade.id_cidade} value={cidade.id_cidade}>
                    {cidade.nome_cidade}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Data de Inscrição"
              variant="outlined"
              name="data_insc"
              value={formData.data_insc}
              onChange={handleChange}
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              required
            />

            <FormControl fullWidth required>
              <InputLabel id="tipo-cliente-label">Tipo de Cliente</InputLabel>
              <Select
                labelId="tipo-cliente-label"
                name="tipo_cliente"
                value={formData.tipo_cliente}
                onChange={handleChange}
              >
                <MenuItem value="Física">Física</MenuItem>
                <MenuItem value="Jurídica">Jurídica</MenuItem>
              </Select>
            </FormControl>

            <Button variant="contained" color="primary" type="submit">
              {formData.id_cliente ? "Atualizar Cliente" : "Cadastrar Cliente"}
            </Button>
          </Box>
        </form>
      </SimpleCard>

      <SimpleCard title="Lista de Clientes">
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Endereço</TableCell>
                  <TableCell>Telefone</TableCell>
                  <TableCell>Cidade</TableCell>
                  <TableCell>Data Inscrição</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientes.map((cliente) => (
                  <TableRow key={cliente.id_cliente}>
                    <TableCell>{cliente.id_cliente}</TableCell>
                    <TableCell>{cliente.endereco}</TableCell>
                    <TableCell>{cliente.telefone}</TableCell>
                    <TableCell>{cliente.id_cidade}</TableCell>
                    <TableCell>{cliente.data_insc}</TableCell>
                    <TableCell>{cliente.tipo_cliente}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(cliente)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => handleDelete(cliente.id_cliente)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </SimpleCard>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
