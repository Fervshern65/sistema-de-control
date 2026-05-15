import React, { useState, useEffect } from 'react';

function App() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch('http://localhost:5000/productos');
      const datos = await respuesta.json();
      setProductos(datos);
    } catch (error) {
      console.error("Error en la Pokédex:", error);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  const agregarProducto = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, precio, stock })
      });
      setNombre(''); setPrecio(''); setStock('');
      obtenerProductos();
    } catch (error) {
      console.error("Error al capturar:", error);
    }
  };

  const eliminarProducto = async (id) => {
    if (window.confirm("¿Liberar este registro al mundo Pokémon? 🔴")) {
      try {
        await fetch(`http://localhost:5000/productos/${id}`, { method: 'DELETE' });
        obtenerProductos();
      } catch (error) {
        console.error("Error al liberar:", error);
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img 
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/6.gif" 
          alt="Charizard" 
          style={styles.charizard} 
        />
        <img 
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/25.gif" 
          alt="Pikachu" 
          style={styles.pikachu} 
        />

        <div style={styles.header}>
          <div style={styles.pokeIcon}>
             <div style={styles.pokeTop}></div>
             <div style={styles.pokeCenter}></div>
          </div>
          <h1 style={styles.title}>POKÉ-INVENTORY</h1>
          <p style={styles.subtitle}>SISTEMA DE CONTROL FASTECH</p>
        </div>
        
        <form onSubmit={agregarProducto} style={styles.form}>
          <input 
            style={styles.input} type="text" placeholder="NOMBRE DEL OBJETO" 
            value={nombre} onChange={(e) => setNombre(e.target.value)} required 
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              style={styles.input} type="number" placeholder="PRECIO" 
              value={precio} onChange={(e) => setPrecio(e.target.value)} required 
            />
            <input 
              style={styles.input} type="number" placeholder="STOCK" 
              value={stock} onChange={(e) => setStock(e.target.value)} required 
            />
          </div>
          <button 
            type="submit"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              ...styles.btn,
              backgroundColor: isHovered ? '#ff1f1f' : '#cc0000',
              transform: isHovered ? 'scale(1.02)' : 'scale(1)',
            }}
          >
            ¡CAPTURAR DATOS! 🔴
          </button>
        </form>

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>OBJETO</th>
                <th style={styles.th}>CANTIDAD</th>
                <th style={styles.th}>ACCIÓN</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id} style={styles.tr}>
                  <td style={styles.td}>#{p.id}</td>
                  <td style={{...styles.td, fontWeight: 'bold', color: '#fff'}}>{p.nombre.toUpperCase()}</td>
                  <td style={styles.td}>
                    <span style={{ color: p.stock < 5 ? '#ff4d4d' : '#00ffcc', fontWeight: 'bold' }}>
                      {p.stock} UDS
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button onClick={() => eliminarProducto(p.id)} style={styles.btnDelete}>
                      LIBERAR
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { backgroundColor: '#0a0a0a', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', padding: '20px' },
  card: { backgroundColor: '#1c1c1c', border: '3px solid #333', padding: '30px', borderRadius: '15px', boxShadow: '0 15px 40px rgba(0,0,0,0.6)', width: '100%', maxWidth: '500px', position: 'relative' },
  charizard: { position: 'absolute', top: '-60px', right: '-30px', width: '100px' },
  pikachu: { position: 'absolute', top: '100px', left: '-40px', width: '70px' },
  header: { textAlign: 'center', marginBottom: '25px' },
  title: { color: '#fff', fontSize: '24px', letterSpacing: '1px', margin: '5px 0' },
  subtitle: { color: '#cc0000', fontSize: '10px', fontWeight: 'bold', letterSpacing: '2px' },
  pokeIcon: { width: '30px', height: '30px', margin: '0 auto', borderRadius: '50%', border: '2px solid #fff', overflow: 'hidden', position: 'relative' },
  pokeTop: { height: '50%', backgroundColor: '#cc0000' },
  pokeCenter: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '8px', height: '8px', backgroundColor: '#fff', border: '2px solid #333', borderRadius: '50%' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '25px' },
  input: { padding: '10px', backgroundColor: '#262626', border: '1px solid #333', color: '#fff', outline: 'none', borderRadius: '5px' },
  btn: { padding: '12px', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderRadius: '8px', transition: '0.2s' },
  btnDelete: { background: '#ff4d4d', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '10px' },
  tableContainer: { backgroundColor: '#141414', border: '1px solid #333', borderRadius: '8px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px', textAlign: 'left', color: '#555', fontSize: '10px', borderBottom: '1px solid #333' },
  tr: { borderBottom: '1px solid #222' },
  td: { padding: '12px', color: '#aaa', fontSize: '13px' }
};

// ESTA LÍNEA ES LA QUE TE ARREGLA EL ERROR:
export default App;