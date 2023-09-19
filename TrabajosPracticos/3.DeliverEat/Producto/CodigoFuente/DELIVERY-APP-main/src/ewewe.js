import { useEffect, useState } from 'react';
import './App.css';


function App() {
  const [seccion, setSeccion] = useState("datos")

  const [encargo, setEncargo] = useState("")
  const [foto, setFoto] = useState(null)

  const [calle, setCalle] = useState("")
  const [numero, setNumero] = useState("")
  const [ciudad, setCiudad] = useState("")
  const [referencia, setReferencia] = useState("")


  const [miCalle, setMiCalle] = useState("")
  const [miNumero, setMiNumero] = useState("")
  const [miCiudad, setMiCiudad] = useState("")
  const [miReferencia, setMiReferencia] = useState("")

  const [total, setTotal] = useState("")




  return (
    
    <div className="App bg">
      
      <div className='container glassmorphism'>
        
        <form className='form' onSubmit={handleSubmit}>
            
            {/* ---SECCIONES--- */}

            {seccion === "datos" && (
              <>
                {/* Encargo */}

                {/* direccion comercio */}
                <div className='form-item'>
                  <div><b>Direccion del comercio</b></div>

                  <label htmlFor='calle'>Calle</label>
                  <input
                    className='input'
                    id='calle'
                    name='calle'
                    type='text'
                    value={calle}
                    onChange={event => setCalle(event.target.value)}
                    required
                  />

                  <label htmlFor='numero'>Nº</label>
                  <input
                    className='input'
                    id='numero'
                    name='numero'
                    type='text'
                    value={numero}
                    onChange={event => setNumero(event.target.value)}
                    required
                  />
                  
                  <label htmlFor='ciudad'>Ciudad</label>
                  <select
                    className='input'
                    id='ciudad'
                    name='ciudad'
                    value={ciudad}
                    onChange={event => setCiudad(event.target.value)}
                    required
                  >
                    <option value="">Selecciona tu ciudad</option>
                    <option value="Cordoba">Cordoba</option>
                    <option value="Mendiolaza">Mendiolaza</option>
                    <option value="Villa Allende">Villa Allende</option>
                    <option value="Bell Ville">Bell Ville</option>
                  </select>

                  <label htmlFor='referencia'>Referencia (opcional)</label>
                  <input
                    className='input'
                    id='referencia'
                    name='referencia'
                    type='text'
                    value={referencia}
                    onChange={event => setReferencia(event.target.value)}              
                  />
                </div>

                {/* domicilio comprador */}
                <div className='form-item'>
                  <div><b>Tu domicilio</b></div>

                  <label htmlFor='miCalle'>Calle</label>
                  <input
                    className='input'
                    id='miCalle'
                    name='miCalle'
                    type='text'
                    value={miCalle}
                    onChange={event => setMiCalle(event.target.value)}
                    required
                  />

                  <label htmlFor='miNumero'>Nº</label>
                  <input
                    className='input'
                    id='miNumero'
                    name='miNumero'
                    type='text'
                    value={miNumero}
                    onChange={event => setMiNumero(event.target.value)}
                    required
                  />
                  
                  <label htmlFor='miCiudad'>Ciudad</label>
                  <select
                    className='input'
                    id='miCiudad'
                    name='miCiudad'
                    value={miCiudad}
                    onChange={event => setMiCiudad(event.target.value)}
                    required
                  >
                    <option value="">Selecciona tu ciudad</option>
                    <option value="Cordoba">Cordoba</option>
                    <option value="Mendiolaza">Mendiolaza</option>
                    <option value="Villa Allende">Villa Allende</option>
                    <option value="Bell Ville">Bell Ville</option>
                  </select>

                  <label htmlFor='miReferencia'>Referencia (opcional)</label>
                  <input
                    className='input'
                    id='miReferencia'
                    name='miReferencia'
                    type='text'
                    value={miReferencia}
                    onChange={event => setMiReferencia(event.target.value)}
                  />
                </div>

              </>

            )}
            
            {/* Boton Submit */}
            {seccion !== "resumen" && (
              <div className='form-item'>
                <button className='submit-button' type='submit'>Aceptar</button>          
              </div>
            )}
        </form>
    
        <div style={{height:'30px'}}/>

        {/* Total pagar */}
        <div className='total glassmorphism'>
          <div>Total a pagar: {total}</div>
        </div>
      
      </div>

    </div>
  );
}

export default App;