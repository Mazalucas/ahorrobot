document.addEventListener('DOMContentLoaded', function() {
    // Inicializar EmailJS con tu clave pública
    emailjs.init("c7RqUYBZIf3GFMVJy");

    // Inicializar tooltips y modales de Materialize
    var tooltipElems = document.querySelectorAll('.tooltipped');
    M.Tooltip.init(tooltipElems);

    var modalElems = document.querySelectorAll('.modal');
    M.Modal.init(modalElems);

    // Manejar el envío del formulario de contacto
    document.getElementById('contactForm').addEventListener('submit', function(event) {
        event.preventDefault();
        emailjs.sendForm('service_x905gv7', 'template_hfnvuup', this)
            .then(function() {
                M.toast({html: 'Mensaje enviado con éxito', classes: 'rounded'});
                var instance = M.Modal.getInstance(document.getElementById('contactModal'));
                instance.close();
            }, function(error) {
                M.toast({html: 'Error al enviar el mensaje', classes: 'rounded'});
            });
    });
});
