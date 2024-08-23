let selectedCotizacion = null;

function swapCurrencies() {
    const inputLabel = document.getElementById('currency-flag');
    const resultLabel = document.getElementById('result-flag');
    const inputAmount = document.getElementById('input-amount');
    const convertedAmount = document.getElementById('converted-amount');

    // Intercambiar banderas
    const tempFlag = inputLabel.innerHTML;
    inputLabel.innerHTML = resultLabel.innerHTML;
    resultLabel.innerHTML = tempFlag;

    // Limpiar los campos de entrada y salida
    inputAmount.value = '';
    convertedAmount.value = '';
}

function convertCurrency() {
    const inputAmount = parseFloat(document.getElementById('input-amount').value.replace(',', '.'));
    let convertedAmount;

    if (selectedCotizacion) {
        if (document.getElementById('currency-flag').innerHTML.includes('🇺🇸')) {
            // Conversión de USD a ARS
            convertedAmount = inputAmount * selectedCotizacion;
            document.getElementById('converted-amount').value = `$ ${convertedAmount.toFixed(2)}`;
        } else {
            // Conversión de ARS a USD
            convertedAmount = inputAmount / selectedCotizacion;
            document.getElementById('converted-amount').value = `$ ${convertedAmount.toFixed(2)}`;
        }
    }
}

document.querySelectorAll('.cotizacion-promedio, .cotizacion-compra, .cotizacion-venta').forEach(element => {
    element.addEventListener('click', function() {
        selectedCotizacion = parseFloat(this.querySelector('.cotizacion-selectable').textContent.replace('$', '').replace(',', '.'));
        convertCurrency();
        
        // Resaltar el bloque seleccionado (opcional)
        document.querySelectorAll('.cotizacion-promedio, .cotizacion-compra, .cotizacion-venta').forEach(el => {
            el.style.border = 'none'; // Restablecer el borde de otros bloques
        });
        this.style.border = '2px solid #4a69bd'; // Añadir un borde al bloque seleccionado
    });
});

document.getElementById('input-amount').addEventListener('input', convertCurrency);

function actualizarCotizacion() {
    console.log("Iniciando actualización de cotizaciones...");
    fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://www.dolarhoy.com/'))
    .then(response => response.json())
    .then(data => {
        console.log("Datos recibidos de la API.");
        let parser = new DOMParser();
        let doc = parser.parseFromString(data.contents, 'text/html');

        // Dólar Oficial
        let dolarOficialCompra = doc.querySelector('a[href="/cotizaciondolaroficial"] ~ .values .compra .val');
        let dolarOficialVenta = doc.querySelector('a[href="/cotizaciondolaroficial"] ~ .values .venta .val');

        // Dólar Blue
        let dolarBlueCompra = doc.querySelector('a[href="/cotizaciondolarblue"] ~ .values .compra .val');
        let dolarBlueVenta = doc.querySelector('a[href="/cotizaciondolarblue"] ~ .values .venta .val');
        
        // Actualizar Dólar Oficial
        if(dolarOficialCompra && dolarOficialVenta) {
            document.getElementById('dolarOficialCompra').innerText = dolarOficialCompra.textContent;
            document.getElementById('dolarOficialVenta').innerText = dolarOficialVenta.textContent;
            let oficialPromedio = calcularPromedio(dolarOficialCompra.textContent, dolarOficialVenta.textContent);
            document.getElementById('dolarOficialPromedio').innerText = oficialPromedio;
        } else {
            document.getElementById('dolarOficialCompra').innerText = `No disponible`;
            document.getElementById('dolarOficialVenta').innerText = `No disponible`;
            document.getElementById('dolarOficialPromedio').innerText = `No disponible`;
        }

        // Actualizar Dólar Blue
        if(dolarBlueCompra && dolarBlueVenta) {
            document.getElementById('dolarBlueCompra').innerText = dolarBlueCompra.textContent;
            document.getElementById('dolarBlueVenta').innerText = dolarBlueVenta.textContent;
            let bluePromedio = calcularPromedio(dolarBlueCompra.textContent, dolarBlueVenta.textContent);
            document.getElementById('dolarBluePromedio').innerText = bluePromedio;
        } else {
            document.getElementById('dolarBlueCompra').innerText = `No disponible`;
            document.getElementById('dolarBlueVenta').innerText = `No disponible`;
            document.getElementById('dolarBluePromedio').innerText = `No disponible`;
        }

        ajustarTamaños();  // Asegurar que los tamaños sean iguales después de actualizar
    })
    .catch(error => {
        console.log('Error al obtener las cotizaciones:', error);
        document.getElementById('dolarOficialCompra').innerText = `Error al cargar`;
        document.getElementById('dolarOficialVenta').innerText = `Error al cargar`;
        document.getElementById('dolarOficialPromedio').innerText = `Error al cargar`;

        document.getElementById('dolarBlueCompra').innerText = `Error al cargar`;
        document.getElementById('dolarBlueVenta').innerText = `Error al cargar`;
        document.getElementById('dolarBluePromedio').innerText = `Error al cargar`;
    });
}

function calcularPromedio(compra, venta) {
    let valorCompra = parseFloat(compra.replace('$', '').replace(',', ''));
    let valorVenta = parseFloat(venta.replace('$', '').replace(',', ''));
    return `$${((valorCompra + valorVenta) / 2).toFixed(2)}`;
}

function ajustarTamaños() {
    const bloques = document.querySelectorAll('.cotizacion-promedio, .cotizacion-compra, .cotizacion-venta');
    let maxHeight = 0;

    bloques.forEach(bloque => {
        bloque.style.height = 'auto';  // Resetear altura para recalcular
        const height = bloque.offsetHeight;
        if (height > maxHeight) maxHeight = height;
    });

    bloques.forEach(bloque => bloque.style.height = `${maxHeight}px`);
}

document.addEventListener('DOMContentLoaded', function() {
    // Inicia la actualización de cotizaciones
    actualizarCotizacion();

    // Configura un timeout para mostrar el toast si pasan 5 segundos sin recibir datos
    setTimeout(function() {
        const cargandoText = document.querySelectorAll('.cotizacion-selectable');
        let allStillLoading = true;

        cargandoText.forEach(function(element) {
            if (!element.textContent.includes('Cargando...')) {
                allStillLoading = false;
            }
        });

        if (allStillLoading) {
            M.toast({html: 'Por favor, ten paciencia. La actualización puede demorar unos segundos.'});
        }
    }, 5000); // 5000 milisegundos = 5 segundos
});

// Prevenir el comportamiento predeterminado de los formularios
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(event) {
        event.preventDefault();
    });
});
