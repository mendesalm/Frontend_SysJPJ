import React, { useState, useEffect } from 'react';
import { getGeneratedDocuments } from '../../../services/documentoGeradoService';
import { Link } from 'react-router-dom';

const DocumentosGeradosList = () => {
    const [documentos, setDocumentos] = useState([]);
    const [tipoFiltro, setTipoFiltro] = useState('');
    const [termoBusca, setTermoBusca] = useState('');

    useEffect(() => {
        const fetchDocumentos = async () => {
            try {
                const params = {};
                if (tipoFiltro) params.tipo = tipoFiltro;
                if (termoBusca) params.termo = termoBusca;
                const data = await getGeneratedDocuments(params);
                setDocumentos(data);
            } catch (error) {
                console.error("Erro ao buscar documentos:", error);
            }
        };

        fetchDocumentos();
    }, [tipoFiltro, termoBusca]);

    return (
        <div>
            <h2>Documentos Gerados</h2>
            <div>
                <label>Filtrar por tipo:</label>
                <select value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)}>
                    <option value="">Todos</option>
                    <option value="Prancha">Prancha</option>
                    <option value="Convite">Convite</option>
                    <option value="Cartão">Cartão</option>
                </select>
                <input 
                    type="text" 
                    placeholder="Buscar por termo..." 
                    value={termoBusca} 
                    onChange={(e) => setTermoBusca(e.target.value)} 
                />
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tipo</th>
                        <th>Título</th>
                        <th>Autor</th>
                        <th>Data de Criação</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {documentos.map(doc => (
                        <tr key={doc.id}>
                            <td>{doc.id}</td>
                            <td>{doc.tipo}</td>
                            <td>{doc.titulo}</td>
                            <td>{doc.LodgeMember.name}</td>
                            <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
                            <td>
                                <Link to={`/documentos/${doc.id}`}>Ver</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link to="/documentos/novo">Gerar Novo Documento</Link>
        </div>
    );
};

export default DocumentosGeradosList;
