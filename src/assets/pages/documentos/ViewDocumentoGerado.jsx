import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getGeneratedDocumentById } from '../../../services/documentoGeradoService';

const ViewDocumentoGerado = () => {
    const [documento, setDocumento] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchDocumento = async () => {
            try {
                const data = await getGeneratedDocumentById(id);
                setDocumento(data);
            } catch (error) {
                console.error("Erro ao buscar documento:", error);
            }
        };

        fetchDocumento();
    }, [id]);

    if (!documento) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="document-view">
            <header>
                <h1>{documento.titulo}</h1>
                <p>
                    <strong>Tipo:</strong> {documento.tipo} 
                    {documento.numero && <span> | <strong>Número:</strong> {documento.numero}/{documento.ano}</span>}
                </p>
                <p><strong>Autor:</strong> {documento.LodgeMember.name} ({documento.LodgeMember.masonicDegree})</p>
                <p><strong>Data de Criação:</strong> {new Date(documento.createdAt).toLocaleString()}</p>
            </header>
            <main dangerouslySetInnerHTML={{ __html: documento.conteudo.replace(/\n/g, '<br />') }} />
            <footer>
                <button onClick={() => window.print()}>Imprimir</button>
            </footer>
        </div>
    );
};

export default ViewDocumentoGerado;
