<?php 

namespace Model;

use MVC\Router;

class Usuario extends ActiveRecord {
     // base de datos
     protected static $tabla = 'usuarios';
     protected static $columnasDB = ['id', 'nombre', 'apellido', 'email',
     'telefono', 'password', 'admin', 'confirmado', 'token'];

        public $id;
        public $nombre;
        public $apellido;
        public $email;
        public $telefono;
        public $password;
        public $admin;
        public $confirmado;
        public $token;

        public function __construct($args = [])
        {
            $this->id = $args['id'] ?? null;
            $this->nombre = $args['nombre'] ?? '';
            $this->apellido = $args['apellido'] ?? '';
            $this->email = $args['email'] ?? '';
            $this->telefono = $args['telefono'] ?? '';
            $this->password = $args['password'] ?? '';
            $this->admin = $args['admin'] ?? 0;
            $this->confirmado = $args['confirmado'] ?? 0;
            $this->token = $args['token'] ?? '';

        }

        // mensaje de validacion para creacion de cuentas
        public function validarNuevaCuenta() {
            if(!$this->nombre) {
                self::$alertas['error'] [] = 'El Nombre es Obligatorio';
            }

            if (!$this->apellido) {
                self::$alertas['error'][] = 'El Apellido es Obligatorio';
            }
            if (!$this->telefono) {
                self::$alertas['error'][] = 'El Telefono es Obligatorio';
            }

            if (!$this->email) {
                self::$alertas['error'][] = 'El Email es Obligatorio';
            }
            if (!$this->password) {
                self::$alertas['error'][] = 'El Password es Obligatorio';
            }
            if(strlen($this->password < 6)) {
                self::$alertas['error'][] = 'El Password debe ser mayor a 6 caracteres';

            }

            return self::$alertas;
        }
        public function validarLogin() {
            if(!$this->email) {
                self::$alertas['error'][] = 'El Email es Obligatorio';
            }
            if (!$this->password) {
                self::$alertas['error'][] = 'El Password es Obligatorio';
            }
            return self::$alertas;
        }
        public function validarEmail() {
            if (!$this->email) {
                self::$alertas['error'][] = 'El Email es Obligatorio';
            }
            return self::$alertas;
        }

        public function validarPassword() {
            if(!$this->password){
                self::$alertas['error'][] = 'El Password es Obligatorio';
            }
            if(strlen($this->password) < 6){
                self::$alertas['error'][] = 'El password debe tener al menos 6 caracteres';
            }

            return self::$alertas;
        }

        //revisa si el usuario ya existe
        public function existeUsuario() {
            $query = " SELECT * FROM " . self::$tabla . " WHERE email = '" . $this->email . "' LIMIT 1";

            $resultado = self::$db->query($query);
            if($resultado->num_rows) {
                self::$alertas['error'][] = 'El Usuario Ya Está Registrado';
             }
            return $resultado;
        }

        public function hashPassword() {
            $this->password = password_hash($this->password, PASSWORD_BCRYPT);
        }
        public function crearToken() {
            $this->token = uniqid();
        }
        public function comprobarPasswordAndVerificado($password) {
            $resultado = password_verify($password, $this->password);

            if(!$resultado || !$this->confirmado) {
                self::$alertas['error'][] = 'Password Incorrecto o tu cuenta no ha sido confirmada aún';
            } else {
                return true;
            }
        }


}