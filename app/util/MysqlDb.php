<?php
  require_once $_SERVER['DOCUMENT_ROOT'].'/configs.php';
  
  // 数据库链接
  class MysqlDb {
    // 数据库配置文件
    protected $config = null;
    private $conn = null;
    public function __construct(){
      $this->config = configs::$dblink;
      $this->getConn();
    }

    // 获取数据库链接
    public function getConn(){
      if($this->conn === null){
        $this->conn = new mysqli($this->config["DB_HOST"],$this->config["DB_USER"],$this->config["DB_PWD"],$this->config["DB_BASE"],$this->config["DB_PORT"]);
        $this->conn->set_charset("utf8");
      }
      return $this->conn;
    }

    // 查询多条记录
    public function find($sql){
      $conn = $this->getConn();
      $result = $conn->query($sql);
      $list = array();
      while($row = $result->fetch_array()){
        $list[] = $row;
      }
      return $list; 
    }

    // 查询单挑记录
    public function findOne($sql){
      $result = $this->find($sql);
      if(count($result)>0){
        return $result[0];
      }else{
        return null;
      }
    }

    // 新增、修改、删除 返回受影响行数
    public function ope($sql, $conn){
      $conn = is_null($conn) ? $this->getConn() : $conn;
      $conn->query($sql);
      return $conn->affected_rows;
    }

    // 不带出参的存储过程
    public function prod($sql) {
      $conn = $this->getConn();
      $conn->query($sql);
      return true;
    }

    // 带一个输出参数 @result 的存储过程
    public function prodOut($sql) {
      $conn = $this->getConn();
      $conn->query($sql);
      $result = $conn->query('select @result as result');
      $row = $result->fetch_object();
      return $row->result;
    }

    // 关闭链接
    public function close($conn) {
      if(!is_null($conn)) $conn->close();
    }

    // 开始事务
    public function begin($conn) {
      if(!is_null($conn)) $conn->autocommit(false);
    }

    // 提交事务
    public function commit($conn) {
      if(!is_null($conn)) $conn->commit();
    }

    // 回滚事务
    public function rollback($conn) {
      if(!is_null($conn)) $conn->rollback();
    }
  }
?>
