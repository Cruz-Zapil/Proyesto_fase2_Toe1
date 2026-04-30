-- ============================================================================
-- SYSHUB DATABASE SCHEMA
-- Ecosistema digital de aprendizaje continuo - Fase 2
-- PostgreSQL 12+
-- ============================================================================

-- ============================================================================
-- SYSHUB DATABASE SCHEMA (FIXED)
-- PostgreSQL 18+
-- ============================================================================

-- Extensiones (usar solo pgcrypto)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================================
-- MÓDULO 1: IDENTIDAD Y ACCESO
-- ============================================================================

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- DOMINIOS EMAIL
-- ============================================================================

CREATE TABLE dominios_permitidos (
    dominio VARCHAR(100) PRIMARY KEY
);

--- =====================
--- tipo de estados de usuario: activo, suspendido, eliminado 
--- =====================


CREATE TYPE estado_usuario AS ENUM ('activo','pendiente' ,'suspendido', 'eliminado');
CREATE TYPE estado_carrera_usuario AS ENUM ('activo','suspendido', 'abandonado', 'finalizado');
CREATE TYPE estado_inscripcion AS ENUM ('inscrito','retirado','aprobado','reprobado');



--- apellidos 
--- telefono
--- registro academico

CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    telefono_casa VARCHAR(20),
    registro_academico VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol_id UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    estado estado_usuario DEFAULT 'pendiente',

    token_verificacion VARCHAR(255),
    email_verificado_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);




CREATE TABLE division (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE carreras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(150) UNIQUE NOT NULL,
    codigo VARCHAR(50) UNIQUE,
    facultad VARCHAR(150),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    division_id UUID REFERENCES division(id) ON DELETE SET NULL
);




CREATE TABLE usuario_carrera (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    carrera_id UUID NOT NULL REFERENCES carreras(id) ON DELETE CASCADE,
    estado estado_carrera_usuario DEFAULT 'activo',
    fecha_inicio DATE NOT NULL, fecha_fin DATE,
    es_principal BOOLEAN DEFAULT false, 
    created_at TIMESTAMP DEFAULT NOW() );

           -- índice correcto (fuera del CREATE TABLE) 
    CREATE UNIQUE INDEX unica_carrera_activa ON usuario_carrera(usuario_id, carrera_id) WHERE estado = 'activo';
    CREATE UNIQUE INDEX unica_principal ON usuario_carrera(usuario_id) WHERE es_principal = true;





-- ============================================================================
-- 2 academico 
-- ============================================================================

CREATE TABLE cursos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    carrera_id UUID REFERENCES carreras(id) ON DELETE SET NULL,
    semestre INTEGER NOT NULL CHECK (semestre > 0),
    activo BOOLEAN DEFAULT true,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE carrera_curso (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    carrera_id UUID NOT NULL REFERENCES carreras(id) ON DELETE CASCADE,
    curso_id UUID NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
    semestre INTEGER NOT NULL CHECK (semestre > 0),
    obligatorio BOOLEAN ,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(carrera_id, curso_id)
);

CREATE TABLE curso_oferta (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curso_id UUID NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
    carrera_id UUID NOT NULL REFERENCES carreras(id) ON DELETE CASCADE,
    seccion VARCHAR(10),
    ciclo_academico VARCHAR(20),
    cupo INTEGER CHECK (cupo >= 0),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(curso_id, carrera_id, seccion, ciclo_academico)
);

CREATE TYPE rol_docente_enum AS ENUM ('docente', 'auxiliar');

CREATE TABLE curso_docente (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curso_id UUID NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
    docente_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    rol_docente rol_docente_enum NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(curso_id, docente_id, rol_docente)
);


CREATE TABLE curso_estudiante (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curso_id UUID NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
    estudiante_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    estado_inscripcion estado_inscripcion DEFAULT 'inscrito',
    nota DECIMAL(4,2) CHECK (nota >= 0 AND nota <= 100),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(curso_id, estudiante_id)
);


-- ================================0
-- 3 social core
-- ================================0


CREATE TABLE hilos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    autor_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    curso_id UUID REFERENCES cursos(id) ON DELETE SET NULL,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    categoria VARCHAR(100),
    estado VARCHAR(50) DEFAULT 'abierto' CHECK (estado IN ('abierto', 'resuelto', 'cerrado')),
    vistas INTEGER DEFAULT 0,
    score INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT hilos_titulo_no_vacio CHECK (LENGTH(titulo) >= 5)
);



CREATE TABLE comentarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hilo_id UUID NOT NULL REFERENCES hilos(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    contenido TEXT NOT NULL,
    padre_id UUID REFERENCES comentarios(id) ON DELETE CASCADE,
    estado VARCHAR(50) DEFAULT 'visible' CHECK (estado IN ('visible', 'oculto', 'eliminado')),
    voto_neto INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT comentarios_contenido_no_vacio CHECK (LENGTH(contenido) >= 1),
    CONSTRAINT no_respuesta_a_si_mismo CHECK (id != padre_id)
);





-- ==================
--- 4 Proyectos 
-- ==================


CREATE TABLE etiquetas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) UNIQUE NOT NULL,
    uso_count INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW()
);



CREATE TABLE area_tecnica (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    carrera_id UUID REFERENCES carreras(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW()

);

CREATE TABLE proyectos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    autor_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    curso_id UUID REFERENCES cursos(id) ON DELETE SET NULL,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    area_tecnica UUID REFERENCES area_tecnica(id) ON DELETE SET NULL,
    visibilidad VARCHAR(50) DEFAULT 'publico' CHECK (visibilidad IN ('publico', 'privado')),
    estado VARCHAR(50) DEFAULT 'borrador'
        CHECK (estado IN ('borrador', 'publicado', 'archivado')),
    destacado BOOLEAN DEFAULT false,
    destacado_por UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    vistas INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE archivos_proyecto (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proyecto_id UUID NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
    nombre_original VARCHAR(255) NOT NULL,
    url_storage VARCHAR(500) NOT NULL,
    tipo_mime VARCHAR(100),
    tamano_bytes BIGINT CHECK (tamano_bytes >= 0),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE proyecto_etiqueta (
    proyecto_id UUID NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
    etiqueta_id UUID NOT NULL REFERENCES etiquetas(id) ON DELETE CASCADE,
    PRIMARY KEY (proyecto_id, etiqueta_id)
);



CREATE TABLE tecnologias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE proyecto_tecnologia (
    proyecto_id UUID NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
    tecnologia_id UUID NOT NULL REFERENCES tecnologias(id) ON DELETE CASCADE,
    PRIMARY KEY (proyecto_id, tecnologia_id)
);


-- ============================
-- 5 CONTENIDO 
-- ============================


CREATE TABLE articulos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    autor_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    slug VARCHAR(300) UNIQUE NOT NULL,
    contenido_html TEXT NOT NULL,
    resumen TEXT,
    imagen_portada VARCHAR(500),
    categoria VARCHAR(100),
    publicado BOOLEAN DEFAULT false,
    vistas INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);


CREATE TABLE articulo_etiqueta (
    articulo_id UUID NOT NULL REFERENCES articulos(id) ON DELETE CASCADE,
    etiqueta_id UUID NOT NULL REFERENCES etiquetas(id) ON DELETE CASCADE,
    PRIMARY KEY (articulo_id, etiqueta_id)
);


--- ===========================
--- 6 SISTEMA
--- ===========================

CREATE TABLE sesiones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    expira_at TIMESTAMP NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    revocado BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);



CREATE TABLE auditoria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    accion VARCHAR(100) NOT NULL,
    tabla_afectada VARCHAR(100) NOT NULL,
    registro_id UUID,
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    ip_address VARCHAR(45),
    timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);


CREATE TABLE reportes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_reporte_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    contenido_id UUID NOT NULL,
    tipo_contenido VARCHAR(50) NOT NULL CHECK (tipo_contenido IN ('proyecto', 'hilo', 'comentario', 'articulo')),
    motivo VARCHAR(500) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(50) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'revisado', 'resuelto', 'descartado')),
    usuario_moderador_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    resolucion TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);



CREATE TABLE notificaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,

    tipo VARCHAR(50) NOT NULL CHECK (
        tipo IN ('mención', 'respuesta', 'voto', 'comentario', 'proyecto_destacado', 'moderación')
    ),

    hilo_id UUID REFERENCES hilos(id) ON DELETE CASCADE,
    comentario_id UUID REFERENCES comentarios(id) ON DELETE CASCADE,
    proyecto_id UUID REFERENCES proyectos(id) ON DELETE CASCADE,
    articulo_id UUID REFERENCES articulos(id) ON DELETE CASCADE,

    titulo VARCHAR(255) NOT NULL,
    mensaje TEXT,
    leido BOOLEAN DEFAULT false,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    -- 🔥 CHECK DE COHERENCIA
    CONSTRAINT check_tipo_referencia CHECK (

        -- comentario directo
        (tipo = 'comentario' AND comentario_id IS NOT NULL AND hilo_id IS NULL AND proyecto_id IS NULL AND articulo_id IS NULL)

        OR

        -- respuesta a comentario
        (tipo = 'respuesta' AND comentario_id IS NOT NULL AND proyecto_id IS NULL AND articulo_id IS NULL)

        OR

        -- voto (puede ser a hilo o comentario, pero no ambos)
        (tipo = 'voto' AND (
            (hilo_id IS NOT NULL AND comentario_id IS NULL)
            OR
            (hilo_id IS NULL AND comentario_id IS NOT NULL)
        ))

        OR

        -- mención (puede ser en cualquier contenido, pero al menos uno debe existir)
        (tipo = 'mención' AND (
            hilo_id IS NOT NULL OR comentario_id IS NOT NULL OR proyecto_id IS NOT NULL OR articulo_id IS NOT NULL
        ))

        OR

        -- proyecto destacado
        (tipo = 'proyecto_destacado' AND proyecto_id IS NOT NULL AND hilo_id IS NULL AND comentario_id IS NULL AND articulo_id IS NULL)

        OR

        -- moderación (puede no tener referencia directa)
        (tipo = 'moderación')
    )
);



--- ===========================
--- 7 INTERACCIONES 
--- ===========================


CREATE TABLE votos_hilos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    hilo_id UUID NOT NULL REFERENCES hilos(id) ON DELETE CASCADE,
    voto SMALLINT NOT NULL CHECK (voto IN (-1, 1)),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(usuario_id, hilo_id)
);

CREATE TABLE votos_comentarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    comentario_id UUID NOT NULL REFERENCES comentarios(id) ON DELETE CASCADE,
    voto SMALLINT NOT NULL CHECK (voto IN (-1, 1)),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(usuario_id, comentario_id)
);





-- ============================================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================================================

-- Identidad

CREATE INDEX idx_usuarios_rol_id ON usuarios(rol_id);
CREATE INDEX idx_sesiones_usuario_id ON sesiones(usuario_id);
CREATE INDEX idx_sesiones_expira_at ON sesiones(expira_at);

-- Repositorio
CREATE INDEX idx_proyectos_autor_id ON proyectos(autor_id);
CREATE INDEX idx_proyectos_curso_id ON proyectos(curso_id);
CREATE INDEX idx_proyectos_estado ON proyectos(estado);
CREATE INDEX idx_proyectos_destacado ON proyectos(destacado);
CREATE INDEX idx_archivos_proyecto_id ON archivos_proyecto(proyecto_id);
CREATE INDEX idx_etiquetas_nombre ON etiquetas(nombre);
CREATE INDEX idx_etiquetas_nombre_trgm ON etiquetas USING gin(nombre gin_trgm_ops);

-- Foros
CREATE INDEX idx_hilos_autor_id ON hilos(autor_id);
CREATE INDEX idx_hilos_curso_id ON hilos(curso_id);
CREATE INDEX idx_hilos_estado ON hilos(estado);
CREATE INDEX idx_hilos_created_at ON hilos(created_at);
CREATE INDEX idx_comentarios_hilo_id ON comentarios(hilo_id);
CREATE INDEX idx_comentarios_usuario_id ON comentarios(usuario_id);
CREATE INDEX idx_comentarios_padre_id ON comentarios(padre_id);
CREATE INDEX idx_articulos_autor_id ON articulos(autor_id);
CREATE INDEX idx_articulos_slug ON articulos(slug);

-- nofiricaciones y moderación
CREATE INDEX idx_notificaciones_hilo ON notificaciones(hilo_id);
CREATE INDEX idx_notificaciones_comentario ON notificaciones(comentario_id);
CREATE INDEX idx_notificaciones_proyecto ON notificaciones(proyecto_id);
CREATE INDEX idx_notificaciones_articulo ON notificaciones(articulo_id);

CREATE INDEX idx_votos_hilos_usuario ON votos_hilos(usuario_id);
CREATE INDEX idx_votos_hilos_hilo ON votos_hilos(hilo_id);

CREATE INDEX idx_votos_comentarios_usuario ON votos_comentarios(usuario_id);
CREATE INDEX idx_votos_comentarios_comentario ON votos_comentarios(comentario_id);

-- idice de proyectos:
CREATE INDEX idx_proyecto_tecnologia_proyecto 
ON proyecto_tecnologia(proyecto_id);

CREATE INDEX idx_proyecto_tecnologia_tecnologia 
ON proyecto_tecnologia(tecnologia_id);
-- Moderación
CREATE INDEX idx_reportes_estado ON reportes(estado);
CREATE INDEX idx_reportes_usuario_reporte ON reportes(usuario_reporte_id);
CREATE INDEX idx_reportes_created_at ON reportes(created_at);
CREATE INDEX idx_notificaciones_usuario_id ON notificaciones(usuario_id);
CREATE INDEX idx_notificaciones_leido ON notificaciones(leido);
CREATE INDEX idx_auditoria_usuario_id ON auditoria(usuario_id);
CREATE INDEX idx_auditoria_timestamp ON auditoria(timestamp);



-- ============================================================================
-- TRIGGERS Y FUNCIONES
-- ============================================================================

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER usuarios_updated_at BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER proyectos_updated_at BEFORE UPDATE ON proyectos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER hilos_updated_at BEFORE UPDATE ON hilos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER comentarios_updated_at BEFORE UPDATE ON comentarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER articulos_updated_at BEFORE UPDATE ON articulos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER reportes_updated_at BEFORE UPDATE ON reportes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Trigger para auditoría automática

CREATE OR REPLACE FUNCTION registrar_auditoria()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO auditoria (usuario_id, accion, tabla_afectada, registro_id, datos_nuevos)
        VALUES (
            current_setting('app.usuario_id', true)::uuid,
            'INSERT',
            TG_TABLE_NAME,
            NEW.id,
            row_to_json(NEW)
        );
        RETURN NEW;

    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO auditoria (usuario_id, accion, tabla_afectada, registro_id, datos_anteriores, datos_nuevos)
        VALUES (
            current_setting('app.usuario_id', true)::uuid,
            'UPDATE',
            TG_TABLE_NAME,
            NEW.id,
            row_to_json(OLD),
            row_to_json(NEW)
        );
        RETURN NEW;

    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO auditoria (usuario_id, accion, tabla_afectada, registro_id, datos_anteriores)
        VALUES (
            current_setting('app.usuario_id', true)::uuid,
            'DELETE',
            TG_TABLE_NAME,
            OLD.id,
            row_to_json(OLD)
        );
        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;


-- Comentar triggers de auditoría por ahora (se activan bajo demanda)
-- CREATE TRIGGER audit_proyectos_insert AFTER INSERT ON proyectos
--     FOR EACH ROW EXECUTE FUNCTION registrar_auditoria('INSERT');

-- ============================================================================
-- VISTAS ÚTILES
-- ============================================================================

CREATE VIEW vista_proyectos_populares AS
SELECT 
    p.id,
    p.titulo,
    p.autor_id,
    u.nombre as autor_nombre,
    p.vistas,
    p.rating,
    p.created_at,
    c.nombre as curso_nombre
FROM proyectos p
JOIN usuarios u ON p.autor_id = u.id
LEFT JOIN cursos c ON p.curso_id = c.id
WHERE p.estado = 'publicado'
ORDER BY p.vistas DESC, p.rating DESC;

CREATE VIEW vista_hilos_activos AS
SELECT 
    h.id,
    h.titulo,
    h.autor_id,
    u.nombre as autor_nombre,
    h.vistas,
    h.score,
    COUNT(c.id) as num_comentarios,
    h.created_at
FROM hilos h
JOIN usuarios u ON h.autor_id = u.id
LEFT JOIN comentarios c ON h.id = c.hilo_id AND c.estado = 'visible'
WHERE h.estado != 'cerrado'
GROUP BY h.id, u.nombre, u.id
ORDER BY h.updated_at DESC;


CREATE OR REPLACE FUNCTION validar_email_institucional(email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    dominio_email TEXT;
BEGIN
    dominio_email := split_part(email, '@', 2);

    RETURN EXISTS (
        SELECT 1
        FROM dominios_permitidos
        WHERE dominio = dominio_email
    );
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- FIN DEL SCHEMA
-- =========================================================================