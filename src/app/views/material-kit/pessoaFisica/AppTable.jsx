import React, { useEffect, useState } from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
} from '@mui/material';
import estadoService from "__api__/estadoService";
import dashboardService from "__api__/dashboard";

const AppTable = () => {
  const [estados, setEstados] = useState([]);
  const [estadoSelecionado, setEstadoSelecionado] = useState('');
  const [estadoArrecadacao, setEstadoArrecadacao] = useState('');
  const [dataMedia, setDataMedia] = useState(null);
  const [dataArrecadacao, setDataArrecadacao] = useState(null);
  const [dataFretesFuncionarios, setDataFretesFuncionarios] = useState(null);
  const [loadingEstados, setLoadingEstados] = useState(true);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [loadingArrecadacao, setLoadingArrecadacao] = useState(false);
  const [loadingFretesFuncionarios, setLoadingFretesFuncionarios] = useState(false);
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState('');

  // Fetch estados na montagem do componente
  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const result = await estadoService.findAll();
        setEstados(result);
      } catch (error) {
        console.error('Erro ao buscar estados:', error);
      } finally {
        setLoadingEstados(false);
      }
    };
    fetchEstados();
  }, []);

  // Fetch dados de média de fretes
  const fetchDadosMedia = async (id) => {
    if (!id) return;
    setLoadingMedia(true);
    try {
      const result = await dashboardService.getMediaFretes(id);
      setDataMedia(result?.[0] || []);
    } catch (error) {
      console.error('Erro ao buscar dados de média:', error);
    } finally {
      setLoadingMedia(false);
    }
  };

  // Fetch dados de arrecadação de fretes
  const fetchDadosArrecadacao = async (id) => {
    if (!id) return;
    setLoadingArrecadacao(true);
    try {
      const result = await dashboardService.getArrecadacaoFretes(id);
      setDataArrecadacao(result?.[0] || []);
    } catch (error) {
      console.error('Erro ao buscar dados de arrecadação:', error);
    } finally {
      setLoadingArrecadacao(false);
    }
  };

  // Fetch dados de fretes atendidos por funcionários
  const fetchDadosFretesFuncionarios = async (mes, ano) => {
    if (!mes || !ano) return;
    setLoadingFretesFuncionarios(true);
    try {
      const result = await dashboardService.getFretesFuncionarios(mes, ano);
      setDataFretesFuncionarios(result?.[0] || []);
    } catch (error) {
      console.error('Erro ao buscar dados de fretes por funcionários:', error);
    } finally {
      setLoadingFretesFuncionarios(false);
    }
  };

  useEffect(() => {
    if (estadoSelecionado) {
      fetchDadosMedia(estadoSelecionado);
    }
  }, [estadoSelecionado]);

  useEffect(() => {
    if (estadoArrecadacao) {
      fetchDadosArrecadacao(estadoArrecadacao);
    }
  }, [estadoArrecadacao]);

  const handleFetchFretesFuncionarios = () => {
    fetchDadosFretesFuncionarios(mes, ano);
  };

  return (
    <Box sx={{ margin: '30px 20px' }}>
      {/* Tabela de Média de Fretes */}
      <Typography variant="h5" gutterBottom>
        Tabela de Média de Fretes
      </Typography>
      {loadingEstados ? (
        <CircularProgress />
      ) : (
        <FormControl fullWidth sx={{ marginBottom: '20px' }}>
          <InputLabel id="estado-media-select-label">Escolha um Estado</InputLabel>
          <Select
            labelId="estado-media-select-label"
            value={estadoSelecionado}
            onChange={(e) => setEstadoSelecionado(e.target.value)}
          >
            {estados.map((estado) => (
              <MenuItem key={estado.id_estado} value={estado.id_estado}>
                {estado.nome_estado}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      {loadingMedia ? (
        <CircularProgress />
      ) : dataMedia && dataMedia.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Estado</TableCell>
                <TableCell>Cidade</TableCell>
                <TableCell>Média Frete Origem</TableCell>
                <TableCell>Média Frete Destino</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataMedia.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.nome_estado}</TableCell>
                  <TableCell>{item.nome_cidade}</TableCell>
                  <TableCell>{Math.floor(item.media_fretes_origem)}</TableCell>
                  <TableCell>{Math.floor(item.media_fretes_destino)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>Selecione um estado para visualizar os dados</Typography>
      )}

      {/* Tabela de Arrecadação de Fretes */}
      <Typography variant="h5" gutterBottom sx={{ marginTop: '30px' }}>
        Tabela de Arrecadação de Fretes
      </Typography>
      {loadingEstados ? (
        <CircularProgress />
      ) : (
        <FormControl fullWidth sx={{ marginBottom: '20px' }}>
          <InputLabel id="estado-arrecadacao-select-label">Escolha um Estado</InputLabel>
          <Select
            labelId="estado-arrecadacao-select-label"
            value={estadoArrecadacao}
            onChange={(e) => setEstadoArrecadacao(e.target.value)}
          >
            {estados.map((estado) => (
              <MenuItem key={estado.id_estado} value={estado.id_estado}>
                {estado.nome_estado}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      {loadingArrecadacao ? (
        <CircularProgress />
      ) : dataArrecadacao && dataArrecadacao.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Estado</TableCell>
                <TableCell>Cidade</TableCell>
                <TableCell>Quantidade Fretes Origem</TableCell>
                <TableCell>Quantidade Fretes Destino</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataArrecadacao.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.nome_estado}</TableCell>
                  <TableCell>{item.nome_cidade}</TableCell>
                  <TableCell>{item.quantidade_fretes_origem}</TableCell>
                  <TableCell>{item.quantidade_fretes_destino}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>Selecione um estado para visualizar os dados</Typography>
      )}

      {/* Tabela de Fretes Atendidos por Funcionários */}
      <Typography variant="h5" gutterBottom sx={{ marginTop: '30px' }}>
        Tabela de Fretes Atendidos por Funcionários
      </Typography>
      <Box sx={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <TextField
          label="Mês"
          type="number"
          value={mes}
          onChange={(e) => setMes(e.target.value)}
          InputProps={{ inputProps: { min: 1, max: 12 } }}
          fullWidth
        />
        <TextField
          label="Ano"
          type="number"
          value={ano}
          onChange={(e) => setAno(e.target.value)}
          InputProps={{ inputProps: { min: 2000, max: new Date().getFullYear() + 1 } }}
          fullWidth
        />
        <Button variant="contained" onClick={handleFetchFretesFuncionarios} disabled={!mes || !ano}>
          Buscar
        </Button>
      </Box>
      {loadingFretesFuncionarios ? (
        <CircularProgress />
      ) : dataFretesFuncionarios && dataFretesFuncionarios.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID Frete</TableCell>
                <TableCell>Data do Frete</TableCell>
                <TableCell>Funcionário Responsável</TableCell>
                <TableCell>Empresa</TableCell>
                <TableCell>Representante</TableCell>
                <TableCell>Telefone</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataFretesFuncionarios.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.id_frete}</TableCell>
                  <TableCell>{new Date(item.data_frete).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{item.funcionario_responsavel}</TableCell>
                  <TableCell>{item.empresa}</TableCell>
                  <TableCell>{item.representante_nome}</TableCell>
                  <TableCell>{item.representante_telefone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>Insira o mês e o ano para visualizar os dados</Typography>
      )}
    </Box>
  );
};

export default AppTable;
