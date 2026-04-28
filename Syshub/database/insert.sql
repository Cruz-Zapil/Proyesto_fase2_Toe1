
-- ============================================================================
-- SEED DATA — SYSHUB
-- Compatible con PostgreSQL
-- ============================================================================
 
-- ============================================================================
-- 1. ROLES
-- ============================================================================
INSERT INTO roles (nombre, descripcion) VALUES
  ( 'admin',      'Administrador del sistema con acceso total'),
  ( 'docente',    'Docente que imparte cursos'),
  ( 'auxiliar',   'Auxiliar de docencia'),
  ( 'estudiante', 'Estudiante universitario');


 -- ============================================================================
-- 2. DOMINIOS PERMITIDOS
-- ============================================================================
INSERT INTO dominios_permitidos (dominio) VALUES
  ('@usac.edu.gt'),
  ('@cunoc.edu.gt');
 

-- ============================================================================
-- 3. DIVISIONES
-- ============================================================================
INSERT INTO division ( codigo, nombre, descripcion) VALUES
  ( 'DIV-ING',  'División de Ingeniería',            'División que agrupa las carreras del área de ingeniería y tecnología'),
  ( 'DIV-DER',  'División de Derecho',               'División que agrupa las carreras del área jurídica y legal'),
  ( 'DIV-ECON', 'División de Ciencias Económicas',   'División que agrupa las carreras del área económica y administrativa');


-- ============================================================================
-- 4. CARRERAS (5 por división = 15 total)
-- ============================================================================
INSERT INTO carreras ( nombre, codigo, facultad, activo, division_id) VALUES
 
  -- Ingeniería
  ( 'Ingeniería en Sistemas',              'ING-SIS',  'Facultad de Ingeniería', true, (SELECT id FROM division WHERE codigo = 'DIV-ING')),
  ( 'Ingeniería Civil',                    'ING-CIV',  'Facultad de Ingeniería', true, (SELECT id FROM division WHERE codigo = 'DIV-ING')),
  ( 'Ingeniería Mecánica Industrial',      'ING-MEC',  'Facultad de Ingeniería', true, (SELECT id FROM division WHERE codigo = 'DIV-ING')),
  ( 'Ingeniería Electrónica',              'ING-ELEC', 'Facultad de Ingeniería', true, (SELECT id FROM division WHERE codigo = 'DIV-ING')),
  ( 'Ingeniería Química',                  'ING-QUIM', 'Facultad de Ingeniería', true, (SELECT id FROM division WHERE codigo = 'DIV-ING')),
 
  -- Derecho
  ( 'Derecho',                             'DER-GEN',  'Facultad de Derecho',    true, (SELECT id FROM division WHERE codigo = 'DIV-DER')),
  ( 'Derecho Penal',                       'DER-PEN',  'Facultad de Derecho',    true, (SELECT id FROM division WHERE codigo = 'DIV-DER')),
  ( 'Derecho Mercantil',                   'DER-MER',  'Facultad de Derecho',    true, (SELECT id FROM division WHERE codigo = 'DIV-DER')),
  ( 'Derecho Internacional',               'DER-INT',  'Facultad de Derecho',    true, (SELECT id FROM division WHERE codigo = 'DIV-DER')),
  ( 'Notariado y Escritura Pública',       'DER-NOT',  'Facultad de Derecho',    true, (SELECT id FROM division WHERE codigo = 'DIV-DER')),
 
  -- Ciencias Económicas
  ( 'Administración de Empresas',          'ECON-ADM', 'Facultad de CC. EE.',    true, (SELECT id FROM division WHERE codigo = 'DIV-ECON')),
  ( 'Contaduría Pública y Auditoría',      'ECON-CPA', 'Facultad de CC. EE.',    true, (SELECT id FROM division WHERE codigo = 'DIV-ECON')),
  ( 'Economía',                            'ECON-ECO', 'Facultad de CC. EE.',    true, (SELECT id FROM division WHERE codigo = 'DIV-ECON')),
  ( 'Mercadotecnia',                       'ECON-MKT', 'Facultad de CC. EE.',    true, (SELECT id FROM division WHERE codigo = 'DIV-ECON')),
  ( 'Gestión Empresarial',                 'ECON-GES', 'Facultad de CC. EE.',    true, (SELECT id FROM division WHERE codigo = 'DIV-ECON'));
 


-- ============================================================================
-- 5. USUARIOS (30 usuarios + 1 admin = 31 total)
-- password_hash es bcrypt de "Password123!" para todos (solo pruebas)
-- ============================================================================
INSERT INTO usuarios ( nombre, apellidos, telefono, registro_academico, email, password_hash, rol_id, estado) VALUES
 
  -- 1 Admin
  ('Cruz ',    'Zapil',    '50212340001', 'ADMIN-0001', 'admin@usac.edu.gt',            '12345',  '193948ce-5094-48fb-b4b9-3e4a177accae', 'activo'),
 
  -- 4 Docentes
  ('Carlos',     'Morales López',    '50212340002', 'DOC-2024-01', 'c.morales@usac.edu.gt',        '12345',    'e8d83a1a-a5a3-4c0e-86fc-c5350483707d', 'activo'),
  ('Lucía',      'Ramírez Pérez',    '50212340003', 'DOC-2024-02', 'l.ramirez@usac.edu.gt',        '12345',    'e8d83a1a-a5a3-4c0e-86fc-c5350483707d', 'activo'),
  ('Roberto',    'Fuentes García',   '50212340004', 'DOC-2024-03', 'r.fuentes@cunoc.edu.gt',       '12345',    'e8d83a1a-a5a3-4c0e-86fc-c5350483707d', 'activo'),
  ('Ana María',  'Juárez Cifuentes', '50212340005', 'DOC-2024-04', 'a.juarez@cunoc.edu.gt',        '12345',    'e8d83a1a-a5a3-4c0e-86fc-c5350483707d', 'activo'),
 
  -- 4 Auxiliares
  ('Diego',      'Hernández Cruz',   '50212340006', 'AUX-2024-01', 'd.hernandez@usac.edu.gt',      '12345',    'd7010d41-5e05-4cce-9b6e-294f0aa8f268', 'activo'),
  ('Sofía',      'Mendoza Ávila',    '50212340007', 'AUX-2024-02', 's.mendoza@usac.edu.gt',        '12345',    'd7010d41-5e05-4cce-9b6e-294f0aa8f268', 'activo'),
  ('Fernando',   'Castillo Ruiz',    '50212340008', 'AUX-2024-03', 'f.castillo@cunoc.edu.gt',      '12345',    'd7010d41-5e05-4cce-9b6e-294f0aa8f268', 'activo'),
  ('Valeria',    'López Solís',      '50212340009', 'AUX-2024-04', 'v.lopez@cunoc.edu.gt',         '12345',    'd7010d41-5e05-4cce-9b6e-294f0aa8f268', 'activo'),
  
  -- 22 Estudiantes
  ( 'José',       'García Pérez',     '50212340010', '202400001',  'jose.garcia@usac.edu.gt',       '12345',    (SELECT id FROM roles WHERE nombre = 'estudiante'), 'activo'),
  ( 'María',      'López Ajú',        '50212340011', '202400002',  'maria.lopez@usac.edu.gt',       '12345',    (SELECT id FROM roles WHERE nombre = 'estudiante'), 'activo'),
  ( 'Pedro',      'Xajil Tziná',      '50212340012', '202400003',  'pedro.xajil@usac.edu.gt',       '12345',    (SELECT id FROM roles WHERE nombre = 'estudiante'), 'activo'),
  ( 'Andrea',     'Méndez Ixcoy',     '50212340013', '202400004',  'andrea.mendez@usac.edu.gt',     '12345',    (SELECT id FROM roles WHERE nombre = 'estudiante'), 'activo'),
  ( 'Luis',       'Chávez Batz',      '50212340014', '202400005',  'luis.chavez@usac.edu.gt',       '12345',    (SELECT id FROM roles WHERE nombre = 'estudiante'), 'activo'),
  ( 'Gabriela',   'Ajú Chitay',       '50212340015', '202400006',  'gabriela.aju@cunoc.edu.gt',     '12345',    (SELECT id FROM roles WHERE nombre = 'estudiante'), 'activo'),
  ( 'Rodrigo',    'Tzul Coyoy',       '50212340016', '202400007',  'rodrigo.tzul@cunoc.edu.gt',     '12345',    (SELECT id FROM roles WHERE nombre = 'estudiante'), 'activo'),
  ( 'Miguel',     'Sicán Batz',       '50212340018', '202400009',  'miguel.sican@usac.edu.gt',      '12345',    (SELECT id FROM roles WHERE nombre = 'estudiante'), 'activo'),
  ( 'Paola',      'Ixcoy Tzul',       '50212340021', '202400012',  'paola.ixcoy@cunoc.edu.gt',      '12345',    (SELECT id FROM roles WHERE nombre = 'estudiante'), 'activo'),
  ( 'Héctor',     'Morales Coj',      '50212340022', '202400013',  'hector.morales@cunoc.edu.gt',   '12345',    (SELECT id FROM roles WHERE nombre = 'estudiante'), 'activo'),
  ( 'Karen',      'Batz Ajú',         '50212340023', '202400014',  'karen.batz@usac.edu.gt',        '12345',    (SELECT id FROM roles WHERE nombre = 'estudiante'), 'activo'),
  ( 'Edwin',      'Coyoy Sic',        '50212340024', '202400015',  'edwin.coyoy@usac.edu.gt',       '12345',   (SELECT id FROM roles WHERE nombre = 'estudiante'), 'activo'),
  ( 'Jéssica',    'Choc Tahay',       '50212340025', '202045789',  'jessica.choc@cunoc.edu.gt',     '12345',   (SELECT id FROM roles WHERE nombre = 'estudiante'), 'activo'),
  ( 'Óscar',      'Quiej Tzoc',       '50212340026', '202078952',  'oscar.quiej@cunoc.edu.gt',      '12345',   (SELECT id FROM roles WHERE nombre = 'estudiante'), 'activo'),
  ( 'Diana',      'Saquic Ixcoy',     '50212340027', '202048785', 'diana.saquic@usac.edu.gt',       '12345',   (SELECT id FROM roles WHERE nombre = 'estudiante'), 'activo'),
  ( 'Byron',     'Ajú Coyoy',         '50212340028', '202001234',  'byron.aju@usac.edu.gt',         '12345',   (SELECT id FROM roles WHERE nombre = 'estudiante'), 'activo'),
  ('Stephanie',  'Tzul Sicán',        '50212340029', '202045787',  'stephanie.tzul@cunoc.edu.gt',   '12345',   (SELECT id FROM roles WHERE nombre = 'estudiante'), 'activo'),
  ('Josué',      'Menchú Pac',        '50212340030', '202045788',  'josue.menchu@cunoc.edu.gt',     '12345',   (SELECT id FROM roles WHERE nombre = 'estudiante'), 'activo');
 



-- ============================================================================
-- 6. CURSOS (3 por carrera, usamos Ingeniería en Sistemas, Derecho y Admon)
-- ============================================================================
INSERT INTO cursos ( nombre, codigo, carrera_id, area_tecnica, semestre, activo, descripcion) VALUES
 
  -- Ingeniería en Sistemas
  ( 'Introducción a la Programación',  'ING-SIS-101', '66260dd8-63e1-4903-a9f3-c35aa7c26332', 'Programación',      1, true, 'Fundamentos de lógica y programación'),
  ( 'Bases de Datos 1',                'ING-SIS-201', '66260dd8-63e1-4903-a9f3-c35aa7c26332', 'Bases de Datos',    2, true, 'Modelado relacional y SQL'),
  ( 'Redes de Computadoras',           'ING-SIS-301', '66260dd8-63e1-4903-a9f3-c35aa7c26332', 'Redes',             3, true, 'Protocolos y arquitectura de redes'),
  
  -- Derecho
  ( 'Introducción al Derecho',         'DER-GEN-101', '907f67c6-e5f1-4988-9e0d-0fceb0f33c8b', 'Derecho General',   1, true, 'Fundamentos del derecho'),
  ( 'Derecho Constitucional',          'DER-GEN-201', '907f67c6-e5f1-4988-9e0d-0fceb0f33c8b', 'Derecho Público',   2, true, 'Estudio de la constitución política'),
  ( 'Derecho Civil',                   'DER-GEN-301', '907f67c6-e5f1-4988-9e0d-0fceb0f33c8b', 'Derecho Privado',   3, true, 'Personas, bienes y contratos'),
 
  -- Administración de Empresas
  ( 'Fundamentos de Administración',   'ECON-ADM-101','d0adbb54-c3e6-4994-b16b-28755320461f', 'Administración',    1, true, 'Principios de administración moderna'),
  ( 'Contabilidad General',            'ECON-ADM-201','d0adbb54-c3e6-4994-b16b-28755320461f', 'Contabilidad',      2, true, 'Registros contables y estados financieros'),
  ( 'Mercadotecnia I',                 'ECON-ADM-301','d0adbb54-c3e6-4994-b16b-28755320461f', 'Marketing',         3, true, 'Fundamentos de mercadeo y consumidor');
 
 
-- ============================================================================
-- 7. CARRERA_CURSO (relacionar cursos con carreras)
-- ============================================================================
INSERT INTO carrera_curso (carrera_id, curso_id, semestre, obligatorio) VALUES
  ('66260dd8-63e1-4903-a9f3-c35aa7c26332', 'b88844f7-71e3-4b71-b640-d3f7cbd831fb', 1, true),
  ('5a165bae-936e-41b5-856e-d40b2431441d', '174c4114-b020-42f8-97d4-4f8477ed6153', 2, true),
  ('a26bc584-f5c8-46af-a6c2-fe0037bc95dd', '69e28d5b-deac-46d5-9f9f-ef3099d52ddf', 3, true),
  ('a05320b3-3714-4683-a88b-f4849f523cc9', '9d49270b-e9cf-4893-9de1-fc389cc97631', 1, true),
  ('49729ec8-ed9f-41bd-81d8-4157ea83e8a1', '9f181726-08b0-4a59-afd0-53f3a0473d87', 2, true),
  ('907f67c6-e5f1-4988-9e0d-0fceb0f33c8b', '19b4c943-347f-49c5-9501-9c1ba6e367a5', 3, true),
  ('ed7d8f00-6883-40b2-85f8-afa9abf5480e', 'dfaed8b9-e16a-458e-b3da-6b55ea9010a5', 1, true),
  ('241408d4-f872-4853-98df-4abc3bc7097d', '68282a84-bf50-47f2-87ad-639ffa108407', 2, true),
  ('ade9e103-5398-42bb-a3f7-12a46f387ac2', 'bd9bc08a-d476-4212-ad22-fbf85b634b72', 3, true);
  
 
-- ============================================================================
-- 8. CURSO_OFERTA (oferta académica ciclo 2024-1)
-- ============================================================================
INSERT INTO curso_oferta (curso_id, carrera_id, seccion, ciclo_academico, cupo) VALUES
  ('b88844f7-71e3-4b71-b640-d3f7cbd831fb', '66260dd8-63e1-4903-a9f3-c35aa7c26332', 'A', '2024-1', 40),
  ('174c4114-b020-42f8-97d4-4f8477ed6153', '5a165bae-936e-41b5-856e-d40b2431441d', 'A', '2024-1', 35),
  ('69e28d5b-deac-46d5-9f9f-ef3099d52ddf', 'a26bc584-f5c8-46af-a6c2-fe0037bc95dd', 'A', '2024-1', 30),
  ('9d49270b-e9cf-4893-9de1-fc389cc97631', 'a05320b3-3714-4683-a88b-f4849f523cc9', 'A', '2024-1', 50),
  ('9f181726-08b0-4a59-afd0-53f3a0473d87', '49729ec8-ed9f-41bd-81d8-4157ea83e8a1', 'A', '2024-1', 50),
  ('19b4c943-347f-49c5-9501-9c1ba6e367a5', '907f67c6-e5f1-4988-9e0d-0fceb0f33c8b', 'A', '2024-1', 45),
  ('dfaed8b9-e16a-458e-b3da-6b55ea9010a5', 'ed7d8f00-6883-40b2-85f8-afa9abf5480e', 'A', '2024-1', 40),
  ('68282a84-bf50-47f2-87ad-639ffa108407', '241408d4-f872-4853-98df-4abc3bc7097d', 'A', '2024-1', 40),
  ('bd9bc08a-d476-4212-ad22-fbf85b634b72', 'ade9e103-5398-42bb-a3f7-12a46f387ac2', 'A', '2024-1', 40);
 
 
-- ============================================================================
-- 9. CURSO_DOCENTE (asignar docentes y auxiliares a cursos)
-- ============================================================================
INSERT INTO curso_docente (curso_id, docente_id, rol_docente) VALUES
  ('b88844f7-71e3-4b71-b640-d3f7cbd831fb', '113df449-b107-4565-900c-d64f8112b9d4', 'docente'),
  ('174c4114-b020-42f8-97d4-4f8477ed6153', 'e3c9cb88-e266-431f-ba8b-999d9ffb1e0b', 'docente'),
  ('69e28d5b-deac-46d5-9f9f-ef3099d52ddf', 'c2448603-dcdc-4b61-abeb-df301698f555', 'docente'),
  ('9d49270b-e9cf-4893-9de1-fc389cc97631', 'c1fcd892-4d45-4316-b6b6-e10af6d15b9c', 'docente'),
  ('9f181726-08b0-4a59-afd0-53f3a0473d87', '32c45cc9-ba24-40bb-9567-bf3f3402beb6', 'auxiliar'),
  ('19b4c943-347f-49c5-9501-9c1ba6e367a5', '8eaff4f9-6b42-4e0c-9f0c-3d8be33b37c1', 'auxiliar'),
  ('dfaed8b9-e16a-458e-b3da-6b55ea9010a5', '7f77712c-34d5-427e-a2fc-bcd2f9ee8117', 'auxiliar'),
  ('68282a84-bf50-47f2-87ad-639ffa108407', '82324d95-8367-4dfe-b9ad-a9e3a75cf01c', 'auxiliar');

-- ============================================================================
-- 10. USUARIO_CARRERA (inscribir estudiantes a carreras)
-- ============================================================================
INSERT INTO usuario_carrera (usuario_id, carrera_id, estado, fecha_inicio, es_principal) VALUES
  -- Ingeniería en Sistemas (10 estudiantes)
  ('2ac46a75-b22d-43ad-9285-5bbef2cd192c', '66260dd8-63e1-4903-a9f3-c35aa7c26332', 'activo', '2024-01-15', true),
  ('eed485e8-2418-4996-839d-bdb8ce5c05b2', '66260dd8-63e1-4903-a9f3-c35aa7c26332', 'activo', '2024-01-15', true),
  ('3838d186-49c2-4ed9-a446-417854b27c19', '66260dd8-63e1-4903-a9f3-c35aa7c26332', 'activo', '2024-01-15', true),
  ('7f377a26-ef01-4e91-9a29-f6dbc556e9c3', '66260dd8-63e1-4903-a9f3-c35aa7c26332', 'activo', '2024-01-15', true),
  ('70b1f13d-3a25-41c1-8493-804f0555ca4b', '66260dd8-63e1-4903-a9f3-c35aa7c26332', 'activo', '2024-01-15', true),
  ('d4d4741f-e938-476d-96cd-5579246dcc84', '66260dd8-63e1-4903-a9f3-c35aa7c26332', 'activo', '2024-01-15', true);


INSERT INTO usuario_carrera (usuario_id, carrera_id, estado, fecha_inicio, es_principal) VALUES
  -- Derecho (6 estudiantes)
  ('cb95c394-4062-45d9-9686-ffa65904c862', '907f67c6-e5f1-4988-9e0d-0fceb0f33c8b', 'activo', '2024-01-15', true),
  ('c01a9953-aa99-4d7d-83cd-2dc4cc5443d0', '907f67c6-e5f1-4988-9e0d-0fceb0f33c8b', 'activo', '2024-01-15', true),
  ('fd50b0cd-60af-42e0-b4c5-f713c0c7d5af', '907f67c6-e5f1-4988-9e0d-0fceb0f33c8b', 'activo', '2024-01-15', true),
  ('092d0443-f987-43be-b7f6-084fdd26ca1e', '907f67c6-e5f1-4988-9e0d-0fceb0f33c8b', 'activo', '2024-01-15', true),
  ('6b287575-379d-450e-9626-dca3f0d5110d', '907f67c6-e5f1-4988-9e0d-0fceb0f33c8b', 'activo', '2024-01-15', true),
  ('99b6ca95-9e0e-4c56-a322-3ad4eee0fdeb', '907f67c6-e5f1-4988-9e0d-0fceb0f33c8b', 'activo', '2024-01-15', true),
 
  -- Administración de Empresas (6 estudiantes)
  ('3ed67e3b-0b35-42fa-8248-92a65d10a519', 'd0adbb54-c3e6-4994-b16b-28755320461f', 'activo', '2024-01-15', true),
  ('4fd47aec-1276-453b-807d-ffd6838b6ce4', 'd0adbb54-c3e6-4994-b16b-28755320461f', 'activo', '2024-01-15', true),
  ('df1a5eb4-4b2c-4b02-9193-730c7aa5f762', 'd0adbb54-c3e6-4994-b16b-28755320461f', 'activo', '2024-01-15', true),
  ('ca20cec0-80c2-4c97-965a-b31b0032d44c', 'd0adbb54-c3e6-4994-b16b-28755320461f', 'activo', '2024-01-15', true),
  ('7d588b7a-73e8-49df-873f-b86a2e9bac9f', 'd0adbb54-c3e6-4994-b16b-28755320461f', 'activo', '2024-01-15', true),
  ('8ad3d6bd-fa04-475b-8512-9f5319be35d0', 'd0adbb54-c3e6-4994-b16b-28755320461f', 'activo', '2024-01-15', true);
 
 
-- ============================================================================
-- 11. CURSO_ESTUDIANTE (inscribir estudiantes a cursos con notas)
-- ============================================================================
INSERT INTO curso_estudiante (curso_id, estudiante_id, estado_inscripcion, nota) VALUES
  -- Estudiantes de Ingeniería → curso Intro Programación
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000010', true, 85.50),
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000011', true, 92.00),
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000012', true, 78.25),
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000013', true, 65.00),
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000014', true, 55.75),
 
  -- Estudiantes de Ingeniería → curso Bases de Datos
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000010', true, 88.00),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000015', true, 91.50),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000016', true, 73.00),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000017', true, 60.00),
 
  -- Estudiantes de Derecho → Intro al Derecho
  ('40000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000020', true, 79.00),
  ('40000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000021', true, 83.50),
  ('40000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000022', true, 95.00),
  ('40000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000023', true, 47.00),
 
  -- Estudiantes de Admon → Fundamentos de Administración
  ('40000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000026', true, 88.50),
  ('40000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000027', true, 76.00),
  ('40000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000028', true, 91.00),
  ('40000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000029', true, 62.50),
  ('40000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000030', true, 55.00);






SELECT usuarios.id ,usuarios.nombre, roles.id, roles.nombre From usuarios INNER JOIN roles ON usuarios.rol_id = roles.id WHERE roles.nombre = 'estudiante';
