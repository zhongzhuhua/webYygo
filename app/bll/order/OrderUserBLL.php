<?php  
  require_once $_SERVER['DOCUMENT_ROOT'].'/app/util/BLLCommon.php';

  // 用户订单 ou_order + ou_orderinfo
  class OrderUserBLL {

    private $logkey = null;
    public function __construct() {
      $logkey = gm::getLogKey();
    }


    /**
     * 新增用户订单
     * @memo 每次新增用户订单的时候，先解冻用户未付款的订单
     * @param uid 用户
     * @param prods 要购买的产品信息  格式：订单号=数量|订单号=数量
     */
    public function insert($uid, $prods) {
      $result = new JsonResult();
      $order = null;
      try {
        // 基础校验
        $prods = trim($prods, '|');
        if(gm::isNull($uid)) {
          throw new MyException('login');
        }

        if(gm::isNull($prods)) {
          throw new MyException('订单产品异常，请退出重试');
        }

        // 新增订单
        $prodList = explode('|', $prods);
        $order = $this->_insert($uid, $prodList);

        if(!gm::isNull($order)) {
          $result->data = $order;
          $result->success('');
        } else {
          throw new MyException('提交订单失败，请刷新重试');
        }
      } catch(MyException $e) {
        $result->error($e->errorMessage(), $e->errorMessage() == 'login' ? '2' : '1');
      } catch (Exception $e) {
        $result->error('提交订单失败，错误代码：'.$this->errkey);
        gm::log(__CLASS__, __FUNCTION__, $e, $this->logkey);
      }

      return $result;
    }

    /**
     * 解冻用户订单，无返回值
     * @memo 根据用户号，解冻该用户未解冻的订单
     * @param uid 用户
     */
    public function unfrozen($uid) {
      try {
        // 基础校验
        if(!gm::isNull($uid)) {
          $this->_unfrozen($uid);
        }
      } catch (Exception $e) {
        gm::log(__CLASS__, __FUNCTION__, $e, $this->logkey);
      }
    }

    /**
     * 订单支付成功，解冻产品金额，更改用户订单状态，返回 '' 则是执行成功
     * @param orderno 成功支付的订单
     * @param fees 成功支付的金额，以元为单位
     */
    public function paySuccess($orderno, $fees) {
      $result = new JsonResult();
      try {
        $msg = $this->_paySuccess($orderno, $fees);
        if(gm::isNull($msg)) {
          $result->success('订单支付成功');
        }
      } catch(MyException $e) {
        $result->error($e->errorMessage());
      } catch (Exception $e) {
        $result->error('订单支付失败，错误代码：'.$this->logkey);
        gm::log(__CLASS__, __FUNCTION__, $e, $this->logkey);
      }

      return $result;
    }

    /**
     * 新增用户订单
     * @param uid 用户
     * @param prodList ['order=num','order=num']
     */
    private function _insert($uid, $prodList) {

      // 创建订单时间
      $ou_orderno = gm::getOrderNo();
      $utime = gm::getNowTime();
      $result = null;
      $fees = 0;
 
      try {
        // 基础校验
        $uid = gm::removeAttr($uid);

        if(gm::isNull($uid) || gm::isNull($prodList)) {
          throw new MyException('订单提交失败,请刷新重试');
        }

        // 新增用户订单语句
        $insertSql = "insert into ou_order(orderno, uid, utime) values('$ou_orderno', '$uid', '$utime')";

        // 新增订单详情语句
        $insertInfoSql = "insert into ou_orderinfo(orderno,ou_orderno,times) values ";
        $sql_append = "";

        // 要冻结的产品语句
        $updateSqls = array();

        // 循环拼接语句
        foreach ($prodList as $prod) {
          if(!gm::isNull($prod) && strpos($prod, '=') > -1) {
            $_prod = explode('=', $prod);
            $orderno = gm::removeAttr($_prod[0]);
            $num = gm::isNull($_prod[1]) ? 0 : intval($_prod[1]);

            // 如果产品有问题
            if(gm::isNull($orderno) || $num <= 0) {
              throw new MyException('订单提交失败,请刷新重试');
            }

            $fees = $fees + $num;
            // 添加一个产品
            $sql_append .= " ('$orderno','$ou_orderno','$num'),";
            // 冻结该订单对应的金额
            $updateSqls[] = 
               "UPDATE o_order a SET a.frozen_price=a.frozen_price+$num,a.now_price=a.now_price+$num "
              ."WHERE a.orderno='$orderno' AND a.status=0 AND a.now_price+$num<=a.prod_price";
          }
        }

        // 新增订单详情语句处理
        if(gm::isNull($sql_append)) {
          return null;
        } else {
          $sql_append = rtrim($sql_append, ',');
        }
        $insertInfoSql = $insertInfoSql.$sql_append;

        $M = new MysqlDb();
        $conn = $M->getConn();

        // 事务 - 开启
        $M->begin($conn);

        // 事务 - 冻结产品数量
        foreach ($updateSqls as $usql) {
          $count = $M->ope($usql, $conn);
          if(gm::isNull($count) || $count != 1) {
            throw new MyException("产品数量不足，请刷新重试");
          }
        }

        // 事务 - 新增订单
        $M->ope($insertSql, $conn);

        // 事务 - 新增订单明细
        $M->ope($insertInfoSql, $conn);

        // 事务 - 提交 
        // $M->rollback($conn); 
        $M->commit($conn);   
        

        // 返回订单信息
        $result = array(
          'orderno' => $ou_orderno,
          'fees' => $fees
        );
      } catch(Exception $e) {
        if(!is_null($M)) {
          $M->rollback($conn);
        }
        throw $e;
      }

      return $result;
    }

    /**
     * 解冻用户订单，无返回值
     * @param uid 用户
     */
    private function _unfrozen($uid) {
      $uid = gm::removeAttr($uid);
      if(!gm::isNull($uid)) {
        $sql = "call pro_unfrozen('$uid', @result)";
        $M = new MysqlDb();
        $result = $M->prodOut($sql);
        if(!gm::isNull($result)) {
          gm::log(__CLASS__, __FUNCTION__, $e, $this->logkey);
        }
      }
    }

    /**
     * 订单支付成功，解冻产品金额，更改用户订单状态
     * @param orderno 成功支付的订单
     * @param fees 成功支付的金额，以元为单位
     * @return string '' 代表执行成功
     */
    private function _paySuccess2($orderno, $fees) {
      $result = '支付失败，请刷新重试';
      $M;
      $conn;
      try {
        $orderno = gm::removeAttr($orderno);
        if(gm::isNull($orderno)) {
          return '该订单不存在';
        }

        if($fees == null) {
          return '支付失败，支付金额异常';
        }

        // 数据库操作
        $M = new MysqlDb();

        // 查询订单所有产品
        $sql = 
           "SELECT COUNT(times) FROM ou_order ou "
          ."INNER JOIN ou_orderinfo oi ON ou.orderno=oi.ou_orderno AND ou.status=12 AND ou.orderno='$orderno' "
          ."INNER JOIN o_order o ON oi.orderno=o.orderno";
        $needFee = $M->findOne($sql, null);

        if(gm::isNull($needFee) || $needFee == '0') {
          return '订单详情异常，请刷新重试';
        } else if($needFee != $fees) {
          if(!configs::$wxtest) {
            return '支付失败，支付金额错误';
          }
        }

        // =========== 开始事务 ============
        $conn = $M->getConn();
        $M->begin($conn);

        // === 更新产品冻结数量 ===
        $sql = 
           "UPDATE o_order a "
          ."INNER JOIN ("
          ."  SELECT oi.orderno,oi.times FROM ou_order ou "
          ."  INNER JOIN ou_orderinfo oi ON ou.orderno=oi.ou_orderno AND ou.status=12 AND ou.orderno='$orderno' "
          .") b ON a.orderno=b.orderno "
          ."SET a.frozen_price=a.frozen_price-b.times,"
          ."a.status=(CASE WHEN (a.prod_price=a.now_price AND a.frozen_price-b.times=0) THEN 10 ELSE a.status END) "
          ."WHERE a.frozen_price-b.times>=0 ";

        // === 解冻商品数量 ===
        $count = $M->ope($sql, $conn);
        if(gm::isNull($count) || $count < 1) {
          throw new MyException('解冻产品数量异常');
        }

        // === 更新订单状态 ===
        $usql = "update ou_order a set a.status='0' where a.status='12' and a.orderno='$orderno'";
        $count = $M->ope($usql, $conn);
        if(gm::isNull($count) || $count != 1) {
          throw new MyException('更新订单状态失效');
        }
        

        $M->commit($conn);

        // 创建新订单
        try {
          $M->prod("call pro_payorder('$orderno')");
        } catch(Exception $e) { }

        return '';
      } catch(Exception $e) {
        if(!is_null($M)) {
          $M->rollback($conn);
        }
        throw $e;
      }

      return $result;
    }

    /**
     * 订单支付成功，解冻产品金额，更改用户订单状态
     * @param orderno 成功支付的订单
     * @param fees 成功支付的金额，以元为单位
     * @return string '' 代表执行成功
     */
    private function _paySuccess($orderno, $fees) {
      $result = '支付失败，请刷新重试';
      $M;
      $conn;
      try {
        $orderno = gm::removeAttr($orderno);
        if(gm::isNull($orderno)) {
          return '该订单不存在';
        }

        if($fees == null) {
          return '支付失败，支付金额异常';
        }

        // 数据库操作
        $M = new MysqlDb();

        // 查询订单所有产品
        $sql = 
           "SELECT COUNT(times) FROM ou_order ou "
          ."INNER JOIN ou_orderinfo oi ON ou.orderno=oi.ou_orderno AND ou.status=12 AND ou.orderno='$orderno' "
          ."INNER JOIN o_order o ON oi.orderno=o.orderno";
        $needFee = $M->findOne($sql, null);

        if(gm::isNull($needFee) || $needFee == '0') {
          return '订单详情异常，请刷新重试';
        } else if($needFee != $fees) {
          if(!configs::$wxtest) {
            return '支付失败，支付金额错误';
          }
        }

        // =========== 开始事务 ============
        $conn = $M->getConn();
        $M->begin($conn);

        // === 更新产品冻结数量 ===
        $sql = 
           "UPDATE o_order a "
          ."INNER JOIN ("
          ."  SELECT oi.orderno,oi.times FROM ou_order ou "
          ."  INNER JOIN ou_orderinfo oi ON ou.orderno=oi.ou_orderno AND ou.status=12 AND ou.orderno='$orderno' "
          .") b ON a.orderno=b.orderno "
          ."SET a.frozen_price=a.frozen_price-b.times,"
          ."a.status=(CASE WHEN (a.prod_price=a.now_price AND a.frozen_price-b.times=0) THEN 10 ELSE a.status END) "
          ."WHERE a.frozen_price-b.times>=0 ";

        // === 解冻商品数量 ===
        $count = $M->ope($sql, $conn);
        if(gm::isNull($count) || $count < 1) {
          throw new MyException('解冻产品数量异常');
        }

        // === 更新订单状态 ===
        $usql = "update ou_order a set a.status='0' where a.status='12' and a.orderno='$orderno'";
        $count = $M->ope($usql, $conn);
        if(gm::isNull($count) || $count != 1) {
          throw new MyException('更新订单状态失效');
        }
        

        $M->commit($conn);

        // 创建新订单
        try {
          $M->prod("call pro_payorder('$orderno')");
        } catch(Exception $e) { }

        return '';
      } catch(Exception $e) {
        if(!is_null($M)) {
          $M->rollback($conn);
        }
        throw $e;
      }

      return $result;
    }    
  }
?>