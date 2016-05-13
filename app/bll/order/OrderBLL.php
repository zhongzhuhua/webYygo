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
		 * @param sort 排序依据 0=即将揭晓，1=人气，2=最新，3=价格
		 */
		public function pageForList($sort, $index, $size) {

		}
  }
?>