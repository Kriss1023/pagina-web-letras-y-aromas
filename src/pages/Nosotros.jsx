import React from 'react'

function Nosotros() {
  return (
    <main>
      {/* PRESENTACIÓN DE NOSOTROS */}

      <section class="pagina-hero nosotros-hero">

        <span class="etiqueta">Conócenos</span>

        <h1>Nosotros</h1>

        <p>
          Detrás de cada libro hay una historia
          y detrás de cada aroma, un recuerdo.
          Descubre lo que hace especial a
          Letras & Aromas.
        </p>
      </section>

      {/* NUESTRA HISTORIA */}

      <section
        class="nosotros-historia"
        id="nuestra-historia">

        <div class="nosotros-texto">

          <span class="etiqueta">Nuestra esencia</span>

          <h2>Nuestra historia</h2>

          <p>
            Letras & Aromas nació de una idea sencilla:
            unir dos pequeños placeres que pueden
            transformar un día común en un momento
            especial: la lectura y los aromas.
          </p>

          <p>
            Creemos que un buen libro tiene la capacidad
            de transportarnos a otros lugares, despertar
            emociones y acompañarnos incluso después de
            haber terminado su última página.
          </p>

          <p>
            Las velas, por su parte, nos invitan a
            detenernos un instante. Su luz tenue y sus
            aromas ayudan a crear ambientes acogedores
            donde podemos descansar, leer o simplemente
            disfrutar de nuestra tranquilidad.
          </p>

          <p>
            Por eso decidimos reunir libros y velas en
            un mismo espacio. Queremos que cada persona
            encuentre una historia que la inspire y un
            aroma que haga ese momento todavía más especial.
          </p>

          <p>
            Más que ofrecer productos, buscamos compartir
            experiencias, acercarnos a quienes disfrutan
            de los pequeños detalles y construir una
            comunidad donde las historias y los recuerdos
            tengan un lugar especial.
          </p>
        </div>

        <div class="nosotros-imagen">

          <img
            src="images/eucalipto.jpg"
            alt="Vela de eucalipto de Letras & Aromas"
            loading="lazy" />
        </div>
      </section>

      {/* UNETE A NUESTRA COMUNIDAD */}

      <section class="comunidad" id="comunidad">

        <div class="comunidad-contenido">

          <span class="etiqueta">Mantente al día</span>

          <h2>Únete a nuestra comunidad</h2>

          <p>
            Queremos que seas parte de Letras & Aromas.
            Suscríbete para conocer nuestras próximas
            ofertas, nuevos libros, velas y recomendaciones
            pensadas para ti.
          </p>

          <p>
            Descubre nuestras novedades y recibe
            información sobre productos y
            actividades especiales.
          </p>

          {/* Formulario único de suscripción */}
          <form class="form-newsletter" id="formularioNewsletter" onsubmit="suscribirse(event)">

            <input
              type="email"
              id="correoNewsletter"
              name="correo"
              placeholder="Tu correo electrónico"
              aria-label="Tu correo electrónico"
              autocomplete="email"
              maxlength="254"
              required />

            <button type="submit">
              Suscribirme
            </button>

            <label class="aceptacion" for="aceptoComunidad">

              <input
                type="checkbox"
                id="aceptoComunidad"
                required /> <span>
                Aceptar recibir novedades y promociones de Letras & Aromas por correo electrónico.
              </span>
            </label>
          </form>

          {/* Resultado de la suscripción */}
          <p
            id="estadoSuscripcion"
            class="mensaje-suscripcion"
            role="status"
            aria-live="polite">
          </p>
        </div>
      </section>

      {/* CONTACTO CON MONGODB */}

      <section class="contacto-seccion" id="contacto">

        <div class="titulo contacto-titulo">

          <span>Estamos para ayudarte</span>

          <h2>Contáctanos</h2>

          <p>
            ¿Tienes alguna pregunta sobre nuestros libros, velas o servicios? Escríbenos y estaremos encantados de atenderte.
          </p>
        </div>

        <div class="contacto-contenedor">

          <form class="contacto-formulario" id="formularioContacto">

            {/* Nombre y correo */}
            <div class="grupo-campos">

              <div class="campo">

                <label for="nombreContacto">
                  Nombre
                </label>

                <input
                  type="text"
                  id="nombreContacto"
                  name="nombre"
                  placeholder="Tu nombre"
                  autocomplete="name"
                  maxlength="100"
                  required />
              </div>

              <div class="campo">

                <label for="emailContacto">
                  Correo electrónico
                </label>

                <input
                  type="email"
                  id="emailContacto"
                  name="email"
                  placeholder="Tu correo electrónico"
                  autocomplete="email"
                  maxlength="254"
                  required />
              </div>
            </div>

            {/* Asunto */}
            <div class="campo">

              <label for="asuntoContacto">
                Asunto
              </label>

              <input
                type="text"
                id="asuntoContacto"
                name="asunto"
                placeholder="¿Sobre qué deseas escribirnos?"
                maxlength="150"
                required />
            </div>

            {/* Mensaje */}
            <div class="campo">

              <label for="mensajeContacto">
                Mensaje
              </label>

              <textarea
                id="mensajeContacto"
                name="mensaje"
                rows="6"
                maxlength="2000"
                placeholder="Escribe aquí tu mensaje..."
                required></textarea>
            </div>
          </form>

          <button type="submit" class="btn-principal">
            Enviar mensaje
          </button>

          <p
            id="respuestaContacto"
            role="status"
            aria-live="polite">
          </p>
        </div>
      </section>
    </main>
  )
}

export default Nosotros