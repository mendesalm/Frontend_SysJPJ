import React, { useState, useMemo } from 'react';
import { generatePrancha, generateConvite, generateCartao } from '../../services/documentoGeradoService';
import useAuth from '../../hooks/useAuth';

const CreateDocumentoGerado = () => {
    const [tipo, setTipo] = useState('Prancha');
    const [titulo, setTitulo] = useState('');
    const [conteudo, setConteudo] = useState('');
    const [placeholders, setPlaceholders] = useState({});
    const { user } = useAuth();

    const canCreatePrancha = useMemo(() => user?.cargos?.some(c => ["Venerável Mestre", "Secretário", "Secretário Adjunto"].includes(c.nome)), [user]);
    const canCreateConviteCartao = useMemo(() => user?.cargos?.some(c => ["Venerável Mestre", "Chanceler", "Chanceler Adjunto"].includes(c.nome)), [user]);

    const extractPlaceholders = (text) => {
        const regex = /{{(.*?)}}/g;
        const matches = text.match(regex) || [];
        return matches.map(p => p.replace(/{{|}}/g, ''));
    };

    const handleConteudoChange = (e) => {
        const text = e.target.value;
        setConteudo(text);
        const extracted = extractPlaceholders(text);
        const newPlaceholders = {};
        extracted.forEach(p => {
            newPlaceholders[p] = placeholders[p] || '';
        });
        setPlaceholders(newPlaceholders);
    };

    const handlePlaceholderValueChange = (key, value) => {
        setPlaceholders(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { titulo, conteudo, placeholders };
        try {
            let response;
            if (tipo === 'Prancha') {
                response = await generatePrancha(data);
            } else if (tipo === 'Convite') {
                response = await generateConvite(data);
            } else if (tipo === 'Cartão') {
                response = await generateCartao(data);
            }
            alert(`Documento '${response.titulo}' criado com sucesso!`);
            // Redirect or clear form
        } catch (error) {
            console.error("Erro ao criar documento:", error);
            alert("Falha ao criar documento.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Gerar Novo Documento</h2>
            <div>
                <label>Tipo de Documento:</label>
                <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                    {canCreatePrancha && <option value="Prancha">Prancha</option>}
                    {canCreateConviteCartao && <option value="Convite">Convite</option>}
                    {canCreateConviteCartao && <option value="Cartão">Cartão</option>}
                </select>
            </div>
            <div>
                <label>Título:</label>
                <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
            </div>
            <div>
                <label>Conteúdo:</label>
                <textarea value={conteudo} onChange={handleConteudoChange} rows="10" required />
                <p><small>Use `{{placeholder}}` para campos dinâmicos.</small></p>
            </div>

            {Object.keys(placeholders).length > 0 && (
                <div>
                    <h3>Valores dos Placeholders</h3>
                    {Object.keys(placeholders).map(key => (
                        <div key={key}>
                            <label>{key}:</label>
                            <input
                                type="text"
                                value={placeholders[key]}
                                onChange={(e) => handlePlaceholderValueChange(key, e.target.value)}
                            />
                        </div>
                    ))}
                </div>
            )}

            <button type="submit">Gerar Documento</button>
        </form>
    );
};

export default CreateDocumentoGerado;
