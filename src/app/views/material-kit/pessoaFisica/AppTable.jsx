import React, { useEffect, useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel, CircularProgress, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import estadoService from "__api__/estadoService"; // Certifique-se de que o serviço está correto
import dashboardService from "__api__/dashboard"; // Certifique-se de que o serviço está correto

const AppTable = () => {
  const [estados, setEstados] = useState([]); // Estado para armazenar a lista de estados
  const [estadoSelecionado, setEstadoSelecionado] = useState(''); // Estado para armazenar o estado selecionado
  const [data, setData] = useState(null); // Estado para armazenar os dados do dashboard
  const [loading, setLoading] = useState(false); // Estado para controle de carregamento
  const [loadingEstados, setLoadingEstados] = useState(true); // Estado para controle de carregamento dos estados

  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const result = await estadoService.findAll(); // Busca os estados
        setEstados(result); // Armazena os estados
      } catch (error) {
        console.error('Erro ao buscar estados:', error);
      } finally {
        setLoadingEstados(false); // Desativa o carregamento dos estados
      }
    };

    fetchEstados();
  }, []); // Executa uma vez quando o componente é montado

  // Função para buscar os dados do estado selecionado
  const fetchDadosEstado = async (id) => {
    if (!id) return;
    setLoading(true); // Ativa o carregamento
    try {
      const result = await dashboardService.getMediaFretes(id); // Busca os dados do dashboard
      // A resposta é um array de arrays, então vamos acessar o primeiro item
      setData(result?.[0] || []); // Armazena os dados
    } catch (error) {
      console.error('Erro ao buscar dados do estado:', error);
    } finally {
      setLoading(false); // Desativa o carregamento
    }
  };

  // Quando o estado for selecionado, buscar os dados do dashboard
  useEffect(() => {
    if (estadoSelecionado) {
      fetchDadosEstado(estadoSelecionado); // Chama a função para buscar os dados
    }
  }, [estadoSelecionado]); // Executa sempre que o estado selecionado mudar

  return (
    <Box sx={{ marginLeft: '20px', marginTop: '30px', marginRight: '20px' }}>
      {/* Título */}
      <Typography variant="h5" gutterBottom>
        Tabela de Média de Fretes
      </Typography>

      {/* Select para escolher o estado */}
      {loadingEstados ? (
        <CircularProgress />
      ) : (
        <FormControl fullWidth sx={{ marginBottom: '20px' }}>
          <InputLabel id="estado-select-label">Escolha um Estado</InputLabel>
          <Select
            labelId="estado-select-label"
            id="estado-select"
            value={estadoSelecionado}
            onChange={(e) => setEstadoSelecionado(e.target.value)}
            label="Escolha um Estado"
          >
            {estados.map((estado) => (
              <MenuItem key={estado.id_estado} value={estado.id_estado}>
                {estado.nome_estado}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Se os dados estão sendo carregados */}
      {loading ? (
        <CircularProgress />
      ) : data && data.length > 0 ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Estado</TableCell>
                <TableCell>Cidade</TableCell>
                <TableCell>Frete Origem</TableCell>
                <TableCell>Frete Destino</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.nome_estado}</TableCell>
                  <TableCell>{item.nome_cidade}</TableCell>
                  <TableCell>{item.media_fretes_origem}</TableCell>
                  <TableCell>{item.media_fretes_destino}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>Selecione um estado para visualizar os dados</Typography>
      )}
    </Box>
  );
};

export default AppTable;
