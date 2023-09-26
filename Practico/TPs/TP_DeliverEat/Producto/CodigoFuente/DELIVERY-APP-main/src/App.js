import { useEffect, useState } from 'react';
import './App.css';
import { db } from './firebase.js';
import { arrayUnion, doc, getDoc, runTransaction,} from "firebase/firestore"; 


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

  const [formaPago, setFormaPago] = useState("")
  const [nroTarjeta, setNroTarjeta] = useState("")
  const [nombreTitular, setNombreTitular] = useState("")

  const [vtoTarjeta, setVtoTarjeta] = useState("")
  const [cvc, setCvc] = useState("")
  const [montoEfectivo, setMontoEfectivo] = useState("")
  const [vuelto, setVuelto]  = useState("")


  const [fechaEntrega, setFechaEntrega] = useState("")
  const [antesPosible, setAntesPosible] = useState(false)

  const [prev, setPrev] = useState(null);

  const [distancia, setDistancia] = useState("")

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const minDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;


  const addDistanceDocument = async () => {
    // Calculate a random distance between 1000 and 2000
    var distance = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;

    // Create the data for the document
    const data = {
      address1: `${ciudad} ${calle} ${numero}`,
      address2: `${miCiudad} ${miCalle} ${miNumero}`,
      distance: distance,
    };

    try {
      // Get a reference to the "distances" document
      const distancesDocRef = doc(db, 'distances', '1');

      // Use a transaction to check if the pair already exists
      await runTransaction(db, async (transaction) => {
        const distancesDoc = await transaction.get(distancesDocRef);

        // Check if the pair already exists in the "distancias" array
        const existingDistancias = distancesDoc.data()?.distancias || [];
        const pairExists = existingDistancias.some(
          (item) =>
            item.address1 === data.address1 && item.address2 === data.address2
        );

        if (!pairExists) {
          // If the pair doesn't exist, update the document with the new data
          transaction.update(distancesDocRef, {
            distancias: arrayUnion(data),
          });
          setDistancia(data.distance);
          setTotal(distance/100 * 50)

          console.log('distance added successfully');
        }
        else{
          const existingDistancesDoc = await getDoc(distancesDocRef);
          const existingDistancias = existingDistancesDoc.data().distancias;
                      
          // Find the existing distance based on address1 and address2
          const existingDistance = existingDistancias.find(
            (item) =>
              item.address1 === data.address1 && item.address2 === data.address2
          );

          if (existingDistance) {
            distance = (existingDistance.distance);
            setTotal(distance/100 * 50)

          } else {
            console.log("Existing distance not found.");
          }

          console.log("ya existe!")
        }

      });

    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  // formato fecha
  const handleExpirationDateChange = (event) => {
    const inputValue = event.target.value;
    // Allow only numeric characters and a maximum length of 5
    const formattedValue = inputValue.replace(/\D/g, '').slice(0, 4);

    // Format the value as MM/YY
    if (formattedValue.length >= 2) {
      const formattedDate = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2);
      setVtoTarjeta(formattedDate);
    } else {
      setVtoTarjeta(formattedValue);
    }
  };

  // pa que muestre la foto
  useEffect(() => {
    if (foto) {
      setPrev (URL.createObjectURL(foto))
    }
    else {
      setPrev (null)
    }
    
  }, [foto])

useEffect(() => {
  calcularVuelto()


}, [montoEfectivo])

  const calcularVuelto = () => {
    setVuelto(montoEfectivo-total)
  }

  // form submit
  const handleSubmit = (event) => {
    event.preventDefault();

    switch (seccion) {
      case "datos":
        addDistanceDocument()
        setSeccion("pago")
        break;
      case "pago":
        if (parseFloat(montoEfectivo) < parseFloat(total)) {
          alert('Ingresá un numero mayor o igual al total a pagar!');
        } else {
          setSeccion("resumen")
        }
        break;
      default:
        break;
    }
  };

  //ir para atras
  const goBack = () => {
    switch (seccion) {
      case "pago":
        setTotal("")
        setFormaPago("")
        setMontoEfectivo("")
        setSeccion("datos")
        break;
      case "resumen":
        setSeccion("pago")
        break;
      default:
        break;
    }
  }

  const handleCityChange = (event) => {
    setCiudad(event.target.value)
    setMiCiudad(event.target.value)
  }

  // calculo distancia
  // useEffect(() => {
  //   const addDistanceDocument = async () => {
  //     // Calculate a random distance between 1000 and 2000
  //     const distance = Math.floor(Math.random() * 2000) + 1;
  
  //     // Create the data for the document
  //     const data = {
  //       address1: `${ciudad} ${calle} ${numero}`,
  //       address2: `${miCiudad} ${miCalle} ${miNumero}`,
  //       distance: distance,
  //     };
  
  //     try {
  //       // Get a reference to the "distances" document
  //       const distancesDocRef = doc(db, 'distances', '1');
  
  //       // Use a transaction to check if the pair already exists
  //       await runTransaction(db, async (transaction) => {
  //         const distancesDoc = await transaction.get(distancesDocRef);
  
  //         // Check if the pair already exists in the "distancias" array
  //         const existingDistancias = distancesDoc.data()?.distancias || [];
  //         const pairExists = existingDistancias.some(
  //           (item) =>
  //             item.address1 === data.address1 && item.address2 === data.address2
  //         );
  
  //         if (!pairExists) {
  //           // If the pair doesn't exist, update the document with the new data
  //           transaction.update(distancesDocRef, {
  //             distancias: arrayUnion(data),
  //           });
  //           setDistancia(data.distance);
            


  //         }
  //         else{
  //           const existingDistancesDoc = await getDoc(distancesDocRef);
  //           const existingDistancias = existingDistancesDoc.data().distancias;
                        
  //           // Find the existing distance based on address1 and address2
  //           const existingDistance = existingDistancias.find(
  //             (item) =>
  //               item.address1 === data.address1 && item.address2 === data.address2
  //           );

  //           if (existingDistance) {
  //             setDistancia(existingDistance.distance);
  //           } else {
  //             console.log("Existing distance not found.");
  //           }

  //           console.log("ya existe!")
  //         }
  //       });
  
  //       console.log('Document added successfully');
  //     } catch (error) {
  //       console.error('Error adding document: ', error);
  //     }
  //   };
  
  //   if (calle !== "" && numero !== "" && ciudad !== "" && miCalle !== "" && miNumero !== "" && miCiudad !== "") {
  //     addDistanceDocument()
  //   }
  // }, [calle, numero, ciudad, miCalle, miNumero, miCiudad ])

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];
  
    // Check if a file is selected
    if (!selectedFile) {
      return;
    }
  
    // Check the file size
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

    if (selectedFile.size > maxSizeInBytes) {
      alert('El tamaño del archivo supera el tamaño máximo permitido (5MB).');
      e.target.value = null; // Clear the file input
      return;
    }
  
    // If the file size is within the limit, you can proceed with handling the file.
    setFoto(selectedFile);
  }

  return (
    
    <div className="App bg">

      {/* logo-titulo */}
      <div className='logo glassmorphism'>
        <h1 style={{display:'flex', margin:'auto'}}>Lo que sea!</h1>
      </div>
      
      <div className='container glassmorphism'>
        
        <form className='form' onSubmit={handleSubmit}>
            
            {/* boton de back */}
            {seccion !== "datos" && <button  type="button" onClick={() => goBack()} className="go-back-button">
              <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </button>}
            
            {/* ---SECCIONES--- */}

            {seccion === "datos" && (
              <>
                {/* Encargo */}
                <div className='form-item'>
                  <label htmlFor='encargo'><b>Que necesitás?*</b></label>
                  <input
                    className='input'
                    id='encargo'
                    name='encargo'
                    value={encargo}
                    onChange={event => setEncargo(event.target.value)}
                    type='text'
                    required
                  />
                </div>

                {/* Foto */}
                <div className='form-item'>
                <label htmlFor='foto'>Foto del producto (opcional)</label>
                  <div className='subirfoto glassmorphism' style={{display: "flex", flexDirection:'column', margin:'auto'}}>

                    <label style={{display: "flex", flexDirection:'row', margin:'auto', gap:'5px'}} htmlFor='foto'>
                    <p>Subir</p>
                    <svg style={{display: "flex", margin:'auto'}} width="40px" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                    </label>
                    
                    <input
                      id='foto'
                      name='foto'
                      type='file'
                      hidden
                      accept="image/jpeg"                      
                      // onChange={e => setFoto(e.target.files[0])}
                      onChange={handleFileChange}
                    />

                  </div>
                </div>

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
                    // onChange={event => setCiudad(event.target.value)}
                    onChange={handleCityChange}

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
                    value={ciudad}
                    required
                    disabled
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

                  <div>{distancia}</div>
                </div>


                {/* Fecha entrega */}
                <div className='form-item'>
                  <div style={{display: 'flex', flexDirection:'row', gap:'30px'}}>
                    <b>Fecha de entrega</b> 
                    <div>
                      <input type="checkbox" id='antes' checked={antesPosible} onChange={() => setAntesPosible(!antesPosible)}/>          
                      <label htmlFor='antes'>Lo antes posible</label>
                    </div>
                  </div>
                  <input className='input' type='datetime-local' min={minDateTime} required disabled={antesPosible} value={fechaEntrega} onChange={event => setFechaEntrega(event.target.value)}/>
                </div>
              </>

            )}

            {seccion === "pago" && (
              <>
                {/* Pago */}
                <div className='form-item'>
                  <div><b>Forma de pago</b></div>
                  <div className='radio-group'>
                    <div>
                      <input
                        type="radio"
                        id="tarjeta"
                        name="tipopago"
                        value="tarjeta"
                        onChange={event => setFormaPago(event.target.value)}
                        required
                      />
                      <label htmlFor="tarjeta">Tarjeta debito/credito</label>
                    </div>
                  
                    <div>
                      <input
                        type="radio"
                        id="efectivo"
                        name="tipopago"
                        value="efectivo"
                        onChange={event => setFormaPago(event.target.value)}
                      />
                      <label htmlFor="efectivo">Efectivo</label>
                    </div>
                  </div>
                  
                  {formaPago === "efectivo" && 
                    <>
                      <label htmlFor='montoEfectivo'>Con cuanto vas a pagar?</label>
                      <input
                        className='input'
                        id='montoEfectivo'
                        name='montoEfectivo'
                        type='text'
                        value={montoEfectivo}
                        onChange={event => setMontoEfectivo(event.target.value)}
                        pattern="\d*"
                        required
                        min={parseFloat(total)}
                      />
                      {vuelto > 0  ? 
                      <label style={{width:"300px", fontSize:'15px'}} >Vuelto: ${parseFloat(vuelto).toFixed(2)}</label>
                      :
                      <label style={{width:"300px"}}>Ingresá un numero mayor o igual al total a pagar!</label>

                      }

                    </>
                  }   

                  {formaPago === "tarjeta" && 
                    <>
                      <label htmlFor='nroTarjeta'>Numero tarjeta</label>
                      <input
                        className='input'
                        id='nroTarjeta'
                        name='nroTarjeta'
                        type='text'
                        value={nroTarjeta}
                        onChange={event => setNroTarjeta(event.target.value)}
                        pattern="4\d{12,15}" //empieza en 4 (visa)
                        maxLength="16" //maximo 16 digit
                        minLength="13" //minimo 13 digit
                        required

                      />

                      <label htmlFor='nombreTitular'>Nombre del titular</label>
                      <input
                        className='input'
                        id='nombreTitular'
                        name='nombreTitular'
                        type='text'
                        value={nombreTitular}
                        onChange={event => setNombreTitular(event.target.value)}
                        required
                      />

                      <div style={{display: 'flex', flexDirection:'row', gap:'60px', width:'300px'}}>
                        <div style={{width:'50%'}}>
                          <label htmlFor='vtoTarjeta'>Fecha Venc.</label>
                          <input
                            className='input'
                            id='vtoTarjeta'
                            name='vtoTarjeta'
                            style={{ width: '100%' }}
                            type='text'
                            placeholder='MM/YY'
                            value={vtoTarjeta}
                            onChange={handleExpirationDateChange}
                            required
                          />
                        </div>
                        
                        <div style={{width:'30%'}}>
                          <label htmlFor='cvc'>CVC</label>
                          <input
                            className='input'
                            id='cvc'
                            name='cvc'
                            style={{width:'100%'}}
                            value={cvc}
                            onChange={event => setCvc(event.target.value)}
                            type='text'
                            pattern="\d*"
                            maxLength="3"
                            minLength="3"
                            required
                          />
                        </div>
                      </div>
                    </>
                  } 
                </div>
              </>

            )}

            {seccion === "resumen" && (
              <div className='summary'> 
                <h2>Resumen del pedido</h2>
                <div><b>Encargo:</b> {encargo}</div>
                {foto && 
                  <div style={{display:'flex', flexDirection:'column', padding:'10px'}}>
                    <b>Foto:</b>
                  <img src={prev} alt={foto} style={{height: "200px", width: "200px", objectFit:'cover', marginInline:'auto', }} />
                </div>}
                <div style={{height:'10px'}}/>

                <div><b>Domicilio del comercio:</b> {calle} {numero}, {ciudad}</div>
                <div><b>Referencia:</b> {referencia}</div>
                <div style={{height:'10px'}}/>

                <div><b>Mi domicilio:</b> {miCalle} {miNumero}, {miCiudad}</div>
                <div><b>Referencia:</b> {miReferencia}</div>
                <div style={{height:'10px'}}/>

                <div><b>Total:</b> {total}</div>
                <div><b>Forma de Pago:</b> {formaPago === "tarjeta" ? "Visa terminada en *"+ nroTarjeta.slice(-3) : "Efectivo"}</div>
                {formaPago === "efectivo" && 
                  <>
                    <div><b>Vas a pagar con:</b> ${montoEfectivo}</div>
                    <div><b>Tu vuelto:</b> ${vuelto}</div>
                  </>
                }
                <div style={{height:'10px'}}/>

                <div><b>Fecha de Entrega:</b> {antesPosible ? 'Lo antes posible' : fechaEntrega.replace("T", " ")}</div>
              </div>
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
        {(seccion !== "datos" && total) &&  (
          <div className='total glassmorphism swing-in-bottom-bck'>
            <div>Total a pagar: ${parseFloat(total).toFixed(2)}</div>
          </div>
        )}

      
      </div>

    </div>
  );
}

export default App;
