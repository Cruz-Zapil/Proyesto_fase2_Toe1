-- ============================================================================
-- SYSHUB DATABASE SCHEMA
-- Ecosistema digital de aprendizaje continuo - Fase 2
-- PostgreSQL 12+
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================================
-- MÓDULO 1: IDENTIDAD Y ACCESO
-- ============================================================================

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol_id UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    estado VARCHAR(50) DEFAULT 'activo' CHECK (estado IN ('activo', 'suspendido', 'eliminado')),
    token_verificacion VARCHAR(255),
    email_verificado_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

CREATE TABLE sesiones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    jwt_token TEXT NOT NULL,
    expira_at TIMESTAMP NOT NULL,
    ip_address VARCHAR(45),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT sesion_no_duplicada UNIQUE(usuario_id, jwt_token)
);

-- ============================================================================
-- MÓDULO 5: TAXONOMÍA (Cursos y Áreas Técnicas)
-- ============================================================================

CREATE TABLE cursos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(255) NOT NULL,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    area_tecnica VARCHAR(100) NOT NULL,
    semestre INTEGER NOT NULL CHECK (semestre > 0),
    activo BOOLEAN DEFAULT true,
    descripcion TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- MÓDULO 2: REPOSITORIO DE PROYECTOS
-- ============================================================================

CREATE TABLE etiquetas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) UNIQUE NOT NULL,
    uso_count INTEGER DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE proyectos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    autor_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    curso_id UUID NOT NULL REFERENCES cursos(id) ON DELETE SET NULL,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    stack_tecnologico VARCHAR(255),
    area_tecnica VARCHAR(100),
    estado VARCHAR(50) DEFAULT 'borrador' CHECK (estado IN ('borrador', 'publicado', 'archivado')),
    destacado BOOLEAN DEFAULT false,
    destacado_por UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    vistas INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE archivos_proyecto (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proyecto_id UUID NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
    nombre_original VARCHAR(255) NOT NULL,
    url_storage VARCHAR(500) NOT NULL,
    tipo_mime VARCHAR(100),
    tamano_bytes BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE proyecto_etiqueta (
    proyecto_id UUID NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
    etiqueta_id UUID NOT NULL REFERENCES etiquetas(id) ON DELETE CASCADE,
    PRIMARY KEY (proyecto_id, etiqueta_id)
);

-- ============================================================================
-- MÓDULO 3: FOROS Y SOCIAL (Sys-Reddit)
-- ============================================================================

CREATE TABLE hilos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

CREATE TABLE votos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    contenido_id UUID NOT NULL,
    tipo_contenido VARCHAR(50) NOT NULL CHECK (tipo_contenido IN ('hilo', 'comentario')),
    voto SMALLINT NOT NULL CHECK (voto IN (-1, 0, 1)),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(usuario_id, contenido_id, tipo_contenido)
);

CREATE TABLE articulos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    autor_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    slug VARCHAR(300) UNIQUE NOT NULL,
    contenido_html TEXT NOT NULL,
    resumen TEXT,
    imagen_portada VARCHAR(500),
    categoria VARCHAR(100),
    etiquetas VARCHAR(255),
    publicado BOOLEAN DEFAULT false,
    vistas INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- MÓDULO 4: MODERACIÓN Y NOTIFICACIONES
-- ============================================================================

CREATE TABLE reportes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_reporte_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE SET NULL,
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('mención', 'respuesta', 'voto', 'comentario', 'proyecto_destacado', 'moderación')),
    contenido_id UUID,
    titulo VARCHAR(255) NOT NULL,
    mensaje TEXT,
    leido BOOLEAN DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE auditoria (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    accion VARCHAR(100) NOT NULL,
    tabla_afectada VARCHAR(100) NOT NULL,
    registro_id UUID,
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    ip_address VARCHAR(45),
    timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================================================

-- Identidad
CREATE INDEX idx_usuarios_email ON usuarios(email);
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
CREATE INDEX idx_votos_usuario_id ON votos(usuario_id);
CREATE INDEX idx_votos_contenido_id ON votos(contenido_id);
CREATE INDEX idx_articulos_autor_id ON articulos(autor_id);
CREATE INDEX idx_articulos_slug ON articulos(slug);

-- Moderación
CREATE INDEX idx_reportes_estado ON reportes(estado);
CREATE INDEX idx_reportes_usuario_reporte ON reportes(usuario_reporte_id);
CREATE INDEX idx_reportes_created_at ON reportes(created_at);
CREATE INDEX idx_notificaciones_usuario_id ON notificaciones(usuario_id);
CREATE INDEX idx_notificaciones_leido ON notificaciones(leido);
CREATE INDEX idx_auditoria_usuario_id ON auditoria(usuario_id);
CREATE INDEX idx_auditoria_timestamp ON auditoria(timestamp);

-- ============================================================================
-- DATOS SEMILLA (SEED DATA)
-- ============================================================================

INSERT INTO roles (nombre, descripcion) VALUES
    ('estudiante', 'Usuario base que puede consumir y publicar contenido'),
    ('auxiliar', 'Rol elevado que genera contenido de referencia'),
    ('moderador', 'Mantiene la calidad e integridad del contenido'),
    ('administrador', 'Control total del sistema');

INSERT INTO cursos (nombre, codigo, area_tecnica, semestre, descripcion) VALUES
    ('Teoría de Sistemas 1', 'TS001', 'Sistemas', 1, 'Análisis sistémico y modelado'),
    ('Programación I', 'PROG001', 'Desarrollo', 1, 'Fundamentos de programación'),
    ('Bases de Datos', 'BD001', 'Infraestructura', 2, 'Diseño y gestión de bases de datos'),
    ('Inteligencia Artificial', 'IA001', 'Inteligencia Artificial', 5, 'Introducción a IA y ML'),
    ('DevOps', 'DEVOPS001', 'Infraestructura', 6, 'Automatización y despliegue');

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
    INSERT INTO auditoria (usuario_id, accion, tabla_afectada, registro_id, datos_nuevos)
    VALUES (
        COALESCE(current_setting('app.usuario_id', true)::uuid, NULL),
        TG_ARGV[0],
        TG_TABLE_NAME,
        NEW.id,
        row_to_json(NEW)
    );
    RETURN NEW;
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

-- ============================================================================
-- FIN DEL SCHEMA
-- ============================================================================
