<?php
  // 自定义异常
  class MyException extends Exception {
    public function __construct($message, $code = 0) {
      parent::__construct($message, $code);
    }

    public function __toString() {
      return __CLASS__.':['.$this->code.']:'.$this->message.'\n';
    }

    public function errorMessage() {
      return $this->message;
    }
  }
?>