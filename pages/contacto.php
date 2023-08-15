<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = $_POST["nombre"];
    $email = $_POST["email"];
    $consulta = $_POST["consulta"];

    // Dirección de correo del desarrollador (cambiar por el correo del destinatario)
    $correo_desarrollador = "jorgeangelpaez@gmail.com";

    // Asunto del correo
    $asunto_desarrollador = "Consulta de Contacto";

    // Cuerpo del correo para el desarrollador
    $mensaje_desarrollador = "Hola Jorge,\n\n";
    $mensaje_desarrollador .= "Has recibido una nueva consulta de contacto:\n\n";
    $mensaje_desarrollador .= "Nombre: $nombre\n";
    $mensaje_desarrollador .= "Email: $email\n";
    $mensaje_desarrollador .= "Consulta:\n$consulta\n\n";
    $mensaje_desarrollador .= "Por favor, responde a esta consulta a la brevedad.\n\n";
    $mensaje_desarrollador .= "Saludos,\nTu Sitio Web";

    // Enviar correo al desarrollador
    mail($correo_desarrollador, $asunto_desarrollador, $mensaje_desarrollador);

    // Correo de confirmación para el remitente
    $asunto_remitente = "Gracias por tu consulta";
    $mensaje_remitente = "Hola $nombre,\n\n";
    $mensaje_remitente .= "Gracias por ponerte en contacto con nosotros. Hemos recibido tu consulta y te responderemos a la brevedad.\n\n";
    $mensaje_remitente .= "Saludos,\nTu Sitio Web";
    
    // Enviar correo de confirmación al remitente
    mail($email, $asunto_remitente, $mensaje_remitente);

    // Redirigir a una página de confirmación
    header("Location: confirmacion.html");
    exit();
}
?>
