import React, { useState, useEffect, useRef, useMemo } from 'react';
//import { useAuth } from '../../hooks/useAuth';
import { getHarmoniaItens } from '../../../services/harmoniaService';
import './PlayerPage.css';

const PlayerPage = () => {
  const [itens, setItens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [selectedSubcategoria, setSelectedSubcategoria] = useState('');
  const [currentSong, setCurrentSong] = useState(null);
  
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchItens = async () => {
      try {
        const response = await getHarmoniaItens();
        setItens(response.data);
      } catch (err) {
        setError('Falha ao carregar o acervo de harmonia.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItens();
  }, []);

  const categorias = useMemo(() => {
    const cats = new Set(itens.map(item => item.categoria).filter(Boolean));
    return Array.from(cats);
  }, [itens]);

  const subcategorias = useMemo(() => {
    if (!selectedCategoria) return [];
    const subs = new Set(itens.filter(item => item.categoria === selectedCategoria).map(item => item.subcategoria).filter(Boolean));
    return Array.from(subs);
  }, [itens, selectedCategoria]);

  const handlePlaySong = () => {
    if (!selectedCategoria || !selectedSubcategoria) {
      alert("Por favor, selecione uma categoria e subcategoria.");
      return;
    }
    const playlist = itens.filter(item => item.categoria === selectedCategoria && item.subcategoria === selectedSubcategoria);
    if (playlist.length > 0) {
      // Toca uma música aleatória da seleção
      const randomSong = playlist[Math.floor(Math.random() * playlist.length)];
      setCurrentSong(randomSong);
    } else {
      alert("Nenhuma música encontrada para a seleção atual.");
    }
  };

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = `http://localhost:3001/${currentSong.path}`;
      audioRef.current.play().catch(e => console.error("Erro ao tocar áudio:", e));
    }
  }, [currentSong]);
  
  const handleStop = () => {
      if(audioRef.current){
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
      }
      setCurrentSong(null);
  }

  if (isLoading) return <div className="main-content-wrapper">A carregar...</div>;
  if (error) return <div className="main-content-wrapper error-message">{error}</div>;

  return (
    <div className="player-body-wrapper">
      <div className="main-content-wrapper">
        <header>
          <h1>Harmonia Virtual</h1>
          <p>A melhor ferramenta para o Mestre de Harmonias!</p>
        </header>

        <section className="player-section">
          <div className="dropdown-controls-container">
            <div>
              <label htmlFor="categoriaDropdown">Escolha a Categoria:</label>
              <select id="categoriaDropdown" className="custom-dropdown" value={selectedCategoria} onChange={e => { setSelectedCategoria(e.target.value); setSelectedSubcategoria(''); setCurrentSong(null); }}>
                <option value="">-- Selecione --</option>
                {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="subcategoriaDropdown">Selecione a Subcategoria:</label>
              <select id="subcategoriaDropdown" className="custom-dropdown" value={selectedSubcategoria} onChange={e => {setSelectedSubcategoria(e.target.value); setCurrentSong(null);}} disabled={!selectedCategoria}>
                <option value="">-- Selecione --</option>
                {subcategorias.map(sub => <option key={sub} value={sub}>{sub}</option>)}
              </select>
            </div>
            <button onClick={handlePlaySong} className="action-button play-button-style" disabled={!selectedSubcategoria}>
              Tocar Música
            </button>
          </div>

          <div className="current-song-info-single">
            <p className="title">{currentSong?.titulo || 'Nenhuma música selecionada'}</p>
            <p className="artist">{currentSong?.autor || ''}</p>
          </div>

          <audio ref={audioRef} controls className="audio-player" />
          
          <div className="buttons-footer-container">
            <button onClick={handleStop} className="action-button stop-advance-button-style small-reset-button">Parar</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PlayerPage;
