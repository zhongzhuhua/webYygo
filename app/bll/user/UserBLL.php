<?php  
  require_once $_SERVER['DOCUMENT_ROOT'].'/app/util/BLLCommon.php';
	
	// 用户
	class UserBLL {

		private $logkey = null;
		public function __construct() {
			$logkey = gm::getLogKey();
		}
     
    /**
     * 用户登录
     * @param openid 微信openid
     */
		public function loginByOpenId($openid) {
			$result = new JsonResult();
      $user;
			try {
				// 基础校验
        if(gm::isNull($openid)) {
          throw new MyException(gm::regMess('openId'));
        }

        // 查询用户是否存在
        $user = $this->_findByOpenId($openid);

        // 如果用户不存在，则注册
        if(is_null($user)) {
        	$this->_registerByOpenId($openid);
        	$user = $this->_findByOpenId($openid);
        }
 
        if(is_null($user)) {
        	$result->error('微信用户登录失败！');
        } else {
        	$result->data = $user;
        	$result->success('登录成功');	
        }
			} catch(MyException $e) {
        $result->error($e->errorMessage());
      } catch (Exception $e) {
        $result->error("code[$this->logkey]");
        gm::log(__CLASS__, __FUNCTION__, $e, $this->logkey);
      }

      return $result;
		}

		/**
		 * 通过微信 openid 注册新用户
		 * @param openid
		 */
		private function _registerByOpenId($openid) {
			$openid = gm::removeAttr($openid);
			$name = 'u_'.gm::getcode(10);
      $sql1 = "INSERT INTO u_user(name,openid,status) VALUES ('$name','$openid',0)";
      $sql2 = "insert into u_account(uid) select uid from u_user where openid='$openid'";
      $M = new MysqlDb();
      $result = $M->ope($sql1, null);
      $M->ope($sql2, null);
		}

		/**
		 * 根据微信openid获取用户
		 * @param openid
		 * @return 返回用户信息
		 */
		private function _findByOpenId($openid) {
			$result = null;
			$openid = gm::removeAttr($openid);
			if(!gm::isNull($openid)) {
				$sql = "SELECT uid,name,sex,age,birthday,email,mobile,photo,openid FROM u_user where openid='$openid' and status='0'";
				$M = new MysqlDb();
        $result = $M->findOne($sql);
			}
			return $result;
		}
	}
?>