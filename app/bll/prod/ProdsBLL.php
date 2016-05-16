<?php  
  require_once $_SERVER['DOCUMENT_ROOT'].'/app/util/BLLCommon.php';

  // 产品
  class ProdsBLL {

    private $logkey = null;
    public function __construct() {
      $logkey = gm::getLogKey();
    }


    /**
     * 根据产品id列表查询产品
     * @param $ids id 列表，格式 id|id|id
     */
    public function findByIdList($ids) {
      $result = new JsonResult();
      try {
        if($ids != null && is_string($ids) && !gm::isNull($ids)) {
          $list = $this->_findByIdList($ids);
          $result->data = $list;
        }
        $result->success();
      } catch(MyException $e) {
        $result->error($e->errorMessage());
      } catch (Exception $e) {
        $result->error("code[$this->logkey]");
        gm::log(__CLASS__, __FUNCTION__, $e, $this->logkey);
      }

      return $result;
    }

    /**
     * 根据产品id列表查询产品
     * @param $ids id 列表，格式 id|id|id
     */
    private function _findByIdList($ids) {
      $result = null;

      if(!gm::isNull($ids)) {
        $arr = explode('|', $ids);
        $append = '';
        $len = 0;
        if($arr != null) {
          foreach ($arr as $id) {
            if(gm::regInt($id)) {
              $append = $append."$id,";
              $len++;
            }
          }
        }

        if($len != 0) {
          $append = trim($append, ",");
          $append = "($append)";

          // 执行查询
          $sql = "SELECT a.orderno,b.id,b.name,b.img_path,a.ordernum,a.maxcount,a.prod_price,a.now_price,a.frozen_price FROM o_order a "
                ."INNER JOIN p_prods b ON a.pid = b.id "
                ."WHERE a.status = 0 AND a.pid IN $append";
          $M = new MysqlDb();
          $result = $M->find($sql); 
        }
      }
      
      return $result;
    }
  }
?>