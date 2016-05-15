<?php  
  require_once $_SERVER['DOCUMENT_ROOT'].'/app/util/BLLCommon.php';

  // 订单
  class OrderBLL {

  	private $logkey = null;
		public function __construct() {
			$logkey = gm::getLogKey();
		}


		/**
		 * 分页查询订单
     * @param $time 开始时间
		 * @param sort 排序依据 0=即将揭晓，1=人气，2=最新，3=价格降序， 4=价格升序
     * @param index 第几页
     * @param $size 每页大小
		 */
		public function pageForList($time, $sort, $index = 1, $size = 20) {
      $result = new JsonResult();
      try {
        $list = $this->_pageForList($time, $sort, $index, $size);
        $result->data = $list;
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
     * 分页查询订单
     * @param $time 开始时间
     * @param sort 排序依据 0=即将揭晓，1=人气，2=最新，3=价格降序， 4=价格升序
     * @param index 第几页
     * @param $size 每页大小
     */
    private function _pageForList($time, $sort, $index = 1, $size = 20) {
      $result = null;

      // 日期判断
      $time = gm::removeAttr($time);

      // 排序判断
      $appendSort = '';
      if(!gm::regInt($sort)) {
        $sort = 0;
      }
      if($sort == '4') {
        $appendSort = 'order by a.prod_price asc';
      } else if ($sort == '3') {
        $appendSort = 'order by a.prod_price desc';
      } else if ($sort == '2') {
        $appendSort = 'order by a.createtime desc';
      } else if ($sort == '1') {
        $appendSort = 'order by a.ordernum desc';
      } else {
        $appendSort = 'order by a.now_price/a.prod_price desc';
      }

      // 分页判断
      if(!gm::regInt($index)) {
        $index = 1;
      }
      if(!gm::regInt($size)) {
        $size = 20;
      }
      if($index <= 0) {
        $index = 1;
      }
      if($size <= 0) {
        $size = 20;
      }

      $begin = ($index - 1) * $size;
      $end = $index * $size + 1;
 
      // 执行查询
      $sql = "SELECT a.id,a.pid,a.orderno,b.img_path,b.name,a.ordernum,a.prod_price,a.now_price,a.frozen_price,a.tid FROM o_order a "
            ."INNER JOIN p_prods b ON a.pid=b.id "
            ."WHERE a.status = 0 and a.createtime<='$time' $appendSort limit $begin,$end";

      $M = new MysqlDb();
      $result = $M->find($sql); 
      return $result;
    }
  }
?>